/**
 * Client-side PDF rendering and content extraction built on pdf.js (pdfjs-dist),
 * plus DOCX / PPTX export built on the docx and pptxgenjs libraries.
 *
 * Everything here runs in the browser. All heavy libraries are imported
 * dynamically so they only load on the tool pages that need them.
 */

export interface RenderedPage {
  /** 1-based page number */
  pageNumber: number;
  blob: Blob;
  width: number;
  height: number;
}

export interface PageText {
  /** 1-based page number */
  pageNumber: number;
  /** Paragraph-ish blocks of text reconstructed from the page */
  paragraphs: string[];
}

async function pdfjs() {
  const lib = await import("pdfjs-dist");
  if (!lib.GlobalWorkerOptions.workerPort && !lib.GlobalWorkerOptions.workerSrc) {
    lib.GlobalWorkerOptions.workerPort = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" }
    );
  }
  return lib;
}

async function openWithPdfJs(file: File) {
  const lib = await pdfjs();
  const data = await file.arrayBuffer();
  try {
    return await lib.getDocument({
      data,
      // Bundled with the site (copied from pdfjs-dist) so PDFs using
      // non-embedded standard or CID fonts render and extract correctly.
      standardFontDataUrl: "/pdfjs/standard_fonts/",
      cMapUrl: "/pdfjs/cmaps/",
      cMapPacked: true,
    }).promise;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (/password/i.test(msg)) {
      throw new Error(`"${file.name}" appears to be password protected. Remove the password first, then try again.`);
    }
    throw new Error(`"${file.name}" could not be read. It may be corrupted or not a valid PDF.`);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The page could not be converted to an image."))),
      type,
      quality
    );
  });
}

/** Render every page (or the given 0-based page indices) of a PDF to image blobs. */
export async function renderPdfToImages(
  file: File,
  options: {
    format: "image/jpeg" | "image/png";
    /** JPG quality 0–1, ignored for PNG */
    quality?: number;
    /** Rendering scale. 2 ≈ 144 DPI, good default for screens and slides. */
    scale?: number;
    /** 0-based page indices; omit for all pages */
    pageIndices?: number[];
    onProgress?: (done: number, total: number) => void;
  }
): Promise<RenderedPage[]> {
  const doc = await openWithPdfJs(file);
  const scale = options.scale ?? 2;
  const indices = options.pageIndices ?? Array.from({ length: doc.numPages }, (_, i) => i);
  const out: RenderedPage[] = [];
  try {
    for (let i = 0; i < indices.length; i++) {
      const page = await doc.getPage(indices[i] + 1);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser could not create a drawing canvas for rendering.");
      if (options.format === "image/jpeg") {
        // JPG has no transparency; paint a white background first.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      await page.render({ canvasContext: ctx, viewport }).promise;
      const blob = await canvasToBlob(canvas, options.format, options.quality);
      out.push({ pageNumber: indices[i] + 1, blob, width: canvas.width, height: canvas.height });
      canvas.width = 0;
      canvas.height = 0;
      options.onProgress?.(i + 1, indices.length);
    }
  } finally {
    await doc.destroy();
  }
  return out;
}

interface TextItemLike {
  str: string;
  transform: number[];
  hasEOL?: boolean;
}

/**
 * Extract text from every page, grouped into paragraph-like blocks.
 * pdf.js returns positioned text fragments; we join fragments on the same
 * line and start a new paragraph when the vertical gap is large.
 */
export async function extractPdfText(
  file: File,
  onProgress?: (done: number, total: number) => void
): Promise<PageText[]> {
  const doc = await openWithPdfJs(file);
  const pages: PageText[] = [];
  try {
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      const items = (content.items as TextItemLike[]).filter((it) => typeof it.str === "string");

      const paragraphs: string[] = [];
      let current = "";
      let lastY: number | null = null;
      let lastHeight = 12;

      for (const it of items) {
        const y = it.transform[5];
        const h = Math.abs(it.transform[3]) || lastHeight;
        if (lastY !== null) {
          const gap = Math.abs(lastY - y);
          if (gap > h * 1.8) {
            // Large vertical jump → new paragraph
            if (current.trim()) paragraphs.push(current.replace(/\s+/g, " ").trim());
            current = "";
          } else if (gap > h * 0.5) {
            // Normal line break within the same paragraph
            current += current.endsWith("-") ? "" : " ";
          }
        }
        current += it.str;
        if (it.hasEOL) current += " ";
        lastY = y;
        lastHeight = h;
      }
      if (current.trim()) paragraphs.push(current.replace(/\s+/g, " ").trim());

      pages.push({ pageNumber: p, paragraphs });
      onProgress?.(p, doc.numPages);
    }
  } finally {
    await doc.destroy();
  }
  return pages;
}

/** Bundle rendered page images into a single ZIP for one-click download. */
export async function zipRenderedPages(pages: RenderedPage[], baseName: string, ext: "jpg" | "png"): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const pad = String(pages[pages.length - 1]?.pageNumber ?? 1).length;
  for (const p of pages) {
    zip.file(`${baseName}-page-${String(p.pageNumber).padStart(pad, "0")}.${ext}`, p.blob);
  }
  return zip.generateAsync({ type: "blob" });
}

/** Build an editable Word (.docx) document from the PDF's extracted text. */
export async function pdfToDocx(file: File, onProgress?: (done: number, total: number) => void): Promise<Blob> {
  const pages = await extractPdfText(file, onProgress);
  const totalChars = pages.reduce((n, pg) => n + pg.paragraphs.join("").length, 0);
  if (totalChars === 0) {
    throw new Error(
      "No selectable text was found in this PDF. It is probably a scanned document (images of pages), which needs OCR software to convert — this tool converts text-based PDFs only."
    );
  }
  const { Document, Packer, Paragraph, TextRun, PageBreak } = await import("docx");

  const children: InstanceType<typeof Paragraph>[] = [];
  pages.forEach((pg, idx) => {
    pg.paragraphs.forEach((text) => {
      children.push(
        new Paragraph({ children: [new TextRun({ text, size: 22 })], spacing: { after: 160 } })
      );
    });
    if (idx < pages.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBlob(doc);
}

/** Build a PowerPoint (.pptx) where each PDF page becomes one full-bleed slide. */
export async function pdfToPptx(file: File, onProgress?: (done: number, total: number) => void): Promise<Blob> {
  const rendered = await renderPdfToImages(file, {
    format: "image/jpeg",
    quality: 0.9,
    scale: 2,
    onProgress,
  });
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();

  // Size slides to match the first page's aspect ratio so nothing is distorted.
  const first = rendered[0];
  const widthIn = 10;
  const heightIn = Math.min(Math.max((first.height / first.width) * widthIn, 4), 20);
  pptx.defineLayout({ name: "PDF", width: widthIn, height: heightIn });
  pptx.layout = "PDF";

  for (const page of rendered) {
    const dataUrl = await blobToDataUrl(page.blob);
    const slide = pptx.addSlide();
    // Fit the page image inside the slide, centered, preserving aspect ratio.
    const pageRatio = page.width / page.height;
    const slideRatio = widthIn / heightIn;
    let w = widthIn;
    let h = heightIn;
    if (pageRatio > slideRatio) h = widthIn / pageRatio;
    else w = heightIn * pageRatio;
    slide.addImage({ data: dataUrl, x: (widthIn - w) / 2, y: (heightIn - h) / 2, w, h });
  }
  const out = await pptx.write({ outputType: "blob" });
  return out as Blob;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("A rendered page could not be encoded."));
    reader.readAsDataURL(blob);
  });
}

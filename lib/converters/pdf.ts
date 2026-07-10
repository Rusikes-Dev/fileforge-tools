/**
 * Client-side PDF operations built on pdf-lib.
 * pdf-lib is imported dynamically by callers so it only loads on PDF tool pages.
 */
import type { PDFDocument as PDFDocumentType, PDFRef as PDFRefType, PDFStream as PDFStreamType } from "pdf-lib";
import type { PageRange } from "./ranges";
import { rangesToPageIndices } from "./ranges";

export const PDF_SIZE_LIMIT = 50 * 1024 * 1024; // 50 MB
export const PDF_COUNT_LIMIT = 20;

export function validatePdfFile(file: File): string | null {
  if (file.size > PDF_SIZE_LIMIT) {
    return `"${file.name}" is larger than the current 50 MB browser-processing limit.`;
  }
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return `"${file.name}" is not a PDF file.`;
  return null;
}

async function pdfLib() {
  return import("pdf-lib");
}

export async function loadPdf(file: File): Promise<PDFDocumentType> {
  const { PDFDocument } = await pdfLib();
  const bytes = await file.arrayBuffer();
  try {
    return await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (/encrypted/i.test(msg)) {
      throw new Error(`"${file.name}" appears to be password protected. Remove the password first, then try again.`);
    }
    throw new Error(`"${file.name}" could not be read. It may be corrupted or not a valid PDF.`);
  }
}

export async function countPages(file: File): Promise<number> {
  const doc = await loadPdf(file);
  return doc.getPageCount();
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const { PDFDocument } = await pdfLib();
  const merged = await PDFDocument.create();
  for (const file of files) {
    const src = await loadPdf(file);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  return merged.save();
}

export async function extractPages(file: File, indices: number[]): Promise<Uint8Array> {
  const { PDFDocument } = await pdfLib();
  const src = await loadPdf(file);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export async function splitPdf(file: File, ranges: PageRange[]): Promise<Array<{ label: string; bytes: Uint8Array }>> {
  const { PDFDocument } = await pdfLib();
  const src = await loadPdf(file);
  const parts: Array<{ label: string; bytes: Uint8Array }> = [];
  for (const range of ranges) {
    const out = await PDFDocument.create();
    const indices = rangesToPageIndices([range]);
    const pages = await out.copyPages(src, indices);
    pages.forEach((p) => out.addPage(p));
    parts.push({
      label: range.start === range.end ? `page-${range.start}` : `pages-${range.start}-${range.end}`,
      bytes: await out.save(),
    });
  }
  return parts;
}

export async function rotatePdf(file: File, angle: 90 | 180 | 270, pageIndices?: number[]): Promise<Uint8Array> {
  const { degrees } = await pdfLib();
  const doc = await loadPdf(file);
  const targets = pageIndices ?? doc.getPageIndices();
  for (const idx of targets) {
    const page = doc.getPage(idx);
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + angle) % 360));
  }
  return doc.save();
}

export type WatermarkPosition = "diagonal" | "center" | "top" | "bottom";

export interface WatermarkOptions {
  text: string;
  /** Font size in points */
  fontSize: number;
  /** 0–1 */
  opacity: number;
  position: WatermarkPosition;
}

export async function watermarkPdf(file: File, opts: WatermarkOptions): Promise<Uint8Array> {
  const { StandardFonts, degrees, rgb } = await pdfLib();
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const color = rgb(0.5, 0.5, 0.5);
  const textWidth = font.widthOfTextAtSize(opts.text, opts.fontSize);
  const textHeight = font.heightAtSize(opts.fontSize);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    if (opts.position === "diagonal") {
      // Rotated around the text's start point; offset so it appears centered on the page.
      const offset = (textWidth / 2) * Math.cos(Math.PI / 4);
      page.drawText(opts.text, {
        x: width / 2 - offset,
        y: height / 2 - offset,
        size: opts.fontSize,
        font,
        color,
        opacity: opts.opacity,
        rotate: degrees(45),
      });
    } else {
      const x = (width - textWidth) / 2;
      const y =
        opts.position === "top"
          ? height - textHeight - 36
          : opts.position === "bottom"
            ? 36
            : (height - textHeight) / 2;
      page.drawText(opts.text, {
        x,
        y,
        size: opts.fontSize,
        font,
        color,
        opacity: opts.opacity,
      });
    }
  }
  return doc.save();
}

export type PageSize = "auto" | "a4" | "letter";
export type Orientation = "auto" | "portrait" | "landscape";

const SIZES: Record<Exclude<PageSize, "auto">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export interface ImagesToPdfOptions {
  pageSize: PageSize;
  orientation: Orientation;
  /** margin in points */
  margin: number;
}

export async function imagesToPdf(files: File[], opts: ImagesToPdfOptions): Promise<Uint8Array> {
  const { PDFDocument } = await pdfLib();
  const doc = await PDFDocument.create();
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    let pageW: number;
    let pageH: number;
    if (opts.pageSize === "auto") {
      pageW = image.width + opts.margin * 2;
      pageH = image.height + opts.margin * 2;
    } else {
      let [w, h] = SIZES[opts.pageSize];
      const landscape =
        opts.orientation === "landscape" ||
        (opts.orientation === "auto" && image.width > image.height);
      if (landscape) [w, h] = [h, w];
      pageW = w;
      pageH = h;
    }
    const page = doc.addPage([pageW, pageH]);
    const maxW = pageW - opts.margin * 2;
    const maxH = pageH - opts.margin * 2;
    const scale = Math.min(maxW / image.width, maxH / image.height, opts.pageSize === "auto" ? 1 : Infinity);
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    page.drawImage(image, {
      x: (pageW - drawW) / 2,
      y: (pageH - drawH) / 2,
      width: drawW,
      height: drawH,
    });
  }
  return doc.save();
}

export interface CompressPdfResult {
  bytes: Uint8Array;
  /** Total image XObjects found across the document */
  imagesFound: number;
  /** How many of those were actually re-compressed */
  imagesCompressed: number;
  originalSize: number;
  compressedSize: number;
}

/**
 * Recompresses standard RGB JPEG images embedded in a PDF to reduce file size.
 *
 * Scope, by design: this only touches image XObjects that use the DCTDecode
 * (JPEG) filter with an 8-bit DeviceRGB color space — by far the most common
 * case for scanned color documents and photo-heavy PDFs. Grayscale scans,
 * CMYK images, and already-lossless (Flate-encoded) images are left
 * untouched rather than risking an incorrect re-encode, since getting a
 * color-space conversion wrong would corrupt how the PDF renders. If no
 * compressible images are found, imagesCompressed will be 0 and the
 * resulting file may not shrink — callers should surface that honestly
 * rather than implying every PDF can be compressed.
 */
export async function compressPdf(file: File, quality: number): Promise<CompressPdfResult> {
  const { PDFName, PDFDict, PDFRef, PDFRawStream, PDFStream } = await pdfLib();
  const doc = await loadPdf(file);
  const context = doc.context;

  let imagesFound = 0;
  let imagesCompressed = 0;
  const processedRefs = new Set<string>();

  const nameFilter = PDFName.of("Filter");
  const nameSubtype = PDFName.of("Subtype");
  const nameColorSpace = PDFName.of("ColorSpace");
  const nameBitsPerComponent = PDFName.of("BitsPerComponent");
  const nameImage = PDFName.of("Image");
  const nameDctDecode = PDFName.of("DCTDecode");
  const nameDeviceRgb = PDFName.of("DeviceRGB");
  const nameXObject = PDFName.of("XObject");
  const nameWidth = PDFName.of("Width");
  const nameHeight = PDFName.of("Height");

  for (const page of doc.getPages()) {
    const resources = page.node.Resources();
    if (!resources) continue;
    const xObjects = resources.lookupMaybe(nameXObject, PDFDict);
    if (!xObjects) continue;

    for (const [, value] of xObjects.entries()) {
      let ref: PDFRefType | undefined;
      let stream: PDFStreamType | undefined;

      if (value instanceof PDFRef) {
        ref = value;
        const resolved = context.lookup(value);
        if (resolved instanceof PDFStream) stream = resolved;
      } else if (value instanceof PDFStream) {
        stream = value;
      }
      if (!stream) continue;

      const subtype = stream.dict.lookup(nameSubtype);
      if (subtype !== nameImage) continue;

      imagesFound++;

      const refKey = ref?.toString();
      if (refKey && processedRefs.has(refKey)) continue; // shared XObject, already handled

      // Only the common, safe case: single DCTDecode filter, 8-bit DeviceRGB.
      const filter = stream.dict.lookup(nameFilter);
      const isDct = filter === nameDctDecode;
      if (!isDct) continue;

      const colorSpace = stream.dict.lookup(nameColorSpace);
      if (colorSpace !== nameDeviceRgb) continue;

      const bpc = stream.dict.lookup(nameBitsPerComponent);
      const bpcNum = bpc && "asNumber" in bpc ? (bpc as { asNumber(): number }).asNumber() : 8;
      if (bpcNum !== 8) continue;

      const rawBytes = stream.getContents();
      try {
        const blob = new Blob([rawBytes as BlobPart], { type: "image/jpeg" });
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          bitmap.close();
          continue;
        }
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();

        const newBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", quality)
        );
        if (!newBlob) continue;
        const newBytes = new Uint8Array(await newBlob.arrayBuffer());

        if (newBytes.length < rawBytes.length && ref) {
          const newDict = stream.dict.clone(context);
          newDict.set(nameWidth, context.obj(canvas.width));
          newDict.set(nameHeight, context.obj(canvas.height));
          const newStream = PDFRawStream.of(newDict, newBytes);
          context.assign(ref, newStream);
          imagesCompressed++;
        }
        if (refKey) processedRefs.add(refKey);
      } catch {
        // Never let one unreadable/unusual image abort the whole operation.
        continue;
      }
    }
  }

  const bytes = await doc.save();
  return {
    bytes,
    imagesFound,
    imagesCompressed,
    originalSize: file.size,
    compressedSize: bytes.length,
  };
}

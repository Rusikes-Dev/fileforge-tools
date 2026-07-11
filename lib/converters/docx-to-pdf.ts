/**
 * Client-side Word (.docx) → PDF conversion.
 * mammoth converts the .docx to semantic HTML; the HTML blocks are then laid
 * out onto PDF pages with pdf-lib using the standard Helvetica family.
 * Both libraries are imported dynamically so they only load on this tool page.
 */

export const DOCX_SIZE_LIMIT = 25 * 1024 * 1024; // 25 MB

export function validateDocxFile(file: File): string | null {
  if (file.size > DOCX_SIZE_LIMIT) {
    return `"${file.name}" is larger than the current 25 MB browser-processing limit.`;
  }
  const ok = file.name.toLowerCase().endsWith(".docx");
  if (!ok) {
    return `"${file.name}" is not a .docx file. Older .doc files aren't supported — re-save the document as .docx first.`;
  }
  return null;
}

interface StyledRun {
  text: string;
  bold: boolean;
  italic: boolean;
}

interface Block {
  runs: StyledRun[];
  /** 0 = body text, 1–3 = heading level */
  heading: number;
  listMarker?: string;
}

/** Flatten mammoth's HTML into styled text blocks we can lay out with pdf-lib. */
function htmlToBlocks(html: string): Block[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: Block[] = [];

  function runsFrom(node: Node, bold = false, italic = false): StyledRun[] {
    const runs: StyledRun[] = [];
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? "";
        if (text) runs.push({ text, bold, italic });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();
        if (tag === "br") {
          runs.push({ text: "\n", bold, italic });
        } else {
          runs.push(
            ...runsFrom(
              el,
              bold || tag === "strong" || tag === "b",
              italic || tag === "em" || tag === "i"
            )
          );
        }
      }
    });
    return runs;
  }

  function walk(el: Element, listDepth: number, ordered: boolean, index: { n: number }) {
    const tag = el.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag)) {
      blocks.push({ runs: runsFrom(el, true), heading: Math.min(Number(tag[1]), 3) });
    } else if (tag === "p") {
      const runs = runsFrom(el);
      if (runs.some((r) => r.text.trim())) blocks.push({ runs, heading: 0 });
    } else if (tag === "ul" || tag === "ol") {
      const isOrdered = tag === "ol";
      const counter = { n: 0 };
      Array.from(el.children).forEach((li) => {
        if (li.tagName.toLowerCase() !== "li") return;
        counter.n += 1;
        const marker = isOrdered ? `${counter.n}.` : "•";
        const nested = Array.from(li.children).filter((c) => /^(ul|ol)$/i.test(c.tagName));
        nested.forEach((n) => n.remove());
        const runs = runsFrom(li);
        if (runs.some((r) => r.text.trim())) {
          blocks.push({ runs, heading: 0, listMarker: `${"   ".repeat(listDepth)}${marker} ` });
        }
        nested.forEach((n) => walk(n as Element, listDepth + 1, isOrdered, index));
      });
    } else if (tag === "table") {
      // Tables are flattened: each row becomes one line with cells joined by " | ".
      Array.from(el.querySelectorAll("tr")).forEach((tr) => {
        const cells = Array.from(tr.querySelectorAll("td,th")).map((c) => c.textContent?.trim() ?? "");
        const line = cells.filter(Boolean).join("  |  ");
        if (line) blocks.push({ runs: [{ text: line, bold: false, italic: false }], heading: 0 });
      });
    } else {
      Array.from(el.children).forEach((child) => walk(child, listDepth, ordered, index));
    }
  }

  Array.from(doc.body.children).forEach((el) => walk(el, 0, false, { n: 0 }));
  return blocks;
}

export async function docxToPdf(file: File): Promise<Uint8Array> {
  const mammoth = await import("mammoth/mammoth.browser");
  const arrayBuffer = await file.arrayBuffer();
  let html: string;
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    html = result.value;
  } catch {
    throw new Error(`"${file.name}" could not be read. It may be corrupted or not a valid .docx document.`);
  }

  const blocks = htmlToBlocks(html);
  if (blocks.length === 0) {
    throw new Error("No text content was found in this document.");
  }

  const { PDFDocument, StandardFonts } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  // Standard fonts only cover Latin-1 (WinAnsi). Replace anything else so
  // encoding never throws; the tool page documents this limitation.
  const supported = new Set(fonts.regular.getCharacterSet());
  const sanitize = (s: string) =>
    Array.from(s)
      .map((ch) => {
        const cp = ch.codePointAt(0)!;
        if (ch === "\n" || ch === "\t") return " ";
        return supported.has(cp) ? ch : "?";
      })
      .join("");

  const pickFont = (r: StyledRun) =>
    r.bold && r.italic ? fonts.boldItalic : r.bold ? fonts.bold : r.italic ? fonts.italic : fonts.regular;

  // A4 page with 1-inch-ish margins
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 64;
  const maxWidth = pageWidth - margin * 2;

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const sizeFor = (heading: number) => (heading === 1 ? 20 : heading === 2 ? 16 : heading === 3 ? 13 : 11);
  const gapAfter = (heading: number) => (heading > 0 ? 10 : 7);

  for (const block of blocks) {
    const size = sizeFor(block.heading);
    const lineHeight = size * 1.45;

    // Break the block into words while remembering each word's style.
    type Word = { text: string; run: StyledRun };
    const words: Word[] = [];
    if (block.listMarker) {
      words.push({ text: block.listMarker, run: { text: block.listMarker, bold: false, italic: false } });
    }
    for (const run of block.runs) {
      for (const w of sanitize(run.text).split(/\s+/)) {
        if (w) words.push({ text: w, run });
      }
    }
    if (words.length === 0) continue;

    // Greedy word-wrap, drawing word by word so mixed bold/italic runs work.
    let line: Word[] = [];
    let lineWidth = 0;
    const spaceWidth = fonts.regular.widthOfTextAtSize(" ", size);

    const flushLine = () => {
      if (line.length === 0) return;
      if (y - lineHeight < margin) {
        page = pdf.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      let x = margin;
      for (const w of line) {
        const font = block.heading > 0 ? fonts.bold : pickFont(w.run);
        page.drawText(w.text, { x, y: y - size, size, font });
        x += font.widthOfTextAtSize(w.text, size) + spaceWidth;
      }
      y -= lineHeight;
      line = [];
      lineWidth = 0;
    };

    for (const w of words) {
      const font = block.heading > 0 ? fonts.bold : pickFont(w.run);
      const wWidth = font.widthOfTextAtSize(w.text, size);
      if (lineWidth > 0 && lineWidth + spaceWidth + wWidth > maxWidth) flushLine();
      lineWidth += (lineWidth > 0 ? spaceWidth : 0) + wWidth;
      line.push(w);
    }
    flushLine();
    y -= gapAfter(block.heading);
  }

  return pdf.save();
}

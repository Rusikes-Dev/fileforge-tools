/**
 * Client-side PDF operations built on pdf-lib.
 * pdf-lib is imported dynamically by callers so it only loads on PDF tool pages.
 */
import type { PDFDocument as PDFDocumentType } from "pdf-lib";
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

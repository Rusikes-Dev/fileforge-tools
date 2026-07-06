import type { CategoryDef } from "./types";

export const categories: CategoryDef[] = [
  {
    id: "image-tools",
    name: "Image Tools",
    title: "Free Online Image Tools — Convert, Compress, Resize",
    description:
      "Convert between JPG, PNG and WebP, compress images, resize, crop, rotate and encode images to Base64. Everything runs locally in your browser.",
    intro:
      "Convert, compress and edit images without installing software. All image tools on this page run entirely in your browser, so your photos are never uploaded to a server.",
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    title: "Free Online PDF Tools — Merge, Split, Rotate, Extract",
    description:
      "Merge PDFs, split by page range, rotate pages, extract pages, count pages and turn images into PDFs. Files are processed locally in your browser.",
    intro:
      "Combine, split and reorganize PDF files directly in your browser. Your documents stay on your device — nothing is uploaded.",
  },
  {
    id: "text-tools",
    name: "Text Tools",
    title: "Free Online Text Tools — Count, Clean and Transform Text",
    description:
      "Count words and characters, change letter case, remove duplicate lines, sort lines, strip extra spaces and run find and replace on any text.",
    intro:
      "Quick utilities for counting, cleaning and transforming text. Paste your text, get the result instantly — nothing you type leaves your browser.",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    title: "Free Online Developer Tools — JSON, CSV, Encoding, Generators",
    description:
      "Format and validate JSON, convert between CSV and JSON, encode URLs and Base64, and generate UUIDs, passwords and QR codes.",
    intro:
      "Small, dependable utilities for everyday development work. Every tool runs client-side, so API responses, credentials and data samples never leave your machine.",
  },
];

export function getCategory(id: string): CategoryDef | undefined {
  return categories.find((c) => c.id === id);
}

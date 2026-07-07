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
    about: [
      "Photos and graphics come in different formats for different reasons — JPG for photos, PNG for anything needing transparency or sharp text, and WebP as the modern, smaller alternative to both. These tools cover the everyday tasks around that: converting between formats, shrinking file sizes, resizing to exact dimensions, cropping, rotating, and moving image data in and out of Base64 for developers.",
      "Because every tool runs on canvas and Web Crypto APIs already built into your browser, there's no upload step and no processing queue — even a batch of 30 photos processes as fast as your device can handle it, with nothing ever leaving your machine.",
    ],
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    title: "Free Online PDF Tools — Merge, Split, Rotate, Extract",
    description:
      "Merge PDFs, split by page range, rotate pages, extract pages, count pages and turn images into PDFs. Files are processed locally in your browser.",
    intro:
      "Combine, split and reorganize PDF files directly in your browser. Your documents stay on your device — nothing is uploaded.",
    about: [
      "PDFs are the default format for contracts, reports, forms and scanned documents precisely because they preserve layout consistently everywhere — but that also makes routine tasks like combining files or pulling out a few pages harder without the right tool. This set covers the common document-assembly tasks: merging multiple files into one, splitting one file into several, extracting specific pages, fixing page orientation, converting photos into a PDF, and counting pages across a batch.",
      "Because these tools use an open-source PDF library running entirely in your browser, sensitive documents — signed contracts, scanned IDs, financial statements — never get uploaded to a third-party server, which matters far more for PDFs than for most other file types.",
    ],
  },
  {
    id: "text-tools",
    name: "Text Tools",
    title: "Free Online Text Tools — Count, Clean and Transform Text",
    description:
      "Count words and characters, change letter case, remove duplicate lines, sort lines, strip extra spaces and run find and replace on any text.",
    intro:
      "Quick utilities for counting, cleaning and transforming text. Paste your text, get the result instantly — nothing you type leaves your browser.",
    about: [
      "Most text problems are small but tedious to fix by hand: counting words against a limit, cleaning up spacing from a pasted PDF, sorting a list correctly, or fixing text typed with caps lock on. These tools handle exactly that class of everyday text cleanup, instantly and without needing a full text editor.",
      "Everything here processes as you type, directly in the page — there's no save step, no account, and nothing you paste is transmitted anywhere, which matters if the text includes anything private like draft correspondence or unpublished writing.",
    ],
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    title: "Free Online Developer Tools — JSON, CSV, Encoding, Generators",
    description:
      "Format and validate JSON, convert between CSV and JSON, encode URLs and Base64, and generate UUIDs, passwords and QR codes.",
    intro:
      "Small, dependable utilities for everyday development work. Every tool runs client-side, so API responses, credentials and data samples never leave your machine.",
    about: [
      "This category covers the small, frequent tasks that come up constantly while building software: formatting and validating JSON, converting between CSV and JSON for reporting, encoding and decoding URLs and Base64 strings, and generating UUIDs, strong passwords and QR codes.",
      "Because API responses, tokens and config data sometimes contain sensitive information, every tool here runs entirely in your browser using the same JavaScript and Web Crypto APIs your own code would use — nothing is sent to a server, logged, or stored anywhere.",
    ],
  },
];

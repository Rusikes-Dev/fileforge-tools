import type { ToolDef } from "../types";

export const pdfTools: ToolDef[] = [
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    shortName: "JPG to PDF",
    category: "pdf-tools",
    title: "JPG to PDF Converter — Combine Photos into One PDF",
    description:
      "Convert JPG images to PDF in your browser. Reorder pages, choose A4/Letter or auto page size, set margins — no upload, no watermark.",
    intro:
      "Turn one or many JPG photos into a single PDF. Drag files to reorder pages, pick a page size and margins, and download — all without uploading anything.",
    about:
      "Each image becomes one PDF page in the order you arrange. Auto page size makes every page match its image exactly, while A4 and Letter fit the image onto a standard page — useful for printing or submitting scanned documents. The PDF is assembled locally with an open-source PDF library, so receipts, IDs and other sensitive scans never leave your device.",
    steps: [
      "Add your JPG files. Each file becomes one page.",
      "Drag the files into the page order you want.",
      "Choose page size (Auto, A4 or Letter), orientation and margin.",
      "Click Create PDF and download the combined document.",
    ],
    inputFormats: ["JPG", "JPEG"],
    outputFormats: ["PDF"],
    aliases: ["photo to pdf", "picture to pdf", "scan to pdf", "images to pdf"],
    related: ["png-to-pdf", "merge-pdf", "image-compressor", "compress-jpg", "image-resizer"],
    faqs: [
      {
        q: "Can I control the page order?",
        a: "Yes. Drag files up or down in the list — pages appear in exactly that order. You can also remove a file before creating the PDF.",
      },
      {
        q: "Which page size should I choose?",
        a: "Auto keeps each page the same size as its image, which is ideal for on-screen viewing. Choose A4 or Letter when the PDF will be printed or must match a submission requirement.",
      },
      {
        q: "Are my photos uploaded to create the PDF?",
        a: "No. The PDF is generated inside your browser and the download comes straight from memory on your device.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "png-to-pdf",
    name: "PNG to PDF Converter",
    shortName: "PNG to PDF",
    category: "pdf-tools",
    title: "PNG to PDF Converter — Images to PDF in Your Browser",
    description:
      "Convert PNG images to a single PDF locally in your browser. Reorder pages, pick page size and margins. No upload, no account.",
    intro:
      "Combine PNG images — screenshots, graphics, scans — into one PDF document, with control over page order, size and margins.",
    about:
      "PNG works especially well for screenshots and graphics with sharp text, and this tool embeds them into the PDF without converting them to JPG first, so no compression artifacts are introduced. Transparent areas render on the white PDF page background. Like all PDF tools here, generation happens locally in your browser.",
    steps: [
      "Add PNG files in any order.",
      "Drag to reorder — the list order is the page order.",
      "Pick Auto, A4 or Letter page size and set margins.",
      "Click Create PDF and download.",
    ],
    inputFormats: ["PNG"],
    outputFormats: ["PDF"],
    aliases: ["screenshot to pdf", "png images to pdf"],
    related: ["jpg-to-pdf", "merge-pdf", "compress-png", "png-to-jpg"],
    faqs: [
      {
        q: "Will my screenshots stay sharp in the PDF?",
        a: "Yes. PNG data is embedded losslessly — text in screenshots remains exactly as crisp as the source image.",
      },
      {
        q: "What happens to transparent areas?",
        a: "PDF pages are white by default, so transparent regions appear white in the document.",
      },
      {
        q: "Can I mix PNG and JPG in one PDF?",
        a: "This page accepts PNG for a focused workflow. To mix formats, convert your JPGs with the JPG to PDF tool and combine the results with Merge PDF.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF Files",
    shortName: "Merge PDF",
    category: "pdf-tools",
    title: "Merge PDF — Combine PDF Files Online, No Upload",
    description:
      "Combine multiple PDFs into one file in your browser. Drag to reorder, remove files before merging, keep original quality. Free, no upload.",
    intro:
      "Combine two or more PDF files into a single document. Drag files to set the order — merging happens locally, so contracts and reports never leave your device.",
    about:
      "Merging copies every page from your PDFs into a new document in the order you choose, without re-rendering pages — text stays selectable and quality is untouched. Because the work is done by an open-source PDF library running in your browser, there is no upload step, no queue and no file retention: closing the tab removes everything.",
    steps: [
      "Add the PDF files you want to combine.",
      "Drag the filenames into the order the documents should appear.",
      "Remove any file you don't need with the × button.",
      "Click Merge PDFs and download the combined file.",
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
    aliases: ["combine pdf", "join pdf files", "pdf joiner", "put pdfs together"],
    related: ["split-pdf", "rotate-pdf", "extract-pdf-pages", "jpg-to-pdf", "pdf-page-counter"],
    faqs: [
      {
        q: "Does merging reduce PDF quality?",
        a: "No. Pages are copied, not re-rendered — text remains selectable and images keep their original resolution.",
      },
      {
        q: "Can I reorder the files before merging?",
        a: "Yes. Drag entries in the file list; the merged PDF follows that exact order.",
      },
      {
        q: "Can password-protected PDFs be merged?",
        a: "Encrypted PDFs cannot be read without their password, so they can't be merged here. Remove the protection in the application that created the file first.",
      },
      {
        q: "Are my documents stored anywhere?",
        a: "No. Merging happens in your browser's memory. Nothing is uploaded, and nothing persists after you leave the page.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortName: "Split PDF",
    category: "pdf-tools",
    title: "Split PDF — Separate a PDF by Page Ranges",
    description:
      "Split a PDF into separate files using page ranges like 1-3, 5, 7-10. Validated ranges, clear errors, all processed in your browser.",
    intro:
      "Break one PDF into several smaller documents by entering page ranges such as 1-3, 5, 7-10. Each range becomes its own downloadable PDF.",
    about:
      "After you add a PDF, the tool shows its page count so you know the valid range. Enter comma-separated ranges — single pages (5) and spans (7-10) can be mixed freely — and each range is exported as an independent PDF with pages copied at original quality. Invalid input produces a specific message, for example when a range points past the document's last page.",
    steps: [
      "Add a PDF. The total page count is displayed.",
      "Type page ranges, for example: 1-3, 5, 7-10.",
      "Click Split PDF. Each range is generated as a separate file.",
      "Download the parts you need.",
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
    aliases: ["separate pdf pages", "divide pdf", "pdf splitter", "cut pdf"],
    related: ["extract-pdf-pages", "merge-pdf", "rotate-pdf", "pdf-page-counter"],
    faqs: [
      {
        q: "What range formats are accepted?",
        a: "Single pages (5), spans (7-10) and combinations separated by commas (1-3, 5, 7-10). Pages are numbered from 1.",
      },
      {
        q: "What happens if I enter an invalid range?",
        a: "You get a precise error — for example, \"Page range 20-30 is invalid because this PDF contains 12 pages\" — and nothing is generated until it's fixed.",
      },
      {
        q: "Does splitting lower the quality of the pages?",
        a: "No. Pages are copied byte-accurately into the new documents; nothing is re-rendered or recompressed.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF Pages",
    shortName: "Rotate PDF",
    category: "pdf-tools",
    title: "Rotate PDF — Fix Sideways or Upside-Down Pages",
    description:
      "Rotate all pages or specific pages of a PDF by 90°, 180° or 270°, permanently and locally in your browser. Free, no upload.",
    intro:
      "Permanently rotate PDF pages that scanned sideways or upside down. Rotate the whole document or only the pages you specify.",
    about:
      "Scanners and phone scanning apps frequently produce pages with the wrong orientation. This tool sets each page's rotation property in the PDF itself, so the fix persists in every viewer — unlike rotating temporarily in a PDF reader. You can apply one rotation to all pages, or target specific pages with the same range syntax used by the Split tool (for example 2, 5-7).",
    steps: [
      "Add the PDF with wrongly oriented pages.",
      "Choose 90° clockwise, 180°, or 90° counter-clockwise.",
      "Rotate all pages, or enter specific pages such as 2, 5-7.",
      "Click Rotate PDF and download the corrected file.",
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
    aliases: ["pdf upside down", "turn pdf pages", "fix pdf orientation"],
    related: ["split-pdf", "merge-pdf", "extract-pdf-pages", "image-rotator"],
    faqs: [
      {
        q: "Why does my PDF open sideways every time?",
        a: "The page orientation is stored in the file. Rotating in a viewer only changes the current display; this tool rewrites the stored orientation so the fix is permanent.",
      },
      {
        q: "Can I rotate only some pages?",
        a: "Yes. Enter pages or ranges like 2, 5-7 and only those pages are rotated; the rest are left untouched.",
      },
      {
        q: "Does rotation affect text quality or searchability?",
        a: "No. Only the page rotation property changes — content, text layers and quality are untouched.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    shortName: "Extract PDF Pages",
    category: "pdf-tools",
    title: "Extract PDF Pages — Save Selected Pages as a New PDF",
    description:
      "Pull specific pages out of a PDF into a new document. Enter pages like 2, 5-7, 12 and download the result — processed in your browser.",
    intro:
      "Create a new PDF containing only the pages you choose from a larger document — for example pages 2, 5-7 and 12 of a long report.",
    about:
      "Extraction differs from splitting: instead of producing one file per range, it gathers all selected pages into a single new PDF, in the order you list them. That makes it ideal for sharing just the relevant section of a contract, pulling an appendix out of a report, or assembling a shortened handout. Pages are copied without re-rendering, and the original file is never modified.",
    steps: [
      "Add your PDF. The page count is shown.",
      "Enter the pages to keep, e.g. 2, 5-7, 12.",
      "Click Extract pages.",
      "Download the new PDF containing only those pages.",
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
    aliases: ["save pdf pages", "take pages out of pdf", "pdf page extractor"],
    related: ["split-pdf", "merge-pdf", "rotate-pdf", "pdf-page-counter"],
    faqs: [
      {
        q: "How is this different from Split PDF?",
        a: "Split produces a separate file per range. Extract combines all selected pages into one new document — the right choice when you want a single shareable file.",
      },
      {
        q: "Can pages appear in a different order than the original?",
        a: "Yes. Pages are added in the order you list them, so 7-9, 1 puts pages 7, 8, 9 first and page 1 last.",
      },
      {
        q: "Is the original PDF changed?",
        a: "No. A new document is created; your source file stays exactly as it was.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "pdf-page-counter",
    name: "PDF Page Counter",
    shortName: "PDF Page Counter",
    category: "pdf-tools",
    title: "PDF Page Counter — Count Pages in PDF Files Instantly",
    description:
      "Count the pages in one or many PDF files instantly in your browser, with a per-file breakdown and total. No upload required.",
    intro:
      "Get an instant page count for one PDF or a whole batch — with a per-file breakdown and a grand total. Useful for print quotes and submission limits.",
    about:
      "Print shops charge per page, journals and courts impose page limits, and large document sets need auditing — all reasons to count pages without opening every file. Drop in any number of PDFs and the tool reads each file's page count locally, listing every file with its count, its size, and a total across the batch.",
    steps: [
      "Drop one or more PDF files into the upload area.",
      "Counts appear immediately for each file.",
      "Check the total at the bottom of the list.",
      "Add more files or clear the list to start over.",
    ],
    inputFormats: ["PDF"],
    outputFormats: ["Page count report"],
    aliases: ["how many pages in pdf", "count pdf pages", "pdf length"],
    related: ["split-pdf", "extract-pdf-pages", "merge-pdf"],
    faqs: [
      {
        q: "Can I count pages across many PDFs at once?",
        a: "Yes. Add as many files as you like — each shows its own count and the tool totals them, which is handy for print estimates.",
      },
      {
        q: "Do you open or read the content of my documents?",
        a: "Only the file structure needed to determine the page count is parsed, and it happens in your browser. The content is never transmitted or displayed.",
      },
      {
        q: "Why can't the count be read from a password-protected PDF?",
        a: "Encrypted PDFs hide their structure until unlocked. Remove the password first, then count.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
];

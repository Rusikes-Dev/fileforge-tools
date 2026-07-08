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
    about: [
      "Each image becomes one PDF page in the order you arrange. Auto page size makes every page match its image exactly, while A4 and Letter fit the image onto a standard page — useful for printing or submitting scanned documents. The PDF is assembled locally with an open-source PDF library, so receipts, IDs and other sensitive scans never leave your device.",
      "This is a common step for turning phone-camera photos of receipts, forms, or ID documents into a single PDF for an expense report, application, or archive — something photo apps don't do directly, since they save images individually rather than as one combined document.",
    ],
    useCases: [
      "Combining photos of receipts into a single PDF for an expense report",
      "Turning phone-scanned pages of a signed document into one shareable PDF",
      "Submitting a scanned ID or form that a portal requires as a PDF rather than separate images",
    ],
    tips: [
      "Use A4 or Letter page size if the PDF needs to be printed on a standard printer; use Auto if it will only ever be viewed on screen.",
      "Arrange your photos in the correct reading order before creating the PDF — reordering afterward means starting over.",
    ],
    steps: [
      "Add your JPG files. Each file becomes one page.",
      "Drag the files into the page order you want.",
      "Choose page size (Auto, A4 or Letter), orientation and margin.",
      "Click Create PDF and download the combined document.",
    ],
    inputFormats: ["JPG", "JPEG"],
    outputFormats: ["PDF"],
    aliases: ["photo to pdf", "picture to pdf", "scan to pdf", "images to pdf"],
    related: ["png-to-pdf", "merge-pdf", "compress-pdf", "image-compressor", "compress-jpg"],
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
      {
        q: "How many photos can I combine into one PDF?",
        a: "Up to 30 images in a single batch, each becoming its own page in the order you arrange them.",
      },
      {
        q: "Can I mix portrait and landscape photos in the same PDF?",
        a: "Yes. With Auto page size, each page simply matches its own image's orientation. With A4 or Letter, choose the orientation setting that fits your majority of photos best.",
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
    about: [
      "PNG works especially well for screenshots and graphics with sharp text, and this tool embeds them into the PDF without converting them to JPG first, so no compression artifacts are introduced. Transparent areas render on the white PDF page background. Like all PDF tools here, generation happens locally in your browser.",
      "This is a natural fit for turning a set of screenshots — a tutorial, a step-by-step guide, or documentation captures — into a single PDF that's easy to share or print, without the text-blurring artifacts that JPG compression can introduce on sharp screen graphics.",
    ],
    useCases: [
      "Compiling a series of screenshots into a single PDF for a how-to guide or bug report",
      "Turning scanned document pages saved as PNG into one combined PDF",
      "Assembling design mockups or diagrams exported as PNG into a single presentable document",
    ],
    tips: [
      "Keep PNG input (rather than converting to JPG first) whenever the images contain text or sharp lines — it avoids the softening that JPG compression can introduce.",
      "Set a small margin if the PDF will be printed and bound, so nothing near the edge gets cut off or lost in the fold.",
    ],
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
      {
        q: "Is there a limit to how many screenshots I can combine?",
        a: "Up to 30 PNG files in a single batch, each becoming one page in the order you set.",
      },
      {
        q: "Will large screenshots make a huge PDF file?",
        a: "PNG screenshots are embedded at their original size, so a batch of many large, detailed screenshots can produce a sizeable PDF. If file size matters, consider compressing the PNGs first.",
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
    about: [
      "Merging copies every page from your PDFs into a new document in the order you choose, without re-rendering pages — text stays selectable and quality is untouched. Because the work is done by an open-source PDF library running in your browser, there is no upload step, no queue and no file retention: closing the tab removes everything.",
      "This is often the last step in assembling a complete document from separate parts — a cover letter and a resume, several signed contract pages scanned separately, or chapters of a report drafted by different people — combined into the single file most systems expect to receive.",
    ],
    useCases: [
      "Combining a cover letter and resume into a single PDF for a job application",
      "Merging several signed pages of a contract that were scanned separately",
      "Assembling chapters or sections from different files into one complete report",
    ],
    tips: [
      "Add all your files first, then use the up/down arrows to set the final order — it's easier than trying to add them in perfect order from the start.",
      "Run the PDF Page Counter on the merged result afterward if you need to confirm the total page count matches what you expected.",
    ],
    steps: [
      "Add the PDF files you want to combine.",
      "Drag the filenames into the order the documents should appear.",
      "Remove any file you don't need with the × button.",
      "Click Merge PDFs and download the combined file.",
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
    aliases: ["combine pdf", "join pdf files", "pdf joiner", "put pdfs together"],
    related: ["compress-pdf", "split-pdf", "rotate-pdf", "extract-pdf-pages", "jpg-to-pdf"],
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
      {
        q: "How many PDFs can I merge at once?",
        a: "Up to 20 files in a single batch, combined into one output document in the order you set.",
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
    about: [
      "After you add a PDF, the tool shows its page count so you know the valid range. Enter comma-separated ranges — single pages (5) and spans (7-10) can be mixed freely — and each range is exported as an independent PDF with pages copied at original quality. Invalid input produces a specific message, for example when a range points past the document's last page.",
      "This is useful whenever one large PDF actually contains several separate documents bundled together — a scanned batch of individual invoices, or a bulk export where each recipient's pages need to become their own file.",
    ],
    useCases: [
      "Breaking a scanned batch of multiple invoices or receipts into individual PDF files",
      "Splitting a long report into separate chapters or sections to share independently",
      "Dividing a bulk-exported document where each person's pages need to become its own file",
    ],
    tips: [
      "Check the page count shown after uploading before typing your ranges — it tells you the maximum valid page number.",
      "You can enter multiple ranges at once (like 1-5, 6-10, 11-15) to split a document into several parts in a single click.",
    ],
    steps: [
      "Add a PDF. The total page count is displayed.",
      "Type page ranges, for example: 1-3, 5, 7-10.",
      "Click Split PDF. Each range is generated as a separate file.",
      "Download the parts you need.",
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
    aliases: ["separate pdf pages", "divide pdf", "pdf splitter", "cut pdf"],
    related: ["extract-pdf-pages", "merge-pdf", "compress-pdf", "pdf-page-counter"],
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
      {
        q: "Can I split one PDF into more than two parts?",
        a: "Yes. Enter as many ranges as you need, separated by commas, and each one becomes its own separate downloadable file.",
      },
      {
        q: "What's the difference between Split PDF and Extract PDF Pages?",
        a: "Split produces a separate file per range you enter. Extract instead gathers all the pages you select into a single combined document — use whichever matches what you actually need.",
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
    about: [
      "Scanners and phone scanning apps frequently produce pages with the wrong orientation. This tool sets each page's rotation property in the PDF itself, so the fix persists in every viewer — unlike rotating temporarily in a PDF reader. You can apply one rotation to all pages, or target specific pages with the same range syntax used by the Split tool (for example 2, 5-7).",
      "This solves a common frustration where a PDF looks fine while you're viewing it in one app, but reverts to sideways the moment someone else opens it in a different PDF reader — because the temporary view rotation wasn't actually saved into the file.",
    ],
    useCases: [
      "Fixing pages that came out sideways from a scanner or phone scanning app",
      "Correcting just one or two upside-down pages in an otherwise correctly oriented document",
      "Making sure a rotation fix persists no matter which PDF viewer someone else uses to open the file",
    ],
    tips: [
      "If only a few pages are wrong in an otherwise correct document, use the specific-pages option rather than rotating everything.",
      "Preview the corrected file after downloading in a different PDF viewer than the one you used to check it, to confirm the fix actually saved into the file.",
    ],
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
      {
        q: "Can I rotate different pages by different amounts in one pass?",
        a: "Each pass applies one rotation amount to the pages you specify. For pages that need a different rotation, run the tool again on the result with a new set of page numbers.",
      },
      {
        q: "Will this work on a scanned PDF with no selectable text?",
        a: "Yes. Rotation works on the page itself regardless of whether the content is a scanned image or real text.",
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
    about: [
      "Extraction differs from splitting: instead of producing one file per range, it gathers all selected pages into a single new PDF, in the order you list them. That makes it ideal for sharing just the relevant section of a contract, pulling an appendix out of a report, or assembling a shortened handout. Pages are copied without re-rendering, and the original file is never modified.",
      "This is the right tool whenever you need to hand someone a single, focused document — the signature page and appendix of a contract, for instance — rather than the entire original file with everything else included.",
    ],
    useCases: [
      "Pulling just the signature page and appendix out of a long contract to share separately",
      "Creating a shortened handout from selected pages of a longer presentation or report",
      "Extracting a specific chapter or section from a large document for someone who only needs that part",
    ],
    tips: [
      "List the pages in the exact order you want them to appear in the new document — the output follows your list, not the original page order.",
      "Check the source document's page count first (shown after upload) to make sure your page numbers are correct before extracting.",
    ],
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
      {
        q: "Can I extract the same page more than once into the new document?",
        a: "Each unique page number is included once even if listed multiple times, to keep the result predictable and avoid accidental duplicate pages.",
      },
      {
        q: "Does the extracted PDF keep selectable text and links?",
        a: "Yes. Pages are copied directly, so any selectable text, links or bookmarks contained on those specific pages carry over intact.",
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
    about: [
      "Print shops charge per page, journals and courts impose page limits, and large document sets need auditing — all reasons to count pages without opening every file. Drop in any number of PDFs and the tool reads each file's page count locally, listing every file with its count, its size, and a total across the batch.",
      "This is especially handy before a print run or bulk submission, where knowing the exact total page count across dozens of files upfront avoids surprises at the print shop counter or a rejected submission for exceeding a page limit.",
    ],
    useCases: [
      "Getting an accurate total page count across a batch of files before requesting a print quote",
      "Confirming a document meets a page-limit requirement before submitting it to a journal, court, or application",
      "Auditing a folder of PDFs to see how many pages each one contains at a glance",
    ],
    tips: [
      "Drop in the entire folder of PDFs at once rather than checking them one at a time — the running total updates automatically as each file is added.",
      "If a file shows an error instead of a count, it's likely password-protected — remove the password in its source application first.",
    ],
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
      {
        q: "Does file size affect how the count is calculated?",
        a: "No. The count reflects the actual number of pages in the document structure, regardless of how large or small the file is.",
      },
      {
        q: "Can I use this to estimate printing costs?",
        a: "Yes — many print shops charge per page, so getting an accurate total across all your files up front helps you estimate cost before submitting a print job.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "compress-pdf",
    name: "PDF Compressor",
    shortName: "Compress PDF",
    category: "pdf-tools",
    title: "Compress PDF — Reduce PDF File Size Online",
    description:
      "Shrink a PDF by recompressing the images inside it, right in your browser. See exactly how many images were compressed and the size saved.",
    intro:
      "Reduce a PDF's file size by recompressing the color photos and scans embedded inside it. Everything happens in your browser — the PDF is never uploaded.",
    about: [
      "A PDF's size is almost always driven by the images inside it rather than its text. This tool scans every page for embedded color photos and scans, re-encodes each one at a quality level you choose, and rebuilds the PDF with the smaller versions — only keeping a change if it's actually smaller than the original. It tells you exactly how many images were found and how many were compressed, rather than implying every PDF will shrink.",
      "This works on the most common case: full-color JPEG images embedded in the PDF, which is how most scanned color documents and photo-heavy reports are stored. Black-and-white scans, images already using lossless compression, and a few less common color formats are deliberately left untouched — attempting to recompress those safely isn't possible with a browser-based approach, and leaving them alone is better than risking a corrupted page.",
    ],
    useCases: [
      "Shrinking a scanned color document or report so it fits under an email attachment limit",
      "Reducing the size of a photo-heavy PDF (like a portfolio or property listing) before sharing it",
      "Getting a large PDF small enough to upload to a portal with a strict file size cap",
    ],
    tips: [
      "Check the summary after compressing — it tells you how many images were actually compressible. If it says 0, your PDF likely contains grayscale scans or already-optimized images, and splitting or re-scanning at a lower resolution may work better instead.",
      "Try 75-80% quality first. If the size saving isn't enough and the pages still look correct, you can run the compressed result through again at a lower setting.",
    ],
    steps: [
      "Add the PDF you want to shrink.",
      "Choose a compression quality — 75-80% is a good starting point.",
      "Click Compress PDF and review how many images were compressed.",
      "Compare the before and after size, then download.",
    ],
    inputFormats: ["PDF"],
    outputFormats: ["PDF"],
    aliases: ["shrink pdf", "reduce pdf size", "make pdf smaller", "pdf too large"],
    related: ["merge-pdf", "split-pdf", "pdf-page-counter", "jpg-to-pdf"],
    faqs: [
      {
        q: "Why didn't my PDF get any smaller?",
        a: "This tool recompresses full-color JPEG images embedded in the PDF, which is the most common case. If your PDF is a black-and-white scan, already uses efficient compression, or is mostly text, there may be nothing safe to compress — the summary will show 0 images compressed rather than force a change.",
      },
      {
        q: "Will this affect the quality of my document?",
        a: "Only the embedded photos are re-encoded, at a quality level you choose, the same trade-off as compressing a JPEG image directly. Text and vector content are never touched.",
      },
      {
        q: "Is it safe to compress a scanned contract or ID?",
        a: "Yes — the file never leaves your browser at any point, the same as every other tool on this site. Nothing is uploaded during compression.",
      },
      {
        q: "Why do some images get skipped even though the PDF clearly has photos?",
        a: "This tool only recompresses standard full-color (RGB) JPEG images, which covers the large majority of scanned and photo-heavy PDFs. Grayscale scans and certain less common color formats are intentionally left unchanged, since compressing them safely isn't possible with this approach — leaving them untouched is safer than risking how the page renders.",
      },
      {
        q: "Can password-protected PDFs be compressed?",
        a: "No. An encrypted PDF can't be read without its password, so it can't be processed here. Remove the password in the application that created the file first.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: false,
  },
];

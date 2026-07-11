import type { BlogPost } from "./types";

export const posts: BlogPost[] = [
  {
    slug: "how-to-merge-pdf-without-uploading",
    title: "How to Merge PDF Files Without Uploading Them Online",
    description:
      "Learn how to combine PDF files entirely in your browser, with no upload to a third-party server. A private, step-by-step guide.",
    excerpt:
      "Most free PDF mergers upload your files to a server first. Here's how to combine PDFs entirely in your browser instead, with nothing ever leaving your device.",
    publishedAt: "2026-07-07",
    intro: [
      "If you've ever needed to combine a few PDFs — say, merging scanned receipts, stitching together a multi-part report, or combining signed contract pages — you've probably run into the same problem: most free \"merge PDF\" tools require you to upload your files to a server first.",
      "For most documents that's a minor inconvenience. But if your PDFs contain anything sensitive — financial statements, medical records, signed agreements, ID scans — uploading them to an unknown third-party server is a real privacy risk, even if the site promises to \"delete files after 24 hours\". The good news is that your browser can do the entire job itself, with nothing ever leaving your device.",
    ],
    sections: [
      {
        heading: "Why browser-based merging is different",
        paragraphs: [
          "Every modern browser (Chrome, Firefox, Safari, Edge) can read, combine and rebuild PDF files directly using JavaScript. When a tool is built this way, your files are read into your browser's memory, processed there, and the result is handed back to you as a download. Nothing is transmitted over the network — you could disconnect your Wi-Fi partway through and it would still finish.",
          "There's no server-side copy to worry about, no \"we deleted it after 24 hours\" trust required, and no risk of a data breach on someone else's infrastructure. The trade-off is that very large files (hundreds of megabytes) can be slower than a dedicated desktop app, since your browser is doing the work your computer's own memory allows. For everyday use — merging a handful of scanned pages or a multi-file report — it's fast and completely private.",
        ],
      },
      {
        heading: "Step-by-step: merging PDFs in your browser",
        paragraphs: [
          "1. Open a browser-based merge tool, such as the Merge PDF tool on this site — no account, no upload.\n2. Add your PDF files by dragging and dropping them in, or clicking to choose files from your computer. You can add as many as you need, up to the tool's file-count limit.\n3. Reorder if needed. Most merge tools let you drag files up or down in the list — this becomes the page order in your final PDF, so double check it before merging.\n4. Click merge. Because everything happens locally, this is usually near-instant even for several files.\n5. Download your combined PDF. The result is generated in your browser and saved straight to your downloads folder.",
        ],
      },
      {
        heading: "When you might still want a desktop app",
        paragraphs: [
          "Browser tools are great for occasional, single-session tasks. If you're merging PDFs constantly as part of a daily workflow, or need advanced features like adding page numbers, watermarks, or digital signatures across the merged file, a dedicated desktop PDF editor might serve you better long-term.",
          "But for the common case — you just need a few PDFs combined into one, right now, without giving them to a stranger's server — a browser tool does the job with zero setup and zero privacy trade-off.",
        ],
      },
    ],
    relatedTools: ["merge-pdf", "split-pdf", "pdf-page-counter", "jpg-to-pdf"],
    relatedPosts: ["reduce-pdf-file-size-for-email", "how-to-generate-a-strong-password"],
  },
  {
    slug: "compress-png-without-losing-quality",
    title: "How to Compress a PNG Without Losing Quality",
    description:
      "PNG files can be surprisingly large. Here's how to shrink them dramatically while keeping transparency and sharp detail intact.",
    excerpt:
      "PNG screenshots and graphics are often much larger than they need to be. Here's how to shrink them without the blurry, blocky look of over-compressed images.",
    publishedAt: "2026-07-07",
    intro: [
      "PNG has a reputation for producing large files, and for good reason: it's a lossless format, meaning it stores every pixel exactly as it is, with no data thrown away. That's great for quality but often means a simple screenshot or logo ends up several megabytes in size — far bigger than it needs to be for how it will actually be used.",
      "The trick to compressing a PNG well is understanding that you're not really \"compressing\" a PNG at all in the traditional sense — you're converting it to a smarter format that achieves a similar look at a fraction of the size.",
    ],
    sections: [
      {
        heading: "Why you can't just 'compress' a PNG directly",
        paragraphs: [
          "PNG's compression is lossless and largely fixed — there's no quality slider because there's no quality to trade away. Every pixel is preserved exactly. That's precisely why PNG files can be so large: unlike JPG, which can throw away detail the eye barely notices, PNG has to represent everything faithfully.",
          "The practical way to shrink a large PNG, then, is to re-encode it into a format that does support a quality trade-off — most commonly WebP or JPG — while keeping the visual result close enough to the original that nobody notices the difference.",
        ],
      },
      {
        heading: "WebP: the best option for most PNGs",
        paragraphs: [
          "WebP is the modern choice for shrinking PNGs, for one key reason: it supports transparency, just like PNG does, but with far more efficient compression. A logo, icon, or screenshot with a transparent background can typically be converted to WebP at 90%+ quality and come out 60–90% smaller than the original PNG, with no visible difference at normal viewing sizes.",
          "This makes WebP the default recommendation for anything that started life as a PNG because it needed transparency or sharp edges — screenshots, icons, logos, UI mockups. You keep the exact same visual behavior, just in a dramatically smaller file.",
        ],
      },
      {
        heading: "When JPG makes more sense instead",
        paragraphs: [
          "If the destination absolutely requires maximum compatibility — an older system, a print shop, or a platform that doesn't accept WebP — JPG is the fallback. The catch is that JPG doesn't support transparency at all, so any transparent areas in your PNG get filled with a solid background color you choose. For a photo-like PNG with no transparency, this is a fine option; for a logo with a transparent background, it usually isn't what you want.",
        ],
      },
      {
        heading: "A practical workflow",
        paragraphs: [
          "1. Start with your original PNG — don't compress a copy that's already been compressed once, since starting fresh gives the cleanest result.\n2. Choose WebP as the output format if the image has transparency or will only be used digitally.\n3. Set the quality to around 90% as a starting point — this typically preserves fine detail and text while still shrinking the file substantially.\n4. Compare the before and after file sizes. If the saving isn't enough and the image quality still looks fine, try lowering the quality a bit further.\n5. Only fall back to JPG if the destination specifically can't accept WebP.",
        ],
      },
    ],
    relatedTools: ["compress-png", "png-to-webp", "image-compressor", "image-resizer"],
    relatedPosts: ["jpg-vs-png-vs-webp", "reduce-pdf-file-size-for-email"],
  },
  {
    slug: "how-to-generate-a-strong-password",
    title: "How to Generate a Strong Password (And What Actually Makes One Strong)",
    description:
      "A practical guide to what makes a password genuinely hard to crack, and how to generate one that's both strong and usable.",
    excerpt:
      "Password strength isn't about clever substitutions like \"P@ssw0rd\". Here's what actually makes a password hard to crack, and how to generate one properly.",
    publishedAt: "2026-07-07",
    intro: [
      "A lot of password advice focuses on the wrong thing. Swapping an \"a\" for an \"@\" or adding an exclamation mark at the end feels like it's making a password stronger, but attackers' cracking tools have known these tricks for years — they barely slow anything down. Real password strength comes from two much simpler factors: length and true randomness.",
    ],
    sections: [
      {
        heading: "Why length matters more than complexity tricks",
        paragraphs: [
          "Every extra character in a password multiplies the number of possible combinations an attacker would need to try. A random 8-character password might have around 50 bits of entropy — crackable by modern hardware in a practical amount of time. A random 16-character password with the same character variety jumps to roughly 100 bits of entropy, which is far beyond what's realistically crackable by brute force with current technology.",
          "In other words, a long password made of ordinary lowercase letters is often stronger than a short password stuffed with symbols and substitutions. Length beats cleverness.",
        ],
      },
      {
        heading: "Why true randomness matters",
        paragraphs: [
          "The second ingredient is genuine randomness. Humans are bad at generating random-feeling passwords — we gravitate toward patterns, keyboard walks (like \"qwerty123\"), and personal references (birthdays, pet names) that feel random to us but are actually highly predictable to an attacker's cracking software, which is trained on exactly these patterns.",
          "A password generator that draws from a cryptographically secure random source avoids this entirely. Every character is chosen independently with no underlying pattern, which is precisely what makes brute-force guessing infeasible.",
        ],
      },
      {
        heading: "What a good password generator should do",
        paragraphs: [
          "1. Use a cryptographic random source (like the Web Crypto API in a browser), not a simple pseudo-random function that could theoretically be predicted.\n2. Let you set a meaningful length — 16 characters as a reasonable minimum, 20+ for anything important like a primary email or financial account.\n3. Include a mix of character sets — lowercase, uppercase, digits and symbols — and guarantee at least one of each so the password meets typical site requirements.\n4. Never transmit or log the generated password anywhere. A password generated in your browser and never sent over the network is inherently safer than one generated by a server you have to trust.",
        ],
      },
      {
        heading: "The part most people skip: using a password manager",
        paragraphs: [
          "Generating a strong password solves half the problem. The other half is not reusing it. A password manager lets you use a different, fully random, long password for every single account without having to remember any of them — you only need to remember one master password. This is genuinely the single biggest security improvement most people can make, and it's what makes long random passwords practical to use everywhere rather than just for your most important accounts.",
        ],
      },
    ],
    relatedTools: ["password-generator", "uuid-generator", "base64-encoder-decoder"],
    relatedPosts: ["csv-to-json-beginners-guide", "how-to-merge-pdf-without-uploading"],
  },
  {
    slug: "csv-to-json-beginners-guide",
    title: "CSV to JSON: A Beginner's Guide",
    description:
      "A plain-English explanation of what CSV and JSON actually are, why you'd convert between them, and how to do it correctly without breaking your data.",
    excerpt:
      "If you've been handed a spreadsheet and asked to turn it into JSON (or the reverse), here's what's actually happening and how to do it without corrupting your data.",
    publishedAt: "2026-07-08",
    intro: [
      "If you work anywhere near spreadsheets and code, you'll eventually run into this exact situation: someone hands you a CSV export from Excel or Google Sheets, and you need it as JSON for an API, a script, or a database import. Or the reverse — you have JSON and someone wants a spreadsheet.",
      "It sounds like it should be trivial, and mostly it is — until your data has a comma inside a value, or a name with an apostrophe, or a blank cell, and suddenly your \"quick conversion\" is producing broken output. Here's what's actually going on under the hood, so you can do this reliably.",
    ],
    sections: [
      {
        heading: "What CSV and JSON actually are",
        paragraphs: [
          "CSV (comma-separated values) is a plain text format for tables: one line per row, values separated by commas, and usually a header row naming each column. It's what you get when you export a spreadsheet as plain text.",
          "JSON (JavaScript Object Notation) represents structured data as nested objects and arrays — the format nearly every API, config file, and modern app expects. A table of people in CSV becomes, in JSON, an array where each row is one object with the column names as keys.",
        ],
      },
      {
        heading: "The part that trips people up: quoting",
        paragraphs: [
          "CSV's one comma-separated line per row rule breaks the moment a value itself contains a comma — like a name written \"Smith, Jane\" or an address with a comma in it. The CSV standard handles this by wrapping such values in double quotes: `\"Smith, Jane\"`. A naive converter that just splits every line on commas will incorrectly treat that quoted comma as a new column, silently shifting every value after it one column to the right.",
          "A second, sneakier issue: what if a value itself contains a double quote? The standard says you escape it by doubling it — `\"She said \"\"hello\"\"\"` represents the text `She said \"hello\"`. Converters that don't implement proper CSV parsing (rather than a simple string split) will mishandle this too.",
        ],
      },
      {
        heading: "The other trap: numbers that aren't really numbers",
        paragraphs: [
          "CSV has no concept of data types — everything is just text. This causes a specific, easy-to-miss bug: a ZIP code like `01234` or a product code like `007` has a meaningful leading zero. If your converter automatically detects and converts number-looking values into actual JSON numbers, that leading zero silently disappears — `01234` becomes `1234`, and now your ZIP code is wrong.",
          "The safe default is to keep everything as text unless you specifically know a column is safe to convert — good tools give you this as a toggle rather than an automatic, all-or-nothing decision.",
        ],
      },
      {
        heading: "Doing it correctly",
        paragraphs: [
          "1. Use a converter that implements proper CSV parsing (quote handling, escaped quotes, embedded commas and line breaks) rather than a naive comma-split — the CSV to JSON tool on this site handles all of this automatically.\n2. If your data has any column with meaningful leading zeros (ZIP codes, ID numbers), leave number detection off, or check the output carefully if you turn it on.\n3. Check your delimiter — spreadsheets in some regional locales export with semicolons instead of commas. If your output looks like one giant column, this is usually why.\n4. Spot-check a row or two of the output against the original, especially any row that had a comma or quote inside a value — that's where naive tools break first.",
        ],
      },
    ],
    relatedTools: ["csv-to-json", "json-to-csv", "json-formatter", "json-validator"],
    relatedPosts: ["jpg-vs-png-vs-webp", "how-to-generate-a-strong-password"],
  },
  {
    slug: "reduce-pdf-file-size-for-email",
    title: "How to Reduce a PDF's File Size for Email",
    description:
      "Practical ways to shrink a PDF that's too large to email, including which method to use for scanned documents versus PDFs with a lot of images.",
    excerpt:
      "Got a PDF that's bouncing back from your email provider's size limit? Here's what actually makes a PDF large, and the fastest ways to shrink it.",
    publishedAt: "2026-07-08",
    intro: [
      "It's a familiar moment: you attach a PDF to an email, hit send, and get an error saying the attachment is too large. Most email providers cap attachments somewhere between 20-25 MB, and it doesn't take much — a handful of scanned pages, or a report with a few embedded photos — to blow past that.",
      "The fix depends on *why* the PDF is large in the first place, since a scanned contract and a report full of high-resolution photos need different approaches.",
    ],
    sections: [
      {
        heading: "Why PDFs get this large in the first place",
        paragraphs: [
          "A PDF's size is almost always driven by the images inside it — scanned pages are essentially just full-resolution photographs of paper, and a report with several high-quality photos embeds all of that image data directly into the file. Text itself takes up very little space; a 50-page text-only PDF might be under a megabyte, while five scanned pages at high resolution can easily exceed 20 MB on their own.",
        ],
      },
      {
        heading: "If it's a scanned document",
        paragraphs: [
          "Scanned pages are usually scanned at a much higher resolution than needed for on-screen reading or even printing. If you have access to the original scanning software, rescanning at a lower DPI (150-200 is usually plenty for readable text) makes an enormous difference. If you only have the final PDF, look for a tool that can recompress the embedded images directly, since that reduces the size without needing to redo the scan.",
        ],
      },
      {
        heading: "If it's a document with embedded photos",
        paragraphs: [
          "Here the fix is more direct: reduce the size of the images before they go into the PDF. If you're the one assembling the document (for example, combining photos into a PDF for a report), compress each image first — cutting a photo from a phone camera down to reasonable web-viewing quality routinely shrinks it by 70-90% with no visible difference at normal viewing size, and the resulting PDF shrinks proportionally.",
        ],
      },
      {
        heading: "A practical workflow",
        paragraphs: [
          "1. If you're building the PDF yourself from photos, compress each image first (a tool like Image Compressor set to 75-85% quality works well), then combine them into a PDF — this gives you far more control than compressing after the fact.\n2. If you already have a large PDF and need to shrink it directly, look for a PDF compression tool, or split it into smaller parts if the whole document doesn't need to go in one email (the Split PDF tool is useful here — send only the pages that are actually needed).\n3. Check your email provider's actual limit before assuming compression alone will get you there — for very large scanned documents, sending a link to a shared file may be more practical than repeated compression.\n4. Always keep your original, uncompressed file. Compression is one-directional — you can't get the lost detail back once you've shrunk it.",
        ],
      },
    ],
    relatedTools: ["split-pdf", "merge-pdf", "image-compressor", "jpg-to-pdf"],
    relatedPosts: ["how-to-merge-pdf-without-uploading", "compress-png-without-losing-quality"],
  },
  {
    slug: "jpg-vs-png-vs-webp",
    title: "JPG vs PNG vs WebP: Which Should You Actually Use?",
    description:
      "A practical comparison of JPG, PNG and WebP — when each one is the right choice, with no unnecessary jargon.",
    excerpt:
      "Three image formats, three different jobs. Here's a straightforward guide to picking the right one instead of defaulting to whatever your camera or screenshot tool saved.",
    publishedAt: "2026-07-08",
    intro: [
      "Most people use whatever image format their phone, camera, or screenshot tool happens to save by default, without ever thinking about it — and most of the time that's fine. But if you've ever wondered why some images load faster than others, why a logo looks blurry after conversion, or why a colleague asked you to \"send it as a PNG instead,\" the answer comes down to a genuine, practical difference between these three formats.",
    ],
    sections: [
      {
        heading: "JPG: the default for photos",
        paragraphs: [
          "JPG uses lossy compression, meaning it throws away some detail the eye is least likely to notice in exchange for a much smaller file. For photographs — with their gradual color transitions and natural detail — this trade-off is usually invisible at normal viewing sizes, which is exactly why it's the default format for cameras and phones.",
          "JPG's real limitation: no transparency support, and it handles sharp edges (like text or line art) poorly — compression artifacts show up as blurring or blocky patterns around hard edges, which is why a JPG screenshot of a document often looks slightly fuzzy around the text.",
        ],
      },
      {
        heading: "PNG: the default for screenshots, logos, and anything needing transparency",
        paragraphs: [
          "PNG uses lossless compression — every pixel is preserved exactly. This makes it the right choice for anything with sharp edges or flat colors: screenshots, logos, icons, and any graphic with a transparent background. The trade-off is size: a PNG of a photograph is typically much larger than the equivalent JPG, since lossless compression can't take advantage of the same detail-discarding tricks.",
        ],
      },
      {
        heading: "WebP: the modern all-rounder",
        paragraphs: [
          "WebP is a newer format that supports both lossy and lossless compression, plus transparency — essentially combining what JPG and PNG each do well into one format. A WebP photo at similar visual quality is typically 20-35% smaller than the equivalent JPG, and a WebP graphic with transparency is often 60-90% smaller than the equivalent PNG.",
          "The only real limitation is compatibility with very old software that hasn't been updated to support it — but every current browser, and most modern image-editing tools, handle WebP natively. For anything destined for the web, it's now the better default over both JPG and PNG.",
        ],
      },
      {
        heading: "A simple decision guide",
        paragraphs: [
          "• Photo, going on a website: WebP (fallback to JPG only for legacy compatibility needs)\n• Photo, need maximum compatibility with older software: JPG\n• Screenshot, logo, or icon with transparency, going on a website: WebP\n• Screenshot, logo, or icon, need maximum compatibility or a lossless master copy: PNG\n• Archiving an image you might edit further: PNG (lossless, so no quality is lost before you've even started editing)",
        ],
      },
    ],
    relatedTools: ["jpg-to-webp", "png-to-webp", "image-compressor", "jpg-to-png"],
    relatedPosts: ["compress-png-without-losing-quality", "csv-to-json-beginners-guide"],
  },
  {
    slug: "convert-pdf-to-word-without-losing-text",
    title: "How to Convert a PDF to Word (and Why Formatting Sometimes Breaks)",
    description:
      "A practical guide to converting PDFs into editable Word documents — what converts cleanly, why layouts break, and how to handle scanned PDFs.",
    excerpt:
      "Converting a PDF to Word looks like it should be a one-click job — and for text documents it is. Here's what actually happens during conversion, and how to get the cleanest result.",
    publishedAt: "2026-07-11",
    intro: [
      "Sooner or later everyone hits this problem: you have a PDF — a CV, a contract, a report — and you need to edit it. PDF viewers won't let you, and retyping the whole thing feels absurd. The obvious answer is converting it to a Word document, and for most documents that works beautifully. But anyone who has tried it has also seen the other outcome: a Word file full of broken columns, floating text boxes, and paragraphs chopped into single lines.",
      "The difference between a clean conversion and a messy one isn't luck. It comes down to what kind of PDF you're starting with, and understanding that makes the whole process predictable.",
    ],
    sections: [
      {
        heading: "Why PDF and Word are fundamentally different",
        paragraphs: [
          "A Word document stores structure: this is a paragraph, this is a heading, this text flows after that text. A PDF stores none of that — it's essentially a set of drawing instructions: put this character at this exact position on the page. That's why PDFs look identical everywhere, and also why converting one back into a flowing, editable document requires the converter to guess where paragraphs begin and end.",
          "For a normal text document — letters, essays, CVs, single-column reports — that guessing is easy and the result is clean, editable text. For a three-column magazine layout with pull quotes and sidebars, no converter can perfectly reverse-engineer the original structure, because the structure simply isn't stored in the file.",
        ],
      },
      {
        heading: "The three kinds of PDFs (and what to expect from each)",
        paragraphs: [
          "Text-based, simple layout: created by exporting from Word, Google Docs, or similar. These convert almost perfectly — you'll get your paragraphs back in order and can start editing immediately.",
          "Text-based, complex layout: brochures, forms, multi-column designs. The text converts accurately, but the visual design won't survive — expect readable content in reading order rather than a visual clone. If the goal is reusing or rewriting the words, this is still exactly what you need.",
          "Scanned PDFs: these are photographs of pages, containing no actual text at all. A quick test: try selecting text in your PDF viewer. If you can't, it's a scan, and it needs OCR (optical character recognition) software rather than a converter. A browser-based converter will simply find no text to extract.",
        ],
      },
      {
        heading: "Converting privately, without uploading",
        paragraphs: [
          "Most free 'PDF to Word' sites work by uploading your document to their server, converting it there, and giving you a download link. For a contract, a CV full of personal details, or anything financial, that's an unnecessary risk — you're trusting a stranger's server with the document and their promise to delete it.",
          "Browser-based converters do the same job locally: the PDF is read, the text is extracted, and the .docx file is assembled entirely on your own device using JavaScript. Nothing crosses the network. The PDF to Word tool on this site works this way — add the file, download the .docx, open it in Word, Google Docs, or LibreOffice.",
        ],
      },
      {
        heading: "A quick post-conversion checklist",
        paragraphs: [
          "1. Skim the whole document once — it's much faster to spot a merged or split paragraph now than after you've started editing.\n2. Fix paragraph breaks first, before touching styling; flowing text correctly makes every later edit easier.\n3. Reapply heading styles in Word rather than manually enlarging text — you get a working document outline and consistent formatting.\n4. If tables came through as plain text, it's usually quicker to insert a fresh table and paste values in than to reconstruct alignment with spaces.",
        ],
      },
    ],
    relatedTools: ["pdf-to-word", "pdf-to-google-docs", "pdf-to-jpg", "merge-pdf"],
    relatedPosts: ["how-to-merge-pdf-without-uploading", "present-a-pdf-like-a-slide-deck"],
  },
  {
    slug: "pdf-to-jpg-when-and-how",
    title: "PDF to JPG: When It's the Right Move and How to Do It Well",
    description:
      "When converting PDF pages to JPG images makes sense, which resolution and quality settings to pick, and how to keep text sharp.",
    excerpt:
      "Sometimes a PDF is the wrong container — you need the page as a plain image you can post, message, or embed. Here's when PDF-to-JPG is the right call and how to pick settings.",
    publishedAt: "2026-07-11",
    intro: [
      "PDF is the default format for documents, but it's a terrible format for a lot of everyday sharing. You can't post a PDF page to Instagram, most website builders won't display one inline, and sending a one-page PDF through a chat app forces the other person to download and open it instead of just seeing it.",
      "Converting PDF pages to JPG images solves all of that: an image previews instantly everywhere. The trick is knowing when it's the right conversion — and picking settings that keep text readable instead of fuzzy.",
    ],
    sections: [
      {
        heading: "When converting to JPG makes sense",
        paragraphs: [
          "Reach for PDF-to-JPG when the page needs to be seen rather than edited or printed: sharing a flyer or menu page in a chat or on social media, embedding a page preview on a website, dropping a page into a slide or document that only accepts images, or creating a thumbnail for a download link.",
          "It's also a simple way to 'flatten' a page. An image can't have its text trivially selected, edited, or extracted the way a PDF can — useful when you want content viewable but not effortlessly reusable. (It's a deterrent, not security: anything visible can still be retyped or OCR'd.)",
        ],
      },
      {
        heading: "Resolution: the setting that matters most",
        paragraphs: [
          "Resolution decides how many pixels each page gets, and it matters more than quality for readability. Around 96 DPI is compact and fine for thumbnails and quick chat shares. Around 144 DPI is the sweet spot for screens — text is crisp at normal zoom and files stay reasonable. Around 216 DPI or more is worth it when the page has small print, dense tables, or will be zoomed into.",
          "Going higher than you need just inflates file size: a 216 DPI page has more than double the pixels of a 144 DPI one. Convert once at standard resolution, check whether the smallest text is readable, and only step up if it isn't.",
        ],
      },
      {
        heading: "Quality: why 90% is usually invisible",
        paragraphs: [
          "JPG quality controls how aggressively the image is compressed. At 90%, compression artifacts are practically invisible on document pages while still cutting file size substantially. Dropping to 75% shrinks files further and remains fine for casual sharing; below that, the soft halos JPG creates around sharp letter edges start becoming noticeable.",
          "One caveat: JPG was designed for photographs, not text. Pages that are pure black-on-white text show compression artifacts sooner than photo-heavy pages do. If a text-heavy page looks slightly fuzzy, raising quality (or resolution) fixes it — and for archival-grade sharpness, PNG-style lossless formats are the alternative, at the cost of larger files.",
        ],
      },
      {
        heading: "Doing it without uploading the document",
        paragraphs: [
          "As with most PDF tasks, the typical free converter site uploads your file to a server first. That's a pointless risk for anything private — bank statements, IDs, contracts — when modern browsers can render PDF pages to images entirely on your own device.",
          "The PDF to JPG tool on this site works locally: add a PDF, choose resolution and quality, and every page is rendered in your browser. You can download single pages or grab all of them in one ZIP, and the document itself never leaves your computer.",
        ],
      },
    ],
    relatedTools: ["pdf-to-jpg", "jpg-to-pdf", "compress-jpg", "image-resizer"],
    relatedPosts: ["jpg-vs-png-vs-webp", "convert-pdf-to-word-without-losing-text"],
  },
  {
    slug: "present-a-pdf-like-a-slide-deck",
    title: "How to Present a PDF Like a Slide Deck (PDF to PowerPoint)",
    description:
      "Stop scrolling PDFs in meetings. How to convert a PDF into a PowerPoint presentation, what converts well, and when to convert to Word instead.",
    excerpt:
      "Presenting a PDF by scrolling through a viewer looks improvised and breaks the flow of a meeting. Converting it to PowerPoint slides fixes that in one step — here's how.",
    publishedAt: "2026-07-11",
    intro: [
      "It happens in meetings everywhere: someone shares their screen, opens a PDF, and starts scrolling. Half a page is visible at a time, the zoom level is wrong, and every transition is a fumble with the scrollbar. The content might be excellent, but the delivery feels improvised.",
      "The fix is converting the PDF into an actual presentation file, where each page becomes one slide. You get real full-screen presenting, clean page-at-a-time transitions, a presenter view with notes, and the ability to reorder or drop pages — all in one conversion.",
    ],
    sections: [
      {
        heading: "How PDF-to-PowerPoint conversion actually works",
        paragraphs: [
          "The most reliable method renders each PDF page as a high-resolution image and places it on its own slide, with the slide dimensions matched to the page's aspect ratio. The result looks pixel-identical to the original document — every font, chart and layout detail preserved — because the slide literally is a picture of the page.",
          "The trade-off is that the text on those slides isn't individually editable; each slide behaves like a full-bleed image. For presenting, that's rarely a limitation — you can still reorder slides, delete pages, insert new editable slides between the converted ones, and add text boxes or annotations on top.",
        ],
      },
      {
        heading: "When to convert to PowerPoint vs. Word",
        paragraphs: [
          "The two conversions solve different problems, and picking the right one saves frustration. Convert to PowerPoint when the goal is showing the document: presenting a report in a meeting, splicing PDF pages into an existing deck, or recovering a presentation that only survives as an exported PDF. The visual fidelity is the whole point.",
          "Convert to Word when the goal is changing the words: editing a contract, updating a CV, reusing sections of a report. There you want flowing, editable text and don't care about pixel-perfect layout. If you need both — say, editing one page of a deck — convert to Word for the rewrite, export that page to PDF, and merge it back.",
        ],
      },
      {
        heading: "Tips for a smoother converted presentation",
        paragraphs: [
          "1. Trim before converting. If you'll only present 8 pages of a 40-page report, extract those pages first — the resulting .pptx is smaller and you skip slide-deleting afterwards.\n2. Check the aspect ratio. A4/Letter documents produce portrait-ish slides; that's faithful to the document, but if it looks odd on a widescreen projector, consider exporting the source to a landscape PDF first.\n3. Use presenter notes. Since the slides themselves are fixed images, the notes pane is the natural place for your talking points.\n4. Keep file size in mind. Each page becomes a high-resolution image, so very long PDFs produce hefty presentations — another reason to convert only the pages you'll show.",
        ],
      },
      {
        heading: "Keeping confidential decks off third-party servers",
        paragraphs: [
          "Presentations and the PDFs they come from are often exactly the documents you don't want on someone else's server: pitch decks, financials, unreleased plans. Conveniently, this conversion doesn't need a server at all — a browser can render PDF pages and assemble a .pptx file locally.",
          "The PDF to PowerPoint tool on this site does the whole conversion on your device: add the PDF, download the .pptx, open it in PowerPoint, Google Slides, or Keynote. Nothing is uploaded at any point.",
        ],
      },
    ],
    relatedTools: ["pdf-to-powerpoint", "extract-pdf-pages", "pdf-to-jpg", "pdf-to-word"],
    relatedPosts: ["convert-pdf-to-word-without-losing-text", "reduce-pdf-file-size-for-email"],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return posts.map((p) => p.slug);
}

export function getSortedPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedPosts
    .map((slug) => getPost(slug))
    .filter((p): p is BlogPost => Boolean(p));
}

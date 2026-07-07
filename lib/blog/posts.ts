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

import type { ToolDef } from "../types";

export const imageTools: ToolDef[] = [
  {
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    shortName: "JPG to PNG",
    category: "image-tools",
    title: "JPG to PNG Converter — Free, Local, No Upload",
    description:
      "Convert JPG images to PNG in your browser. Keeps original dimensions, converts multiple files at once, and never uploads your photos.",
    intro:
      "Convert JPG photos to lossless PNG files directly in your browser. Original dimensions are preserved and nothing is uploaded.",
    about: [
      "PNG is a lossless format, so converting from JPG stops any further quality loss from repeated re-saving and gives you a format that many design and office applications prefer. Note that PNG cannot recover detail that JPG compression already discarded — the conversion preserves the image exactly as it currently looks. PNG files are usually larger than the source JPG because no lossy compression is applied.",
      "This conversion is a common first step before further editing, since many design tools handle layers, transparency and repeated saves more predictably with PNG than with JPG. It's also a quick way to standardize a folder of mixed photo formats into one consistent type before archiving or sharing them.",
    ],
    useCases: [
      "Preparing a photo for a design tool like Figma, Photoshop or Canva that expects a lossless source file",
      "Archiving an important photo in a lossless format before making further edits",
      "Meeting a submission form or print shop requirement that specifically asks for a PNG file",
    ],
    tips: [
      "Convert from the highest-resolution JPG you have — PNG preserves whatever detail is already in the source.",
      "If you're converting a batch of vacation or event photos, add them all at once rather than one at a time.",
    ],
    steps: [
      "Drop one or more JPG files into the upload area, or click Choose files.",
      "Review the file list. Remove any file you added by mistake.",
      "Click Convert to PNG.",
      "Download each converted PNG, or convert another batch.",
    ],
    inputFormats: ["JPG", "JPEG"],
    outputFormats: ["PNG"],
    aliases: ["jpeg to png", "convert jpg png", "photo to png"],
    related: ["png-to-jpg", "jpg-to-webp", "image-compressor", "image-resizer", "jpg-to-pdf"],
    faqs: [
      {
        q: "Will converting JPG to PNG improve image quality?",
        a: "No. PNG preserves the image exactly as it is now, but it cannot restore detail that JPG compression already removed. The benefit is that the PNG will not degrade further when edited and re-saved.",
      },
      {
        q: "Why is the PNG larger than my original JPG?",
        a: "PNG uses lossless compression, which typically produces larger files than JPG's lossy compression, especially for photographs. That is expected and normal.",
      },
      {
        q: "Are my photos uploaded anywhere?",
        a: "No. The conversion runs entirely in your browser using the canvas API. Files never leave your device.",
      },
      {
        q: "Can I convert several JPGs to PNG at once?",
        a: "Yes. You can add up to 30 files in a single batch and download each converted PNG individually once processing finishes.",
      },
      {
        q: "Does converting to PNG add transparency to my photo?",
        a: "No. A JPG has no transparency information to begin with, so the resulting PNG is fully opaque. You would need to remove the background separately in an image editor if you want a transparent area.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    shortName: "PNG to JPG",
    category: "image-tools",
    title: "PNG to JPG Converter — Choose Quality & Background",
    description:
      "Convert PNG images to JPG in your browser. Pick the JPG quality, choose a background color for transparent areas, and keep files on your device.",
    intro:
      "Turn PNG images into smaller JPG files. Choose the quality level and the background color used for transparent areas — all processed locally.",
    about: [
      "JPG does not support transparency, so any transparent pixels in your PNG are filled with a background color of your choice (white by default). Converting to JPG usually reduces file size significantly, which is useful for email attachments and web uploads with size limits. The quality slider controls the trade-off between file size and visible compression artifacts; 80–90% is a good starting point for photos.",
      "This conversion is especially common when a PNG screenshot or graphic needs to go somewhere with strict upload size limits — a job application portal, a webform, or an email attachment cap — where the much smaller JPG makes the difference between an upload succeeding or failing.",
    ],
    useCases: [
      "Shrinking a large PNG screenshot so it fits under an email or upload size limit",
      "Preparing a photo exported as PNG from an editing app for a website that only accepts JPG",
      "Converting a batch of PNG graphics to JPG before sending them to someone with limited storage",
    ],
    tips: [
      "If your PNG has a transparent background, pick a background color that matches where the image will actually be displayed.",
      "Start at 85% quality and only lower it further if the file is still too large — going much below 70% starts to show visible artifacts on photos.",
    ],
    steps: [
      "Add one or more PNG files.",
      "Pick a JPG quality and, if your PNGs have transparency, a background color.",
      "Click Convert to JPG.",
      "Compare the original and converted sizes, then download.",
    ],
    inputFormats: ["PNG"],
    outputFormats: ["JPG"],
    aliases: ["png to jpeg", "convert png jpg", "png transparency to white"],
    related: ["jpg-to-png", "compress-png", "png-to-webp", "image-resizer", "png-to-pdf"],
    faqs: [
      {
        q: "Will transparency be lost?",
        a: "Yes — JPG has no transparency support. Transparent areas are filled with the background color you select before conversion, so you control exactly how they look.",
      },
      {
        q: "Does the conversion reduce quality?",
        a: "JPG is a lossy format, so some detail is discarded. At 85–90% quality the difference is rarely visible for photos. Screenshots with sharp text may show slight artifacts at lower settings.",
      },
      {
        q: "Will the image dimensions change?",
        a: "No. Width and height are preserved exactly. If you need a different size, use the Image Resizer after converting.",
      },
      {
        q: "Why would I choose JPG over keeping the PNG?",
        a: "Mainly file size. A PNG screenshot or graphic can be several times larger than the equivalent JPG, which matters for email limits, page load speed, and storage.",
      },
      {
        q: "Can I convert a whole folder of PNGs at once?",
        a: "Yes, add multiple PNG files in one go — each is converted with the same quality and background settings and can be downloaded individually.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG Converter",
    shortName: "WebP to JPG",
    category: "image-tools",
    title: "WebP to JPG Converter — Open WebP Files Anywhere",
    description:
      "Convert WebP images to widely supported JPG files in your browser. No upload, adjustable quality, batch conversion supported.",
    intro:
      "Convert WebP images into JPG files that open in any application, older device or upload form. Conversion happens locally in your browser.",
    about: [
      "WebP is common on the modern web, but many desktop applications, older devices and upload forms still expect JPG. This tool decodes the WebP in your browser and re-encodes it as JPG at the quality you choose. If the WebP contains transparency, transparent areas are filled with your selected background color, since JPG cannot store them.",
      "A common scenario is right-clicking and saving an image from a website, only to find it downloaded as a `.webp` file that won't open in an older photo viewer, a print shop's upload form, or an app that hasn't added WebP support. Converting to JPG solves that compatibility gap instantly.",
    ],
    useCases: [
      "Opening an image saved from a website that downloaded as `.webp` in software that doesn't support it",
      "Uploading a WebP photo to a print shop, form, or older platform that only accepts JPG",
      "Standardizing a mix of WebP and JPG images into a single consistent format",
    ],
    tips: [
      "If the WebP was animated, remember only the first frame carries over — check the preview before relying on the result.",
      "85% quality is a safe default; raise it if the source WebP was already high quality and you want to preserve as much detail as possible.",
    ],
    steps: [
      "Add the WebP files you saved from the web.",
      "Choose a JPG quality (85% works well for most images).",
      "Click Convert to JPG.",
      "Download the converted files.",
    ],
    inputFormats: ["WebP"],
    outputFormats: ["JPG"],
    aliases: ["webp to jpeg", "open webp file", "convert webp"],
    related: ["jpg-to-webp", "png-to-webp", "png-to-jpg", "image-compressor"],
    faqs: [
      {
        q: "Why can't I open WebP files on my computer?",
        a: "Some older applications and operating systems don't ship a WebP decoder. Converting to JPG gives you a format that virtually everything supports.",
      },
      {
        q: "Does this work with animated WebP?",
        a: "Only the first frame is converted, because JPG is a still-image format. For animations you would need a video or GIF format instead.",
      },
      {
        q: "Is anything uploaded to a server?",
        a: "No. Your browser decodes and re-encodes the image locally using the canvas API.",
      },
      {
        q: "Will the converted JPG look different from the WebP?",
        a: "Visually they should look very close at 85%+ quality. Because JPG can't store transparency, any transparent WebP areas become a solid background color instead.",
      },
      {
        q: "Can I convert many WebP files in one go?",
        a: "Yes, add as many as you need in a single batch and download each JPG once conversion finishes.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "jpg-to-webp",
    name: "JPG to WebP Converter",
    shortName: "JPG to WebP",
    category: "image-tools",
    title: "JPG to WebP Converter — Smaller Images for the Web",
    description:
      "Convert JPG to WebP in your browser to shrink image size for websites. Adjustable quality, side-by-side size comparison, no upload.",
    intro:
      "Re-encode JPG photos as WebP to cut file size for websites and apps. See the exact size saving before you download.",
    about: [
      "WebP typically encodes photos 20–35% smaller than JPG at comparable visual quality, which makes pages load faster and improves Core Web Vitals. This tool re-encodes your JPG locally and shows the original size, the new size and the percentage saved so you can judge whether the trade-off is worth it for each image. All modern browsers support WebP; only very old software does not.",
      "If you run a website or blog, swapping JPG images for WebP is one of the easiest wins for page speed — it requires no visual redesign, just smaller files serving the exact same photos to visitors.",
    ],
    useCases: [
      "Shrinking blog or product photos before uploading them to a website to improve load times",
      "Reducing the size of images bundled into an app or email template",
      "Testing how much smaller a set of photos could be before committing to a site-wide format switch",
    ],
    tips: [
      "80% quality is a solid starting point for photos — check the percentage-saved figure and adjust if you want more or less compression.",
      "Keep a JPG fallback available only if your audience includes users on genuinely outdated browsers; otherwise WebP alone is fine today.",
    ],
    steps: [
      "Add one or more JPG files.",
      "Set the WebP quality — 80% is a sensible default for photos.",
      "Click Convert to WebP and compare the size reduction shown per file.",
      "Download the WebP files.",
    ],
    inputFormats: ["JPG", "JPEG"],
    outputFormats: ["WebP"],
    aliases: ["jpeg to webp", "convert to webp", "smaller images for web"],
    related: ["png-to-webp", "webp-to-jpg", "image-compressor", "compress-jpg"],
    faqs: [
      {
        q: "How much smaller will my images get?",
        a: "It depends on the photo, but 20–35% smaller than the source JPG at similar quality is typical. The tool shows the exact saving for each file after conversion.",
      },
      {
        q: "Is WebP safe to use on my website?",
        a: "Yes. Every current browser supports WebP. If you must support very old browsers, keep a JPG fallback.",
      },
      {
        q: "Does converting twice lose quality?",
        a: "Each lossy re-encode discards a little detail. Convert from the highest-quality source you have rather than re-converting repeatedly.",
      },
      {
        q: "Will WebP hurt my SEO or image search rankings?",
        a: "No — search engines index WebP images normally, and the faster page load from smaller files is generally a positive ranking signal, not a negative one.",
      },
      {
        q: "Can I convert a whole batch of product photos at once?",
        a: "Yes, add multiple JPGs together and each will be converted with the same quality setting, ready to download individually.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "png-to-webp",
    name: "PNG to WebP Converter",
    shortName: "PNG to WebP",
    category: "image-tools",
    title: "PNG to WebP Converter — Keep Transparency, Cut Size",
    description:
      "Convert PNG to WebP in your browser. Transparency is preserved, file sizes drop substantially, and images never leave your device.",
    intro:
      "Convert PNG graphics to WebP while keeping transparency. WebP usually stores the same image in a fraction of the PNG's size.",
    about: [
      "Unlike JPG, WebP supports an alpha channel, so logos, icons and UI screenshots with transparent backgrounds convert cleanly. For graphics with large flat areas the size reduction over PNG is often dramatic. The quality setting applies lossy WebP compression; at 90%+ the result is visually indistinguishable for most graphics while still much smaller than the PNG.",
      "This makes WebP the better default for any transparent graphic destined for the web — a logo, an icon set, or a screenshot with rounded corners — since you keep the exact transparency behavior of PNG without paying its file-size cost.",
    ],
    useCases: [
      "Shrinking a logo or icon with a transparent background before adding it to a website",
      "Reducing the size of UI screenshots that include transparent or rounded-corner elements",
      "Preparing a set of transparent graphics for an app that benefits from smaller asset sizes",
    ],
    tips: [
      "Use 90% or higher quality for logos and icons — the size saving over PNG is already large even at high quality settings.",
      "Check the preview closely if the graphic has fine text or thin lines, since lossy compression can very slightly soften sharp edges.",
    ],
    steps: [
      "Add PNG files — transparency is kept automatically.",
      "Choose the WebP quality.",
      "Click Convert to WebP.",
      "Check the size savings and download.",
    ],
    inputFormats: ["PNG"],
    outputFormats: ["WebP"],
    aliases: ["png to webp transparent", "convert png webp"],
    related: ["jpg-to-webp", "webp-to-jpg", "compress-png", "image-compressor"],
    faqs: [
      {
        q: "Is transparency preserved?",
        a: "Yes. WebP supports full alpha transparency, so transparent PNG areas stay transparent after conversion.",
      },
      {
        q: "Why is WebP so much smaller than my PNG?",
        a: "PNG compression is lossless and relatively simple. WebP can apply modern lossy compression even to graphics with transparency, which shrinks files substantially with little visible change.",
      },
      {
        q: "Should I use WebP or PNG for my website?",
        a: "Use WebP for anything served to browsers — it is smaller and universally supported. Keep PNG for editing masters or when a workflow specifically requires it.",
      },
      {
        q: "Will fine details like small text in a screenshot stay sharp?",
        a: "At 90%+ quality, yes, for the vast majority of graphics. If you notice softening on very fine text, try a higher quality setting or compare against the original at full zoom.",
      },
      {
        q: "Can I batch convert multiple PNGs to WebP?",
        a: "Yes, add several PNG files together and each is converted with the same settings, ready to download.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    shortName: "Image Compressor",
    category: "image-tools",
    title: "Image Compressor — Reduce Image File Size Online",
    description:
      "Compress JPG, PNG and WebP images in your browser. Adjustable quality, exact before/after sizes, no upload and no watermark.",
    intro:
      "Shrink image file sizes by re-encoding at a quality level you control. Works with JPG, PNG and WebP, entirely in your browser.",
    about: [
      "The compressor decodes your image and re-encodes it with lossy compression at your chosen quality. For each file it shows the original size, the compressed size and the percentage saved, so you can find the smallest file that still looks right. PNG input is re-encoded to a lossy format of your choice (JPG or WebP), because PNG itself cannot trade quality for size. If a compressed result would be larger than the original, the tool tells you instead of handing you a worse file.",
      "This is the general-purpose option when you just want a smaller file and don't need format-specific control — for a single format with more targeted options, see the dedicated Compress JPG or Compress PNG tools instead.",
    ],
    useCases: [
      "Reducing photo sizes before uploading a batch to a website, portfolio, or online form",
      "Getting a folder of mixed-format images under a total storage or attachment limit",
      "Quickly comparing how much smaller an image gets at different quality levels before deciding what to keep",
    ],
    tips: [
      "Start around 80% quality and only go lower if you specifically need a smaller file — most people can't tell the difference above 75%.",
      "If an image is mostly flat color or has transparency, try WebP output; if it's a photo without transparency, JPG usually compresses just as well and is more universally compatible.",
    ],
    steps: [
      "Add the images you want to shrink (JPG, PNG or WebP).",
      "Pick an output format and quality level.",
      "Click Compress and review the per-file size reduction.",
      "Download the compressed images.",
    ],
    inputFormats: ["JPG", "PNG", "WebP"],
    outputFormats: ["JPG", "WebP"],
    aliases: ["reduce image size", "shrink photo", "make image smaller", "photo compressor"],
    related: ["compress-jpg", "compress-png", "image-resizer", "jpg-to-webp"],
    faqs: [
      {
        q: "How does compression affect quality?",
        a: "Lossy compression discards detail the eye is least likely to notice. At 75–85% quality most photos look unchanged. Very low settings introduce visible blockiness, so use the size readout to find your balance.",
      },
      {
        q: "Can I compress without any quality loss?",
        a: "Meaningful size reductions on photos require lossy compression. If you cannot accept any pixel changes, reducing dimensions with the Image Resizer is the alternative.",
      },
      {
        q: "Is there a file size or count limit?",
        a: "Files up to 25 MB each are supported, limited by your device's memory rather than a server quota — nothing is uploaded.",
      },
      {
        q: "Which format should I choose for output — JPG or WebP?",
        a: "WebP generally compresses smaller at the same visual quality and supports transparency. JPG is the safer choice only if you specifically need maximum compatibility with very old software.",
      },
      {
        q: "What if the compressed file ends up bigger than the original?",
        a: "That can happen with already-optimized images at high quality settings. The tool will flag this rather than silently give you a larger file, so you can lower the quality or keep the original.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "compress-jpg",
    name: "JPG Compressor",
    shortName: "Compress JPG",
    category: "image-tools",
    title: "Compress JPG — Reduce JPG File Size in Your Browser",
    description:
      "Compress JPG photos to a target quality level. See exact size savings per file. Local browser processing, no upload, no watermark.",
    intro:
      "Reduce the size of JPG photos by re-encoding them at a lower quality setting, with the exact saving shown for every file.",
    about: [
      "Cameras and phones save JPGs at very high quality settings that most uses don't need. Re-encoding at 75–85% quality routinely halves the file size with no visible difference at normal viewing sizes — useful for email limits, form uploads and faster web pages. Because each JPG re-encode is lossy, compress from your original file rather than compressing the same file repeatedly.",
      "This tool is specifically tuned for JPG-to-JPG compression, so if most of your files are already JPGs straight from a phone or camera, it's a more direct route than the general Image Compressor.",
    ],
    useCases: [
      "Shrinking phone photos before sending them by email or messaging apps with attachment limits",
      "Getting a batch of camera JPGs small enough to fit an upload form's size cap",
      "Speeding up a website by reducing the size of existing JPG images without changing format",
    ],
    tips: [
      "Compress from the original camera or phone file rather than a copy that's already been compressed once, to avoid stacking quality loss.",
      "If a photo will only ever be viewed on a phone screen, you can usually go a bit lower on quality than for one that might be printed or zoomed into.",
    ],
    steps: [
      "Add JPG files straight from your camera, phone export or downloads.",
      "Set the quality slider — start at 80%.",
      "Click Compress JPG and check the reduction for each file.",
      "Download the smaller files.",
    ],
    inputFormats: ["JPG", "JPEG"],
    outputFormats: ["JPG"],
    aliases: ["jpeg compressor", "reduce jpg size", "shrink jpg"],
    related: ["image-compressor", "compress-png", "image-resizer", "jpg-to-webp"],
    faqs: [
      {
        q: "How small can I make a JPG before it looks bad?",
        a: "For photos viewed at normal size, 70–85% quality is usually indistinguishable from the original. Below about 60% you may notice blockiness around edges. The size readout helps you stop at the right point.",
      },
      {
        q: "Does compressing change the image dimensions?",
        a: "No — width and height stay the same. If you also want smaller dimensions, run the file through the Image Resizer, which reduces size even further.",
      },
      {
        q: "Are photos uploaded to your server?",
        a: "No. Compression runs in your browser; the file never leaves your device.",
      },
      {
        q: "Is there a difference between this and the general Image Compressor?",
        a: "This tool is focused specifically on JPG in, JPG out. The Image Compressor also accepts PNG and WebP input and lets you choose a different output format.",
      },
      {
        q: "Can I compress a whole folder of vacation photos at once?",
        a: "Yes, add them all in one batch — each is compressed with the same quality setting and can be downloaded individually.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "compress-png",
    name: "PNG Compressor",
    shortName: "Compress PNG",
    category: "image-tools",
    title: "Compress PNG — Shrink PNG File Size Online",
    description:
      "Reduce PNG file size in your browser by converting to efficient WebP (transparency kept) or JPG. Exact before/after sizes shown.",
    intro:
      "PNG files are often far larger than they need to be. Shrink them by re-encoding to WebP (keeps transparency) or JPG, locally in your browser.",
    about: [
      "PNG compression is lossless, so a PNG cannot simply be 'saved at lower quality'. The practical way to shrink a large PNG is to re-encode it in a modern lossy format: WebP keeps transparency and usually cuts the size dramatically, while JPG is the right choice when maximum compatibility matters and the image has no transparency. This tool shows the exact size difference so you can pick the format that fits.",
      "PNG screenshots in particular tend to balloon in size because screen-capture tools save every pixel losslessly — this tool is a quick way to bring a folder of screenshots down to a manageable size before sharing or archiving them.",
    ],
    useCases: [
      "Shrinking large screenshots before adding them to documentation, tickets, or a shared drive",
      "Reducing the size of a transparent logo or icon exported from a design tool as PNG",
      "Getting a batch of PNGs under an upload or email attachment size limit",
    ],
    tips: [
      "For screenshots and UI graphics, WebP at 90%+ quality usually gives the best balance of small size and crisp detail.",
      "If the destination absolutely requires JPG and the PNG has transparency, preview the background color choice before downloading — it becomes a permanent part of the image.",
    ],
    steps: [
      "Add the PNG files you want to shrink.",
      "Choose WebP to keep transparency, or JPG for maximum compatibility.",
      "Set the quality and click Compress PNG.",
      "Review the savings and download.",
    ],
    inputFormats: ["PNG"],
    outputFormats: ["WebP", "JPG"],
    aliases: ["reduce png size", "shrink png", "png too large"],
    related: ["image-compressor", "png-to-webp", "png-to-jpg", "image-resizer"],
    faqs: [
      {
        q: "Why can't the PNG stay a PNG and just get smaller?",
        a: "PNG is lossless — its size is determined by the image content. Meaningful reductions require either shrinking the dimensions or re-encoding in a lossy format such as WebP or JPG.",
      },
      {
        q: "Will I lose transparency?",
        a: "Not if you choose WebP output — it fully supports transparency. JPG output fills transparent areas with a background color you choose.",
      },
      {
        q: "Which output should I pick for screenshots?",
        a: "WebP at 90% quality keeps text crisp and usually cuts screenshot size by well over half. Use JPG only if the destination cannot accept WebP.",
      },
      {
        q: "How much smaller will a typical PNG screenshot get?",
        a: "It varies with content, but screenshots with lots of flat color or white space often shrink by 60–90% when converted to WebP, since PNG's lossless format doesn't take advantage of those patterns as efficiently.",
      },
      {
        q: "Can I compress several PNGs in one batch?",
        a: "Yes, add multiple files together — each is compressed with the same format and quality setting you choose.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    shortName: "Image Resizer",
    category: "image-tools",
    title: "Image Resizer — Resize Images to Exact Dimensions",
    description:
      "Resize JPG, PNG and WebP images to exact pixel dimensions or a percentage in your browser. Aspect ratio lock prevents distortion.",
    intro:
      "Resize images to exact pixel dimensions or by percentage. The aspect ratio is locked by default so photos are never accidentally stretched.",
    about: [
      "Resizing reduces both dimensions and file size, which is often more effective than compression alone. Enter a target width or height and the other dimension is calculated automatically to preserve the aspect ratio; unlock the ratio only when you genuinely need a non-proportional size. High-quality browser scaling is used, and the output format matches your input so no unexpected conversion happens.",
      "This is especially useful when a platform enforces exact dimension requirements — a profile photo that must be a specific size, a banner image with a fixed width, or a thumbnail spec from a content management system.",
    ],
    useCases: [
      "Meeting a platform's exact pixel requirement for a profile photo, banner, or thumbnail",
      "Shrinking a large camera photo down to web-friendly dimensions before uploading",
      "Creating a smaller version of an image for a slideshow or presentation without stretching it",
    ],
    tips: [
      "Use one of the percentage presets (25%, 50%, 75%) for a quick, proportional resize without doing any math.",
      "If you need a specific width for a website, resize first and compress afterward for the smallest possible final file.",
    ],
    steps: [
      "Add an image (JPG, PNG or WebP). Its current dimensions are shown.",
      "Enter a new width or height, or a percentage. Keep the ratio locked to avoid distortion.",
      "Click Resize image.",
      "Preview the result and download.",
    ],
    inputFormats: ["JPG", "PNG", "WebP"],
    outputFormats: ["Same as input"],
    aliases: ["change image dimensions", "scale image", "make image smaller dimensions", "resize photo"],
    related: ["image-cropper", "image-compressor", "image-rotator", "jpg-to-png"],
    faqs: [
      {
        q: "Will resizing distort my photo?",
        a: "Not with the aspect ratio locked, which is the default. Entering one dimension calculates the other proportionally. Unlocking the ratio lets you set both freely, which can stretch the image.",
      },
      {
        q: "Can I make an image larger?",
        a: "Yes, but enlarging cannot add real detail — the result will be somewhat soft. Upscaling works best for modest increases.",
      },
      {
        q: "Does resizing change the format or quality?",
        a: "The output keeps your input format. JPG and WebP are re-encoded at high quality; PNG stays lossless.",
      },
      {
        q: "What's the maximum size I can resize to?",
        a: "Up to 20,000 pixels in either dimension, though very large sizes depend on your device's available memory since everything happens in your browser.",
      },
      {
        q: "Should I resize or crop if I want to remove part of the image?",
        a: "Resize scales the whole image down or up. If you want to cut away part of the frame instead, use the Image Cropper.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    shortName: "Image Cropper",
    category: "image-tools",
    title: "Crop Image Online — Free Browser Image Cropper",
    description:
      "Crop images by dragging a selection or entering exact pixel values. Works with JPG, PNG and WebP, entirely in your browser.",
    intro:
      "Cut an image down to exactly the region you need. Drag the crop box on the preview or type precise pixel values.",
    about: [
      "The cropper shows your image with a draggable, resizable selection rectangle, and mirrors the selection in numeric fields (X, Y, width, height) for pixel-precise work. Cropping is lossless in the sense that pixels inside the selection are copied unchanged; PNG output stays lossless and JPG/WebP are re-encoded at high quality. This is useful for removing surrounding clutter from screenshots, trimming photos for avatars, or isolating one part of a larger graphic.",
      "Because the numeric fields stay in sync with the visual drag handles, you can rough in the area you want by eye and then fine-tune it to the exact pixel if precision matters — for example matching a specific aspect ratio required by a profile photo upload.",
    ],
    useCases: [
      "Trimming an unwanted border or surrounding clutter from a screenshot",
      "Cropping a photo into a square or specific ratio for a profile picture",
      "Isolating one section of a larger graphic or diagram to share separately",
    ],
    tips: [
      "Drag the selection roughly into place first, then fine-tune with the numeric X/Y/width/height fields for pixel-perfect results.",
      "If you need a specific aspect ratio (like a square), calculate the width and height first and type them directly into the fields.",
    ],
    steps: [
      "Add an image to see it in the crop preview.",
      "Drag the selection box, resize it from the corners, or type exact X, Y, width and height values.",
      "Click Crop image.",
      "Download the cropped result.",
    ],
    inputFormats: ["JPG", "PNG", "WebP"],
    outputFormats: ["Same as input"],
    aliases: ["cut image", "trim image", "crop photo", "crop screenshot"],
    related: ["image-resizer", "image-rotator", "image-compressor"],
    faqs: [
      {
        q: "Can I crop to exact pixel coordinates?",
        a: "Yes. The numeric fields accept exact X, Y, width and height values and stay in sync with the visual selection box.",
      },
      {
        q: "Does cropping reduce quality?",
        a: "The selected pixels are copied as-is. PNG output is lossless; JPG and WebP output are re-encoded once at high quality, which is visually negligible.",
      },
      {
        q: "Is the photo uploaded for cropping?",
        a: "No. The preview and the crop both happen in your browser.",
      },
      {
        q: "Can I crop to a specific aspect ratio like a square or 16:9?",
        a: "Yes — calculate the width and height you need for that ratio and enter them directly into the numeric fields, or resize the selection box by eye.",
      },
      {
        q: "What happens if my selection goes past the edge of the image?",
        a: "The selection is automatically constrained to stay within the image bounds, so you can't accidentally crop outside the actual picture.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "image-rotator",
    name: "Image Rotator",
    shortName: "Image Rotator",
    category: "image-tools",
    title: "Rotate Image Online — 90°, 180°, 270° and Flip",
    description:
      "Rotate images in 90-degree steps or flip them horizontally and vertically, with a live preview. Local browser processing, no upload.",
    intro:
      "Rotate an image in 90° steps or mirror it horizontally or vertically. The preview updates instantly and the download matches exactly what you see.",
    about: [
      "Photos taken with a rotated phone or camera sometimes display sideways because software ignores the orientation flag. This tool applies the rotation to the actual pixels, so the image displays correctly everywhere. Rotation by right angles moves pixels without resampling; flips mirror the image for tasks like correcting scanned film or preparing printable transfers.",
      "This fixes the frustrating case where a photo looks correct in one app (like your phone's gallery) but shows up sideways elsewhere (like a website or a different device) — rotating the actual pixels makes the orientation consistent everywhere it's viewed.",
    ],
    useCases: [
      "Fixing a phone photo that displays sideways when uploaded to a website or shared with someone else",
      "Flipping a scanned document or photo that came out mirrored",
      "Preparing an image for printing on transfer paper, which often needs to be mirrored first",
    ],
    tips: [
      "If a photo looks fine on your phone but sideways elsewhere, that's the classic sign it needs this fix rather than a display setting change.",
      "Use the live preview to confirm the final orientation before applying — flips and rotations can be combined, so check the result matches what you expect.",
    ],
    steps: [
      "Add the image that displays the wrong way up.",
      "Use the rotate and flip buttons until the preview looks right.",
      "Click Apply and download.",
      "Repeat with another image if needed.",
    ],
    inputFormats: ["JPG", "PNG", "WebP"],
    outputFormats: ["Same as input"],
    aliases: ["turn image", "flip image", "mirror image", "photo sideways fix"],
    related: ["image-cropper", "image-resizer", "rotate-pdf"],
    faqs: [
      {
        q: "Why does my photo show sideways in some apps but not others?",
        a: "The pixels were saved rotated and an EXIF orientation flag tells viewers to correct it — but not all software honors the flag. Rotating here rewrites the pixels so every application shows it correctly.",
      },
      {
        q: "Does rotating lose quality?",
        a: "90°-step rotations rearrange pixels without resampling. PNG output is lossless; JPG output involves one high-quality re-encode.",
      },
      {
        q: "Can I rotate by an arbitrary angle like 15°?",
        a: "This tool covers right-angle rotation and flips, which handle orientation fixes. Arbitrary-angle rotation crops or adds background and is better done in an image editor.",
      },
      {
        q: "Can I both rotate and flip the same image?",
        a: "Yes, the rotate and flip controls can be combined — for example rotating 90° and then flipping horizontally — and the live preview shows the exact combined result before you apply it.",
      },
      {
        q: "Will this fix a photo that's upside down?",
        a: "Yes, rotate it 180° and the image will display right-side up everywhere.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64 Converter",
    shortName: "Image to Base64",
    category: "image-tools",
    title: "Image to Base64 — Data URI Generator for Developers",
    description:
      "Convert an image to a Base64 string or data URI in your browser. Copy ready-to-use HTML and CSS snippets. Nothing is uploaded.",
    intro:
      "Encode an image as Base64 and copy it as a raw string, a data URI, an HTML <img> tag or a CSS background rule.",
    about: [
      "Base64 encoding turns binary image data into text, letting you embed small images directly in HTML, CSS or JSON without a separate file request. The encoded text is about 33% larger than the binary file, so this technique suits icons and small graphics rather than photographs. The tool outputs the raw Base64, the full data URI with the correct MIME type, and copy-ready HTML and CSS snippets.",
      "This is a common step when building a single-file HTML prototype, embedding a small logo directly into an email template, or storing an image inline in a JSON configuration where a separate file reference isn't practical.",
    ],
    useCases: [
      "Embedding a small logo or icon directly into an HTML email so it doesn't rely on loading an external image",
      "Inlining an image into a single-file HTML prototype or component for easy sharing",
      "Storing a small graphic as a string inside a JSON config or database field",
    ],
    tips: [
      "Reserve this technique for small assets like icons and logos — encoding a large photo as Base64 bloats your HTML or CSS file unnecessarily.",
      "Use the data URI flavor when you need the MIME type included, and the raw Base64 flavor when a system expects just the encoded string on its own.",
    ],
    steps: [
      "Add an image (any common format).",
      "Choose the output flavor: raw Base64, data URI, HTML tag or CSS rule.",
      "Click Copy to put the result on your clipboard.",
      "Paste it into your code.",
    ],
    inputFormats: ["JPG", "PNG", "WebP", "GIF", "SVG"],
    outputFormats: ["Base64 text", "Data URI"],
    aliases: ["data uri generator", "embed image in css", "img to base64"],
    related: ["base64-to-image", "base64-encoder-decoder", "image-compressor"],
    faqs: [
      {
        q: "When should I embed images as Base64?",
        a: "For small assets (icons, tiny logos) where saving an HTTP request matters, or where external files aren't possible — emails, single-file HTML documents, JSON payloads. Large photos should stay as normal files.",
      },
      {
        q: "Why is the Base64 output larger than my image file?",
        a: "Base64 represents every 3 bytes of binary data as 4 text characters, adding roughly 33% overhead. That is inherent to the encoding.",
      },
      {
        q: "Is my image sent to a server to encode it?",
        a: "No. The FileReader API in your browser produces the Base64 string locally.",
      },
      {
        q: "What's the difference between the data URI and raw Base64 options?",
        a: "The data URI includes a `data:image/png;base64,` prefix that tells a browser or app what to do with the string. Raw Base64 is just the encoded characters, for systems that add their own prefix or handle the MIME type separately.",
      },
      {
        q: "Can I embed a very large photo this way?",
        a: "Technically yes, but it's not recommended — the resulting text becomes very large, bloats whatever file it's embedded in, and loses the caching benefits of a normal image file.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "base64-to-image",
    name: "Base64 to Image Converter",
    shortName: "Base64 to Image",
    category: "image-tools",
    title: "Base64 to Image — Decode and Download Image Files",
    description:
      "Paste a Base64 string or data URI and get back a preview and downloadable image file. Decoding runs locally in your browser.",
    intro:
      "Paste Base64 image data — with or without the data URI prefix — to preview it and download it as a normal image file.",
    about: [
      "This tool decodes Base64 image data back into a file you can save and open. It accepts full data URIs (data:image/png;base64,…) as well as bare Base64 strings, detects the image type from the data itself, and shows a live preview before you download. Useful when extracting images from API responses, email source, CSS files or database fields.",
      "This is the reverse of the Image to Base64 tool, and often needed together with it — for example, pulling an inline image out of an email's HTML source or a database export so you can view and save it as a normal file again.",
    ],
    useCases: [
      "Extracting and saving an image embedded in an API response as Base64 text",
      "Recovering a viewable image file from a database export or config file that stored it inline",
      "Pulling an inline image out of an HTML email's source code to save separately",
    ],
    tips: [
      "If you copied the string from an email client, check for stray line breaks — some email software inserts them into long Base64 strings, which will need to be removed first.",
      "You don't need to strip the `data:image/...;base64,` prefix yourself — paste the full data URI and the tool handles it automatically.",
    ],
    steps: [
      "Paste the Base64 string or data URI into the text area.",
      "The preview appears automatically when the data is valid.",
      "Check the detected format and dimensions.",
      "Click Download image.",
    ],
    inputFormats: ["Base64 text", "Data URI"],
    outputFormats: ["PNG", "JPG", "WebP", "GIF"],
    aliases: ["decode base64 image", "data uri to file", "base64 png"],
    related: ["image-to-base64", "base64-encoder-decoder", "jpg-to-png"],
    faqs: [
      {
        q: "Do I need to include the data:image prefix?",
        a: "No. Both full data URIs and bare Base64 strings work — the image type is detected from the decoded bytes.",
      },
      {
        q: "Why does the tool say my Base64 is invalid?",
        a: "Common causes are truncated strings (copied partially), URL-encoded characters like %2B instead of +, or line breaks inserted by an email client. The error message indicates what was found.",
      },
      {
        q: "Is the decoded image private?",
        a: "Yes. Decoding happens in your browser; the data is never transmitted.",
      },
      {
        q: "What image formats can this tool detect?",
        a: "It recognizes PNG, JPG, GIF and WebP from the decoded byte signature, regardless of what the original file was named.",
      },
      {
        q: "My Base64 string looks URL-encoded — will this still work?",
        a: "If the tool detects characters like %2B or %2F, it will let you know the string needs to be URL-decoded first. Use the URL Decoder tool on it, then paste the result here.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC to JPG Converter",
    shortName: "HEIC to JPG",
    category: "image-tools",
    title: "HEIC to JPG Converter — iPhone Photos, No Upload",
    description:
      "Convert iPhone HEIC/HEIF photos to JPG in your browser. Batch convert up to 20 photos with a quality slider — no upload, free, no watermark.",
    intro:
      "Turn iPhone HEIC photos into universally compatible JPG files. Convert up to 20 photos at once, adjust the quality, and download — nothing is uploaded anywhere.",
    about: [
      "Since iOS 11, iPhones save photos in HEIC (High Efficiency Image Container) by default — a format that stores excellent quality at about half the file size of JPG, but that many websites, Windows apps, Android devices, and upload forms still refuse to accept. This tool decodes the HEIC image directly in your browser and re-encodes it as a standard JPG that works absolutely everywhere.",
      "The conversion runs entirely on your device, which matters more for photos than almost any other file type: camera images carry EXIF data and often show faces, homes, documents, or children. Nothing here is transmitted to a server — the decoded photo goes straight from your browser's memory to your downloads folder.",
    ],
    useCases: [
      "Uploading iPhone photos to a website, form, or portal that rejects HEIC files",
      "Sending photos to someone on Windows or Android whose apps can't open HEIC",
      "Converting a batch of vacation or product photos before posting or archiving them",
    ],
    tips: [
      "Keep quality at 90% for photos you care about — the size savings from going lower are modest compared to the visible loss in detail.",
      "To stop the problem at the source, you can set your iPhone to shoot JPG directly: Settings → Camera → Formats → Most Compatible.",
    ],
    steps: [
      "Add your HEIC/HEIF photos (up to 20 at once).",
      "Choose a JPG quality — 90% is a good default.",
      "Each photo converts automatically in your browser.",
      "Download the JPGs individually.",
    ],
    inputFormats: ["HEIC", "HEIF"],
    outputFormats: ["JPG"],
    aliases: ["heif to jpg", "iphone photo to jpg", "heic to jpeg", "convert heic"],
    related: ["jpg-to-pdf", "compress-jpg", "image-resizer", "jpg-to-webp", "png-to-jpg"],
    faqs: [
      {
        q: "Why are my iPhone photos HEIC in the first place?",
        a: "Apple switched to HEIC in iOS 11 because it stores the same quality as JPG at roughly half the size, saving storage space. The trade-off is compatibility — plenty of software outside the Apple ecosystem still can't open it.",
      },
      {
        q: "Will converting to JPG reduce photo quality?",
        a: "JPG is a lossy format, so there's a small technical quality trade at re-encoding. At 90% quality the difference is invisible in normal viewing — the practical gain in compatibility far outweighs it.",
      },
      {
        q: "Are my photos uploaded during conversion?",
        a: "No. The HEIC file is decoded and re-encoded entirely inside your browser. Your photos never leave your device — you could go offline after the page loads and conversion would still work.",
      },
      {
        q: "Why did one of my files fail to convert?",
        a: "A few HEIC variants — notably some burst photos, portrait-depth captures, and files from certain non-Apple cameras — use encodings the in-browser decoder can't handle. Exporting the photo from the Photos app usually normalizes it.",
      },
      {
        q: "Can I convert Live Photos or videos?",
        a: "The still image of a Live Photo converts fine if you share it as a HEIC file. The motion part is a video (.mov) and isn't part of this conversion.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
];

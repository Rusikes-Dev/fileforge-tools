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
    about:
      "PNG is a lossless format, so converting from JPG stops any further quality loss from repeated re-saving and gives you a format that many design and office applications prefer. Note that PNG cannot recover detail that JPG compression already discarded — the conversion preserves the image exactly as it currently looks. PNG files are usually larger than the source JPG because no lossy compression is applied.",
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
    about:
      "JPG does not support transparency, so any transparent pixels in your PNG are filled with a background color of your choice (white by default). Converting to JPG usually reduces file size significantly, which is useful for email attachments and web uploads with size limits. The quality slider controls the trade-off between file size and visible compression artifacts; 80–90% is a good starting point for photos.",
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
    about:
      "WebP is common on the modern web, but many desktop applications, older devices and upload forms still expect JPG. This tool decodes the WebP in your browser and re-encodes it as JPG at the quality you choose. If the WebP contains transparency, transparent areas are filled with your selected background color, since JPG cannot store them.",
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
    about:
      "WebP typically encodes photos 20–35% smaller than JPG at comparable visual quality, which makes pages load faster and improves Core Web Vitals. This tool re-encodes your JPG locally and shows the original size, the new size and the percentage saved so you can judge whether the trade-off is worth it for each image. All modern browsers support WebP; only very old software does not.",
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
    about:
      "Unlike JPG, WebP supports an alpha channel, so logos, icons and UI screenshots with transparent backgrounds convert cleanly. For graphics with large flat areas the size reduction over PNG is often dramatic. The quality setting applies lossy WebP compression; at 90%+ the result is visually indistinguishable for most graphics while still much smaller than the PNG.",
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
    about:
      "The compressor decodes your image and re-encodes it with lossy compression at your chosen quality. For each file it shows the original size, the compressed size and the percentage saved, so you can find the smallest file that still looks right. PNG input is re-encoded to a lossy format of your choice (JPG or WebP), because PNG itself cannot trade quality for size. If a compressed result would be larger than the original, the tool tells you instead of handing you a worse file.",
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
    about:
      "Cameras and phones save JPGs at very high quality settings that most uses don't need. Re-encoding at 75–85% quality routinely halves the file size with no visible difference at normal viewing sizes — useful for email limits, form uploads and faster web pages. Because each JPG re-encode is lossy, compress from your original file rather than compressing the same file repeatedly.",
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
    about:
      "PNG compression is lossless, so a PNG cannot simply be 'saved at lower quality'. The practical way to shrink a large PNG is to re-encode it in a modern lossy format: WebP keeps transparency and usually cuts the size dramatically, while JPG is the right choice when maximum compatibility matters and the image has no transparency. This tool shows the exact size difference so you can pick the format that fits.",
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
    about:
      "Resizing reduces both dimensions and file size, which is often more effective than compression alone. Enter a target width or height and the other dimension is calculated automatically to preserve the aspect ratio; unlock the ratio only when you genuinely need a non-proportional size. High-quality browser scaling is used, and the output format matches your input so no unexpected conversion happens.",
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
    about:
      "The cropper shows your image with a draggable, resizable selection rectangle, and mirrors the selection in numeric fields (X, Y, width, height) for pixel-precise work. Cropping is lossless in the sense that pixels inside the selection are copied unchanged; PNG output stays lossless and JPG/WebP are re-encoded at high quality. This is useful for removing surrounding clutter from screenshots, trimming photos for avatars, or isolating one part of a larger graphic.",
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
    about:
      "Photos taken with a rotated phone or camera sometimes display sideways because software ignores the orientation flag. This tool applies the rotation to the actual pixels, so the image displays correctly everywhere. Rotation by right angles moves pixels without resampling; flips mirror the image for tasks like correcting scanned film or preparing printable transfers.",
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
    about:
      "Base64 encoding turns binary image data into text, letting you embed small images directly in HTML, CSS or JSON without a separate file request. The encoded text is about 33% larger than the binary file, so this technique suits icons and small graphics rather than photographs. The tool outputs the raw Base64, the full data URI with the correct MIME type, and copy-ready HTML and CSS snippets.",
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
    about:
      "This tool decodes Base64 image data back into a file you can save and open. It accepts full data URIs (data:image/png;base64,…) as well as bare Base64 strings, detects the image type from the data itself, and shows a live preview before you download. Useful when extracting images from API responses, email source, CSS files or database fields.",
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
    ],
    processing: "browser",
    indexable: true,
  },
];

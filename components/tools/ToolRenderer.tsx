"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function loading() {
  return (
    <div className="flex min-h-40 items-center justify-center rounded border border-dashed border-ink-300 text-sm text-ink-500" role="status">
      Loading tool…
    </div>
  );
}

/** Heavy components are loaded per-slug so PDF/QR libraries never ship to unrelated pages. */
const ImageConverter = dynamic(() => import("./image/ImageConverter"), { ssr: false, loading });
const ImageResizerTool = dynamic(() => import("./image/ImageResizerTool"), { ssr: false, loading });
const ImageCropperTool = dynamic(() => import("./image/ImageCropperTool"), { ssr: false, loading });
const ImageRotatorTool = dynamic(() => import("./image/ImageRotatorTool"), { ssr: false, loading });
const ImageToBase64Tool = dynamic(() => import("./image/ImageToBase64Tool"), { ssr: false, loading });
const Base64ToImageTool = dynamic(() => import("./image/Base64ToImageTool"), { ssr: false, loading });
const ImagesToPdfTool = dynamic(() => import("./pdf/ImagesToPdfTool"), { ssr: false, loading });
const PdfMergeTool = dynamic(() => import("./pdf/PdfMergeTool"), { ssr: false, loading });
const PdfSplitTool = dynamic(() => import("./pdf/PdfSplitTool"), { ssr: false, loading });
const PdfRotateTool = dynamic(() => import("./pdf/PdfRotateTool"), { ssr: false, loading });
const PdfPageCounterTool = dynamic(() => import("./pdf/PdfPageCounterTool"), { ssr: false, loading });
const TextCounterTool = dynamic(() => import("./text/TextCounterTool"), { ssr: false, loading });
const CaseConverterTool = dynamic(() => import("./text/CaseConverterTool"), { ssr: false, loading });
const LineCleanupTool = dynamic(() => import("./text/LineCleanupTool"), { ssr: false, loading });
const FindReplaceTool = dynamic(() => import("./text/FindReplaceTool"), { ssr: false, loading });
const JsonTool = dynamic(() => import("./dev/JsonTool"), { ssr: false, loading });
const CsvJsonTool = dynamic(() => import("./dev/CsvJsonTool"), { ssr: false, loading });
const UrlCodecTool = dynamic(() => import("./dev/UrlCodecTool"), { ssr: false, loading });
const Base64TextTool = dynamic(() => import("./dev/Base64TextTool"), { ssr: false, loading });
const UuidTool = dynamic(() => import("./dev/UuidTool"), { ssr: false, loading });
const PasswordTool = dynamic(() => import("./dev/PasswordTool"), { ssr: false, loading });
const QrTool = dynamic(() => import("./dev/QrTool"), { ssr: false, loading });

const JPG = "image/jpeg";
const PNG = "image/png";
const WEBP = "image/webp";

const registry: Record<string, ComponentType> = {
  // Image converters and compressors
  "jpg-to-png": () => (
    <ImageConverter acceptMimes={[JPG]} acceptAttr="image/jpeg,.jpg,.jpeg" outputChoices={[PNG]}
      defaultOutput={PNG} showQuality={false} actionLabel="Convert to PNG" />
  ),
  "png-to-jpg": () => (
    <ImageConverter acceptMimes={[PNG]} acceptAttr="image/png,.png" outputChoices={[JPG]}
      defaultOutput={JPG} showBackground actionLabel="Convert to JPG" />
  ),
  "webp-to-jpg": () => (
    <ImageConverter acceptMimes={[WEBP]} acceptAttr="image/webp,.webp" outputChoices={[JPG]}
      defaultOutput={JPG} showBackground actionLabel="Convert to JPG" />
  ),
  "jpg-to-webp": () => (
    <ImageConverter acceptMimes={[JPG]} acceptAttr="image/jpeg,.jpg,.jpeg" outputChoices={[WEBP]}
      defaultOutput={WEBP} actionLabel="Convert to WebP" />
  ),
  "png-to-webp": () => (
    <ImageConverter acceptMimes={[PNG]} acceptAttr="image/png,.png" outputChoices={[WEBP]}
      defaultOutput={WEBP} actionLabel="Convert to WebP" />
  ),
  "image-compressor": () => (
    <ImageConverter acceptMimes={[JPG, PNG, WEBP]} acceptAttr="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
      outputChoices={[JPG, WEBP]} defaultOutput={JPG} showBackground actionLabel="Compress images" />
  ),
  "compress-jpg": () => (
    <ImageConverter acceptMimes={[JPG]} acceptAttr="image/jpeg,.jpg,.jpeg" outputChoices={[JPG]}
      defaultOutput={JPG} actionLabel="Compress JPG" />
  ),
  "compress-png": () => (
    <ImageConverter acceptMimes={[PNG]} acceptAttr="image/png,.png" outputChoices={[WEBP, JPG]}
      defaultOutput={WEBP} showBackground actionLabel="Compress PNG" />
  ),
  "image-resizer": ImageResizerTool,
  "image-cropper": ImageCropperTool,
  "image-rotator": ImageRotatorTool,
  "image-to-base64": ImageToBase64Tool,
  "base64-to-image": Base64ToImageTool,
  // PDF
  "jpg-to-pdf": () => <ImagesToPdfTool kind="jpg" />,
  "png-to-pdf": () => <ImagesToPdfTool kind="png" />,
  "merge-pdf": PdfMergeTool,
  "split-pdf": () => <PdfSplitTool mode="split" />,
  "extract-pdf-pages": () => <PdfSplitTool mode="extract" />,
  "rotate-pdf": PdfRotateTool,
  "pdf-page-counter": PdfPageCounterTool,
  // Text
  "word-counter": () => <TextCounterTool mode="words" />,
  "character-counter": () => <TextCounterTool mode="characters" />,
  "text-statistics": () => <TextCounterTool mode="statistics" />,
  "case-converter": CaseConverterTool,
  "remove-duplicate-lines": () => <LineCleanupTool mode="dedupe" />,
  "sort-lines": () => <LineCleanupTool mode="sort" />,
  "remove-extra-spaces": () => <LineCleanupTool mode="spaces" />,
  "find-and-replace-text": FindReplaceTool,
  // Developer
  "json-formatter": () => <JsonTool mode="format" />,
  "json-minifier": () => <JsonTool mode="minify" />,
  "json-validator": () => <JsonTool mode="validate" />,
  "csv-to-json": () => <CsvJsonTool direction="csv-to-json" />,
  "json-to-csv": () => <CsvJsonTool direction="json-to-csv" />,
  "url-encoder-decoder": UrlCodecTool,
  "base64-encoder-decoder": Base64TextTool,
  "uuid-generator": UuidTool,
  "password-generator": PasswordTool,
  "qr-code-generator": QrTool,
};

export const implementedSlugs = Object.keys(registry);

export default function ToolRenderer({ slug }: { slug: string }) {
  const Tool = registry[slug];
  if (!Tool) {
    return (
      <p className="rounded border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">
        This tool is not available yet.
      </p>
    );
  }
  return <Tool />;
}

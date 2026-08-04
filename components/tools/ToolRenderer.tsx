"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Skeleton shown while a tool's chunk downloads.
 *
 * Mirrors the rough shape of an upload-style tool rather than showing a
 * spinner, so the layout does not jump when the real control arrives and the
 * wait reads as progress instead of a stall.
 */
function loading() {
  return (
    <div
      role="status"
      aria-label="Loading tool"
      className="rounded-2xl border-2 border-dashed border-ink-300 bg-ink-50 px-6 py-10 sm:py-14"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        <div className="skeleton h-12 w-12 rounded-xl" />
        <div className="skeleton h-4 w-40" />
        <div className="skeleton h-3 w-64" />
        <div className="skeleton mt-2 h-10 w-32 rounded-lg" />
      </div>
      <span className="sr-only">Loading tool…</span>
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
const PdfCompressTool = dynamic(() => import("./pdf/PdfCompressTool"), { ssr: false, loading });
const PdfWatermarkTool = dynamic(() => import("./pdf/PdfWatermarkTool"), { ssr: false, loading });
const PdfToImagesTool = dynamic(() => import("./pdf/PdfToImagesTool"), { ssr: false, loading });
const PdfToWordTool = dynamic(() => import("./pdf/PdfToWordTool"), { ssr: false, loading });
const PdfToPowerpointTool = dynamic(() => import("./pdf/PdfToPowerpointTool"), { ssr: false, loading });
const WordToPdfTool = dynamic(() => import("./pdf/WordToPdfTool"), { ssr: false, loading });
const HeicToJpgTool = dynamic(() => import("./image/HeicToJpgTool"), { ssr: false, loading });
const ColorConverterTool = dynamic(() => import("./dev/ColorConverterTool"), { ssr: false, loading });
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
  "heic-to-jpg": HeicToJpgTool,
  // PDF
  "jpg-to-pdf": () => <ImagesToPdfTool kind="jpg" />,
  "png-to-pdf": () => <ImagesToPdfTool kind="png" />,
  "merge-pdf": PdfMergeTool,
  "split-pdf": () => <PdfSplitTool mode="split" />,
  "extract-pdf-pages": () => <PdfSplitTool mode="extract" />,
  "rotate-pdf": PdfRotateTool,
  "pdf-page-counter": PdfPageCounterTool,
  "compress-pdf": PdfCompressTool,
  "add-watermark-to-pdf": PdfWatermarkTool,
  "pdf-to-jpg": () => <PdfToImagesTool format="image/jpeg" />,
  "pdf-to-word": () => <PdfToWordTool variant="word" />,
  "pdf-to-google-docs": () => <PdfToWordTool variant="gdocs" />,
  "pdf-to-powerpoint": PdfToPowerpointTool,
  "word-to-pdf": WordToPdfTool,
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
  "color-converter": ColorConverterTool,
};

export const implementedSlugs = Object.keys(registry);

export default function ToolRenderer({ slug }: { slug: string }) {
  const Tool = registry[slug];
  if (!Tool) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-warning-200 bg-warning-50 px-4 py-3.5 text-sm text-warning-700"
      >
        <p className="font-medium">This tool isn&apos;t available yet.</p>
        <p className="mt-1">
          The page exists but its interface hasn&apos;t shipped. Please try another tool from the
          list below.
        </p>
      </div>
    );
  }
  return <Tool />;
}

"use client";

import { useState } from "react";
import { useObjectUrlList } from "@/lib/hooks/useObjectUrl";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";
import type { RenderedPage } from "@/lib/converters/pdf-render";

const QUALITY_CHOICES = [
  { label: "High (90%)", value: 0.9 },
  { label: "Medium (75%)", value: 0.75 },
  { label: "Smaller files (60%)", value: 0.6 },
];

const SCALE_CHOICES = [
  { label: "Standard (144 DPI)", value: 2 },
  { label: "High detail (216 DPI)", value: 3 },
  { label: "Compact (96 DPI)", value: 1.34 },
];

export default function PdfToImagesTool({ format }: { format: "image/jpeg" | "image/png" }) {
  const ext = format === "image/jpeg" ? "jpg" : "png";
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [quality, setQuality] = useState(0.9);
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  // Managed by a hook so the per-page preview URLs are revoked when the result
  // is replaced *and* when the tool unmounts — the latter never happened
  // before, leaking one URL per rendered page on every navigation away.
  const { urls: previews, setBlobs: setPreviewBlobs, clear: clearPreviews } = useObjectUrlList();

  async function addFiles(incoming: File[]) {
    setError(null);
    setPages([]);
    clearPreviews();
    const f = incoming[0];
    const { validatePdfFile, countPages } = await import("@/lib/converters/pdf");
    const problem = validatePdfFile(f);
    if (problem) return setError(problem);
    try {
      const count = await countPages(f);
      setFile(f);
      setPageCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "This PDF could not be read.");
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setPages([]);
    try {
      const { renderPdfToImages } = await import("@/lib/converters/pdf-render");
      const rendered = await renderPdfToImages(file, {
        format,
        quality: format === "image/jpeg" ? quality : undefined,
        scale,
        onProgress: (done, total) => setProgress([done, total]),
      });
      setPages(rendered);
      setPreviewBlobs(rendered.map((p) => p.blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  async function downloadAll() {
    if (!file || pages.length === 0) return;
    setBusy(true);
    try {
      const { zipRenderedPages } = await import("@/lib/converters/pdf-render");
      const zip = await zipRenderedPages(pages, safeBaseName(file.name), ext);
      downloadBlob(zip, `${safeBaseName(file.name)}-${ext}.zip`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The ZIP could not be created.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setPageCount(null);
    setPages([]);
    clearPreviews();
  }

  const base = file ? safeBaseName(file.name) : "page";

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        label="Drag and drop a PDF here"
        hint="One PDF, up to 50 MB — every page becomes an image"
        onFiles={addFiles}
      />
      {file && pageCount !== null && pages.length === 0 && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-700">
            <span className="font-medium">{file.name}</span> — {pageCount} page{pageCount > 1 ? "s" : ""} will become{" "}
            {pageCount} {ext.toUpperCase()} image{pageCount > 1 ? "s" : ""}.
          </p>
          <div className="flex flex-wrap gap-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Resolution</span>
              <select className="input-base" value={scale} onChange={(e) => setScale(Number(e.target.value))}>
                {SCALE_CHOICES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
            {format === "image/jpeg" && (
              <label className="block text-sm">
                <span className="mb-1 block font-medium">JPG quality</span>
                <select className="input-base" value={quality} onChange={(e) => setQuality(Number(e.target.value))}>
                  {QUALITY_CHOICES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <button type="button" className="btn-primary" disabled={busy} onClick={run}>
            {busy
              ? progress
                ? `Rendering page ${progress[0]} of ${progress[1]}…`
                : "Rendering…"
              : `Convert to ${ext.toUpperCase()}`}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {pages.length > 0 && (
        <ResultCard onReset={reset} resetLabel="Convert another PDF">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium text-accent-800">
              {pages.length} image{pages.length > 1 ? "s" : ""} ready.
            </p>
            <button type="button" className="btn-primary px-3 py-1.5" disabled={busy} onClick={downloadAll}>
              {busy ? "Zipping…" : "Download all as ZIP"}
            </button>
          </div>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {pages.map((p, i) => (
              <li key={p.pageNumber} className="flex items-center gap-3 rounded border border-ink-100 p-2 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previews[i]} alt={`Page ${p.pageNumber} preview`} className="h-16 w-12 rounded border border-ink-100 object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">Page {p.pageNumber}</span>
                  <span className="font-mono text-xs text-ink-500">{formatBytes(p.blob.size)}</span>
                </span>
                <button
                  type="button"
                  className="btn-secondary px-3 py-1"
                  onClick={() => downloadBlob(p.blob, `${base}-page-${p.pageNumber}.${ext}`)}
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </ResultCard>
      )}
    </div>
  );
}

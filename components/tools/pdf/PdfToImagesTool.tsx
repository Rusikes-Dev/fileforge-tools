"use client";

import { useState } from "react";
import { useObjectUrlList } from "@/lib/hooks/useObjectUrl";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { ArchiveIcon, DownloadIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import Progress from "@/components/ui/Progress";
import Segmented from "@/components/ui/Segmented";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";
import type { RenderedPage } from "@/lib/converters/pdf-render";

const QUALITY_CHOICES = [
  { label: "High (90%)", value: "0.9" },
  { label: "Medium (75%)", value: "0.75" },
  { label: "Smaller (60%)", value: "0.6" },
];

const SCALE_CHOICES = [
  { label: "Compact · 96 DPI", value: "1.34" },
  { label: "Standard · 144 DPI", value: "2" },
  { label: "High detail · 216 DPI", value: "3" },
];

export default function PdfToImagesTool({ format }: { format: "image/jpeg" | "image/png" }) {
  const ext = format === "image/jpeg" ? "jpg" : "png";
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [quality, setQuality] = useState("0.9");
  const [scale, setScale] = useState("2");
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  // Managed by a hook so the per-page preview URLs are revoked when the result
  // is replaced *and* when the tool unmounts.
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
    clearPreviews();
    try {
      const { renderPdfToImages } = await import("@/lib/converters/pdf-render");
      const rendered = await renderPdfToImages(file, {
        format,
        quality: format === "image/jpeg" ? Number(quality) : undefined,
        scale: Number(scale),
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
    setZipping(true);
    try {
      const { zipRenderedPages } = await import("@/lib/converters/pdf-render");
      const zip = await zipRenderedPages(pages, safeBaseName(file.name), ext);
      downloadBlob(zip, `${safeBaseName(file.name)}-${ext}.zip`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The ZIP could not be created.");
    } finally {
      setZipping(false);
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
        disabled={busy}
      />

      {file && pageCount !== null && pages.length === 0 && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <p className="text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{file.name}</span> —{" "}
            <span className="tabular-nums">{pageCount}</span> page{pageCount > 1 ? "s" : ""} will become{" "}
            {pageCount} {ext.toUpperCase()} image{pageCount > 1 ? "s" : ""}.
          </p>
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Resolution">
              <Segmented label="Resolution" value={scale} onChange={setScale} options={SCALE_CHOICES} disabled={busy} />
            </Field>
            {format === "image/jpeg" && (
              <Field label="JPG quality">
                <Segmented
                  label="JPG quality"
                  value={quality}
                  onChange={setQuality}
                  options={QUALITY_CHOICES}
                  disabled={busy}
                />
              </Field>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ActionButton
              className="btn-primary btn-lg"
              busy={busy}
              busyLabel={progress ? `Rendering page ${progress[0]} of ${progress[1]}…` : "Rendering…"}
              onClick={run}
            >
              Convert to {ext.toUpperCase()}
            </ActionButton>
            {busy && (
              <div className="min-w-[10rem] flex-1">
                <Progress
                  label="Rendering progress"
                  value={progress ? (progress[0] / progress[1]) * 100 : 0}
                  indeterminate={!progress}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <ErrorMessage message={error} />

      {pages.length > 0 && (
        <ResultCard
          onReset={reset}
          resetLabel="Convert another PDF"
          onAdjust={() => {
            setPages([]);
            clearPreviews();
          }}
          adjustLabel="Change settings"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-accent-800">
              {pages.length} image{pages.length > 1 ? "s" : ""} ready.
            </p>
            {pages.length > 1 && (
              <ActionButton className="btn-primary" busy={zipping} busyLabel="Zipping…" onClick={downloadAll}>
                <ArchiveIcon className="h-4 w-4" />
                Download all (.zip)
              </ActionButton>
            )}
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pages.map((p, i) => (
              <li
                key={p.pageNumber}
                className="flex items-center gap-3 rounded-2xl border border-accent-100 bg-surface p-2.5 text-sm transition-shadow hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previews[i]}
                  alt={`Page ${p.pageNumber} preview`}
                  className="h-20 w-14 shrink-0 rounded-lg border border-ink-100 bg-white object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink-900">Page {p.pageNumber}</span>
                  <span className="text-xs tabular-nums text-ink-500">{formatBytes(p.blob.size)}</span>
                </span>
                <button
                  type="button"
                  className="btn-secondary btn-sm shrink-0"
                  aria-label={`Download page ${p.pageNumber}`}
                  onClick={() => downloadBlob(p.blob, `${base}-page-${p.pageNumber}.${ext}`)}
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
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

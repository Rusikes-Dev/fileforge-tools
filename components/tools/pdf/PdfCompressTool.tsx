"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon, InfoIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import Range from "@/components/ui/Range";
import { downloadBlob, formatBytes, percentChange, safeBaseName } from "@/lib/utils";

export default function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(78);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    blob: Blob;
    imagesFound: number;
    imagesCompressed: number;
  } | null>(null);

  async function addFiles(incoming: File[]) {
    setError(null);
    setResult(null);
    const f = incoming[0];
    const { validatePdfFile } = await import("@/lib/converters/pdf");
    const problem = validatePdfFile(f);
    if (problem) return setError(problem);
    setFile(f);
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const { compressPdf } = await import("@/lib/converters/pdf");
      const outcome = await compressPdf(file, quality / 100);
      setResult({
        blob: new Blob([outcome.bytes as BlobPart], { type: "application/pdf" }),
        imagesFound: outcome.imagesFound,
        imagesCompressed: outcome.imagesCompressed,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "This PDF could not be compressed.");
    } finally {
      setBusy(false);
    }
  }

  // "Success" means the file actually got smaller. Compressing zero images, or
  // re-encoding into something bigger, is not a win and shouldn't be dressed up
  // as a green "Done" card with a download button.
  const shrank = Boolean(result && file && result.imagesCompressed > 0 && result.blob.size < file.size);

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        label="Drag and drop a PDF here"
        hint="One PDF, up to 50 MB"
        onFiles={addFiles}
        disabled={busy}
      />

      {file && !result && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <p className="text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{file.name}</span> —{" "}
            <span className="tabular-nums">{formatBytes(file.size)}</span>
          </p>
          <Field
            label="Compression quality"
            htmlFor="pdf-quality"
            value={`${quality}%`}
            hint="Lower quality = smaller file. Only embedded colour images are recompressed; text stays sharp."
          >
            <Range
              id="pdf-quality"
              min={40}
              max={95}
              value={quality}
              onChange={setQuality}
              disabled={busy}
              valueText={`${quality} percent`}
            />
          </Field>
          <ActionButton className="btn-primary btn-lg" busy={busy} busyLabel="Compressing…" onClick={run}>
            Compress PDF
          </ActionButton>
        </div>
      )}

      <ErrorMessage message={error} />

      {result && file && shrank && (
        <ResultCard
          onReset={() => {
            setFile(null);
            setResult(null);
          }}
          resetLabel="Compress another PDF"
          onAdjust={() => setResult(null)}
          adjustLabel="Try a different quality"
        >
          <p className="font-semibold text-accent-800">
            Compressed {result.imagesCompressed} of {result.imagesFound} image
            {result.imagesFound === 1 ? "" : "s"} —{" "}
            <span className="tabular-nums">
              {formatBytes(file.size)} → {formatBytes(result.blob.size)} (
              {percentChange(file.size, result.blob.size)})
            </span>
          </p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => downloadBlob(result.blob, `${safeBaseName(file.name)}-compressed.pdf`)}
          >
            <DownloadIcon className="h-4 w-4" />
            Download compressed PDF
          </button>
        </ResultCard>
      )}

      {result && file && !shrank && (
        <div
          role="status"
          className="animate-pop-in mt-6 rounded-3xl border border-warning-200 bg-warning-50 p-4 sm:p-5"
        >
          <p className="flex items-start gap-2.5 text-sm leading-relaxed text-warning-700">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong className="font-semibold">Nothing to save here.</strong>{" "}
              {result.imagesFound === 0
                ? "No compressible colour images were found in this PDF — it may be text-only or already optimised."
                : result.imagesCompressed === 0
                  ? `Found ${result.imagesFound} image${result.imagesFound === 1 ? "" : "s"}, but none could be safely compressed further — this usually means they're greyscale scans or already efficiently compressed.`
                  : "Re-encoding the images at this quality didn't make the file any smaller. Try a lower quality."}{" "}
              Your original file is unchanged.
            </span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => setResult(null)}>
              Try a lower quality
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
            >
              Choose another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

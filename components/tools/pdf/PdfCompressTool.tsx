"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
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

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        label="Drag and drop a PDF here"
        hint="One PDF, up to 50 MB"
        onFiles={addFiles}
      />
      {file && !result && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-700">
            <span className="font-medium">{file.name}</span> — {formatBytes(file.size)}
          </p>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Compression quality: {quality}%</span>
            <input
              type="range"
              min={40}
              max={95}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-64 max-w-full accent-accent-700"
            />
          </label>
          <button type="button" className="btn-primary" disabled={busy} onClick={run}>
            {busy ? "Compressing…" : "Compress PDF"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && file && (
        <ResultCard
          onReset={() => {
            setFile(null);
            setResult(null);
          }}
          resetLabel="Compress another PDF"
        >
          {result.imagesCompressed > 0 ? (
            <>
              <p className="font-medium text-accent-800">
                Compressed {result.imagesCompressed} of {result.imagesFound} image
                {result.imagesFound === 1 ? "" : "s"} —{" "}
                {formatBytes(file.size)} → {formatBytes(result.blob.size)} (
                {percentChange(file.size, result.blob.size)})
              </p>
              <button
                type="button"
                className="btn-primary mt-3"
                onClick={() => downloadBlob(result.blob, `${safeBaseName(file.name)}-compressed.pdf`)}
              >
                Download compressed PDF
              </button>
            </>
          ) : (
            <p className="text-sm text-ink-700">
              {result.imagesFound > 0
                ? `Found ${result.imagesFound} image${result.imagesFound === 1 ? "" : "s"}, but none could be safely compressed further — this usually means they're grayscale scans or already efficiently compressed.`
                : "No compressible color images were found in this PDF — it may be text-only or already optimized."}
            </p>
          )}
        </ResultCard>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";

const PPTX_MIME = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

export default function PdfToPowerpointTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);

  async function addFiles(incoming: File[]) {
    setError(null);
    setResult(null);
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
    try {
      const { pdfToPptx } = await import("@/lib/converters/pdf-render");
      const blob = await pdfToPptx(file, (done, total) => setProgress([done, total]));
      setResult({
        blob: new Blob([blob], { type: PPTX_MIME }),
        name: `${safeBaseName(file.name)}.pptx`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        label="Drag and drop a PDF here"
        hint="One PDF, up to 50 MB — each page becomes one slide"
        onFiles={addFiles}
      />
      {file && pageCount !== null && !result && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-700">
            <span className="font-medium">{file.name}</span> — {pageCount} page{pageCount > 1 ? "s" : ""} will become{" "}
            {pageCount} slide{pageCount > 1 ? "s" : ""}, each showing the page exactly as it looks in the PDF.
          </p>
          <button type="button" className="btn-primary" disabled={busy} onClick={run}>
            {busy
              ? progress
                ? `Rendering page ${progress[0]} of ${progress[1]}…`
                : "Building presentation…"
              : "Convert to PowerPoint"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard
          onReset={() => { setFile(null); setPageCount(null); setResult(null); }}
          resetLabel="Convert another PDF"
        >
          <p className="font-medium text-accent-800">Your presentation is ready.</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="min-w-0 flex-1 truncate">{result.name}</span>
            <span className="font-mono text-xs text-ink-500">{formatBytes(result.blob.size)}</span>
            <button type="button" className="btn-primary px-3 py-1.5" onClick={() => downloadBlob(result.blob, result.name)}>
              Download .pptx
            </button>
          </div>
        </ResultCard>
      )}
    </div>
  );
}

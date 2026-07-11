"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export default function PdfToWordTool({ variant = "word" }: { variant?: "word" | "gdocs" }) {
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
      const { pdfToDocx } = await import("@/lib/converters/pdf-render");
      const blob = await pdfToDocx(file, (done, total) => setProgress([done, total]));
      setResult({
        blob: new Blob([blob], { type: DOCX_MIME }),
        name: `${safeBaseName(file.name)}.docx`,
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
        hint="One text-based PDF, up to 50 MB"
        onFiles={addFiles}
      />
      {file && pageCount !== null && !result && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-700">
            <span className="font-medium">{file.name}</span> — {pageCount} page{pageCount > 1 ? "s" : ""} of text will be
            extracted into an editable .docx document.
          </p>
          <p className="text-xs text-ink-500">
            Works with text-based PDFs. Scanned PDFs (photos of pages) contain no selectable text and need OCR software instead.
          </p>
          <button type="button" className="btn-primary" disabled={busy} onClick={run}>
            {busy
              ? progress
                ? `Extracting page ${progress[0]} of ${progress[1]}…`
                : "Converting…"
              : "Convert to Word"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard
          onReset={() => { setFile(null); setPageCount(null); setResult(null); }}
          resetLabel="Convert another PDF"
        >
          <p className="font-medium text-accent-800">Your Word document is ready.</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="min-w-0 flex-1 truncate">{result.name}</span>
            <span className="font-mono text-xs text-ink-500">{formatBytes(result.blob.size)}</span>
            <button type="button" className="btn-primary px-3 py-1.5" onClick={() => downloadBlob(result.blob, result.name)}>
              Download .docx
            </button>
          </div>
          {variant === "gdocs" && (
            <p className="mt-3 text-sm text-ink-700">
              To open it in Google Docs: go to Google Drive, upload the .docx file, then double-click it — Docs opens it as a
              fully editable document (or choose File → Save as Google Docs).
            </p>
          )}
        </ResultCard>
      )}
    </div>
  );
}

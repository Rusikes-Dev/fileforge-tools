"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import FileList from "../FileList";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { downloadBlob, formatBytes } from "@/lib/utils";

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  async function addFiles(incoming: File[]) {
    setError(null);
    setResult(null);
    const { validatePdfFile, PDF_COUNT_LIMIT } = await import("@/lib/converters/pdf");
    const next = [...files];
    for (const f of incoming) {
      const problem = validatePdfFile(f);
      if (problem) { setError(problem); continue; }
      if (next.length >= PDF_COUNT_LIMIT) { setError(`You can merge up to ${PDF_COUNT_LIMIT} PDFs at a time.`); break; }
      next.push(f);
    }
    setFiles(next);
  }

  function move(from: number, to: number) {
    const next = [...files];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setFiles(next);
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const { mergePdfs } = await import("@/lib/converters/pdf");
      const bytes = await mergePdfs(files);
      setResult(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merging failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        multiple
        label="Drag and drop PDF files here"
        hint="Up to 20 PDFs, 50 MB each — drag entries to set the merge order"
        onFiles={addFiles}
      />
      <FileList files={files} reorderable onMove={move} onRemove={(i) => setFiles(files.filter((_, x) => x !== i))} />
      {files.length >= 2 && !result && (
        <button type="button" className="btn-primary mt-4" disabled={busy} onClick={run}>
          {busy ? "Merging…" : `Merge ${files.length} PDFs`}
        </button>
      )}
      {files.length === 1 && (
        <p className="mt-3 text-sm text-ink-500">Add at least one more PDF to merge.</p>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard onReset={() => { setFiles([]); setResult(null); }} resetLabel="Merge more PDFs">
          <p className="font-medium text-accent-800">Merged PDF ready — {formatBytes(result.size)}.</p>
          <button type="button" className="btn-primary mt-3" onClick={() => downloadBlob(result, "merged.pdf")}>
            Download merged PDF
          </button>
        </ResultCard>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import FileList from "../FileList";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import { addUniqueFiles, describeAddResult } from "@/lib/files";
import { downloadBlob, formatBytes } from "@/lib/utils";

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  // Every edit to the list (add, remove, reorder, clear) goes through here so a
  // merged PDF can never outlive the order it was built from. Reordering after
  // a merge used to leave the old download button in place.
  function updateFiles(next: File[]) {
    setFiles(next);
    setResult(null);
  }

  async function addFiles(incoming: File[]) {
    const { validatePdfFile, PDF_COUNT_LIMIT } = await import("@/lib/converters/pdf");
    const outcome = addUniqueFiles(files, incoming, { limit: PDF_COUNT_LIMIT, validate: validatePdfFile });
    setError(describeAddResult(outcome, PDF_COUNT_LIMIT));
    updateFiles(outcome.files);
  }

  function move(from: number, to: number) {
    const next = [...files];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateFiles(next);
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
        hint="Up to 20 PDFs, 50 MB each — drag the grip handles (or use the arrows) to set the merge order"
        onFiles={addFiles}
        disabled={busy}
      />
      <FileList
        files={files}
        reorderable
        onMove={move}
        onRemove={(i) => updateFiles(files.filter((_, x) => x !== i))}
        onClear={() => updateFiles([])}
      />

      {files.length >= 2 && !result && (
        <ActionButton className="btn-primary btn-lg mt-5" busy={busy} busyLabel="Merging…" onClick={run}>
          Merge {files.length} PDFs
        </ActionButton>
      )}
      {files.length === 1 && (
        <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-ink-700">
          Add at least one more PDF to merge.
        </p>
      )}

      <ErrorMessage message={error} />

      {result && (
        <ResultCard
          onReset={() => updateFiles([])}
          resetLabel="Merge more PDFs"
          title="Merged and ready"
        >
          <p className="font-semibold text-accent-800">
            Merged PDF ready — <span className="tabular-nums">{formatBytes(result.size)}</span>.
          </p>
          <button type="button" className="btn-primary mt-3" onClick={() => downloadBlob(result, "merged.pdf")}>
            <DownloadIcon className="h-4 w-4" />
            Download merged PDF
          </button>
        </ResultCard>
      )}
    </div>
  );
}

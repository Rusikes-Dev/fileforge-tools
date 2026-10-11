"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon, FileIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Progress from "@/components/ui/Progress";
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
        disabled={busy}
      />

      {file && pageCount !== null && !result && (
        <div className="settings animate-fade-in-up mt-6 space-y-4">
          <p className="text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{file.name}</span> —{" "}
            <span className="tabular-nums">{pageCount}</span> page{pageCount > 1 ? "s" : ""} will become{" "}
            {pageCount} slide{pageCount > 1 ? "s" : ""}, each showing the page exactly as it looks in the PDF.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <ActionButton
              className="btn-primary btn-lg"
              busy={busy}
              busyLabel={progress ? `Rendering page ${progress[0]} of ${progress[1]}…` : "Building presentation…"}
              onClick={run}
            >
              Convert to PowerPoint
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

      {result && (
        <ResultCard
          onReset={() => {
            setFile(null);
            setPageCount(null);
            setResult(null);
          }}
          resetLabel="Convert another PDF"
        >
          <p className="font-semibold text-accent-800">Your presentation is ready.</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-accent-100 bg-surface p-3 text-sm">
            <span aria-hidden className="tile !h-9 !w-9 !rounded-lg">
              <FileIcon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1 basis-40">
              <span className="block truncate font-medium text-ink-900">{result.name}</span>
              <span className="text-xs tabular-nums text-ink-500">{formatBytes(result.blob.size)}</span>
            </span>
            <button
              type="button"
              className="btn-primary btn-sm shrink-0"
              onClick={() => downloadBlob(result.blob, result.name)}
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              Download .pptx
            </button>
          </div>
        </ResultCard>
      )}
    </div>
  );
}

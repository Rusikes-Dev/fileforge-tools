"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import FileList from "../FileList";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { validateImageFile } from "@/lib/converters/image";
import type { Orientation, PageSize } from "@/lib/converters/pdf";
import { downloadBlob, safeBaseName } from "@/lib/utils";

export default function ImagesToPdfTool({ kind }: { kind: "jpg" | "png" }) {
  const acceptMimes = kind === "jpg" ? ["image/jpeg"] : ["image/png"];
  const acceptAttr = kind === "jpg" ? "image/jpeg,.jpg,.jpeg" : "image/png,.png";
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("auto");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState(20);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  function addFiles(incoming: File[]) {
    setError(null);
    setResult(null);
    const next = [...files];
    for (const f of incoming) {
      const problem = validateImageFile(f, acceptMimes);
      if (problem) { setError(problem); continue; }
      if (next.length >= 30) { setError("You can combine up to 30 images into one PDF."); break; }
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
      const { imagesToPdf } = await import("@/lib/converters/pdf");
      const bytes = await imagesToPdf(files, { pageSize, orientation, margin });
      setResult(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The PDF could not be created.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <UploadZone
        accept={acceptAttr}
        multiple
        label={`Drag and drop ${kind.toUpperCase()} files here`}
        hint="Up to 30 images, 25 MB each — each image becomes one page"
        onFiles={addFiles}
      />
      <FileList files={files} reorderable onMove={move} onRemove={(i) => setFiles(files.filter((_, x) => x !== i))} />
      {files.length > 0 && !result && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Page size</span>
              <select className="input-base w-auto" value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)}>
                <option value="auto">Auto (match image)</option>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
            </label>
            {pageSize !== "auto" && (
              <label className="text-sm">
                <span className="mb-1 block font-medium">Orientation</span>
                <select className="input-base w-auto" value={orientation} onChange={(e) => setOrientation(e.target.value as Orientation)}>
                  <option value="auto">Auto</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </label>
            )}
            <label className="text-sm">
              <span className="mb-1 block font-medium">Margin</span>
              <select className="input-base w-auto" value={margin} onChange={(e) => setMargin(Number(e.target.value))}>
                <option value={0}>None</option>
                <option value={20}>Small</option>
                <option value={50}>Large</option>
              </select>
            </label>
          </div>
          <button type="button" className="btn-primary" disabled={busy} onClick={run}>
            {busy ? "Creating PDF…" : "Create PDF"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard onReset={() => { setFiles([]); setResult(null); }} resetLabel="Create another PDF">
          <p className="font-medium text-accent-800">
            Your PDF with {files.length} page{files.length > 1 ? "s" : ""} is ready.
          </p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => downloadBlob(result, `${safeBaseName(files[0]?.name ?? "images")}.pdf`)}
          >
            Download PDF
          </button>
        </ResultCard>
      )}
    </div>
  );
}

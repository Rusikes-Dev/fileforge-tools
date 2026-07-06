"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { parsePageRanges } from "@/lib/converters/ranges";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";

export default function PdfSplitTool({ mode }: { mode: "split" | "extract" }) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parts, setParts] = useState<Array<{ label: string; blob: Blob }>>([]);

  async function addFiles(incoming: File[]) {
    setError(null);
    setParts([]);
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
    if (!file || pageCount === null) return;
    setBusy(true);
    setError(null);
    setParts([]);
    try {
      const parsed = parsePageRanges(ranges, pageCount);
      const base = safeBaseName(file.name);
      if (mode === "split") {
        const { splitPdf } = await import("@/lib/converters/pdf");
        const results = await splitPdf(file, parsed);
        setParts(
          results.map((r) => ({
            label: `${base}-${r.label}.pdf`,
            blob: new Blob([r.bytes as BlobPart], { type: "application/pdf" }),
          }))
        );
      } else {
        const { extractPages } = await import("@/lib/converters/pdf");
        const { rangesToPageIndices } = await import("@/lib/converters/ranges");
        const bytes = await extractPages(file, rangesToPageIndices(parsed));
        setParts([
          { label: `${base}-extracted.pdf`, blob: new Blob([bytes as BlobPart], { type: "application/pdf" }) },
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed.");
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
      {file && pageCount !== null && parts.length === 0 && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-700">
            <span className="font-medium">{file.name}</span> contains {pageCount} page{pageCount > 1 ? "s" : ""}.
          </p>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              {mode === "split" ? "Page ranges (each range becomes a separate PDF)" : "Pages to extract into one PDF"}
            </span>
            <input
              type="text"
              className="input-base max-w-md"
              placeholder="e.g. 1-3, 5, 7-10"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
            />
          </label>
          <button type="button" className="btn-primary" disabled={busy || !ranges.trim()} onClick={run}>
            {busy ? "Processing…" : mode === "split" ? "Split PDF" : "Extract pages"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {parts.length > 0 && (
        <ResultCard onReset={() => { setFile(null); setPageCount(null); setParts([]); setRanges(""); }} resetLabel="Process another PDF">
          <p className="font-medium text-accent-800">
            {parts.length} file{parts.length > 1 ? "s" : ""} ready.
          </p>
          <ul className="mt-2 space-y-2">
            {parts.map((p) => (
              <li key={p.label} className="flex flex-wrap items-center gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate">{p.label}</span>
                <span className="font-mono text-xs text-ink-500">{formatBytes(p.blob.size)}</span>
                <button type="button" className="btn-secondary px-3 py-1" onClick={() => downloadBlob(p.blob, p.label)}>
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

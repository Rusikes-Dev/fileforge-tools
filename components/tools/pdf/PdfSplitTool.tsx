"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { ArchiveIcon, DownloadIcon, FileIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import { zipBlobs } from "@/lib/converters/zip";
import { parsePageRanges } from "@/lib/converters/ranges";
import { toast } from "@/lib/toast";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";

export default function PdfSplitTool({ mode }: { mode: "split" | "extract" }) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);
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
      setRanges("");
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

  async function downloadAll() {
    if (!file) return;
    setZipping(true);
    try {
      const zip = await zipBlobs(parts.map((p) => ({ name: p.label, blob: p.blob })));
      downloadBlob(zip, `${safeBaseName(file.name)}-split.zip`);
    } catch {
      toast("Couldn't build the ZIP — try downloading the files one by one.", "error");
    } finally {
      setZipping(false);
    }
  }

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        label="Drag and drop a PDF here"
        hint="One PDF, up to 50 MB"
        onFiles={addFiles}
        disabled={busy}
      />

      {file && pageCount !== null && parts.length === 0 && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <p className="text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{file.name}</span> contains{" "}
            <span className="tabular-nums">{pageCount}</span> page{pageCount > 1 ? "s" : ""}.
          </p>
          <Field
            label={
              mode === "split"
                ? "Page ranges — each range becomes a separate PDF"
                : "Pages to extract into one PDF"
            }
            htmlFor="pdf-ranges"
            hint="Separate ranges with commas, e.g. 1-3, 5, 7-10"
          >
            <input
              id="pdf-ranges"
              type="text"
              className="input-base max-w-md"
              placeholder="e.g. 1-3, 5, 7-10"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && ranges.trim() && !busy) void run();
              }}
            />
          </Field>
          <ActionButton
            className="btn-primary btn-lg"
            busy={busy}
            busyLabel="Processing…"
            disabled={!ranges.trim()}
            onClick={run}
          >
            {mode === "split" ? "Split PDF" : "Extract pages"}
          </ActionButton>
        </div>
      )}

      <ErrorMessage message={error} />

      {parts.length > 0 && (
        <ResultCard
          onReset={() => {
            setFile(null);
            setPageCount(null);
            setParts([]);
            setRanges("");
          }}
          resetLabel="Process another PDF"
          onAdjust={() => setParts([])}
          adjustLabel="Use different pages"
        >
          <p className="font-semibold text-accent-800">
            {parts.length} file{parts.length > 1 ? "s" : ""} ready.
          </p>
          <ul className="mt-3 divide-y divide-accent-100 overflow-hidden rounded-2xl border border-accent-100 bg-surface">
            {parts.map((p) => (
              <li key={p.label} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 text-sm">
                <span aria-hidden className="tile !h-9 !w-9 !rounded-lg">
                  <FileIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 basis-40">
                  <span className="block truncate font-medium text-ink-900" title={p.label}>
                    {p.label}
                  </span>
                  <span className="block text-xs tabular-nums text-ink-500">{formatBytes(p.blob.size)}</span>
                </span>
                <button
                  type="button"
                  className="btn-secondary btn-sm shrink-0"
                  aria-label={`Download ${p.label}`}
                  onClick={() => downloadBlob(p.blob, p.label)}
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Download
                </button>
              </li>
            ))}
          </ul>
          {parts.length > 1 && (
            <ActionButton className="btn-primary mt-4" busy={zipping} busyLabel="Zipping…" onClick={downloadAll}>
              <ArchiveIcon className="h-4 w-4" />
              Download all (.zip)
            </ActionButton>
          )}
        </ResultCard>
      )}
    </div>
  );
}

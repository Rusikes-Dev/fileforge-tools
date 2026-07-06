"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { parsePageRanges, rangesToPageIndices } from "@/lib/converters/ranges";
import { downloadBlob, safeBaseName } from "@/lib/utils";

export default function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [scope, setScope] = useState<"all" | "pages">("all");
  const [pages, setPages] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  async function addFiles(incoming: File[]) {
    setError(null);
    setResult(null);
    const f = incoming[0];
    const { validatePdfFile, countPages } = await import("@/lib/converters/pdf");
    const problem = validatePdfFile(f);
    if (problem) return setError(problem);
    try {
      setPageCount(await countPages(f));
      setFile(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : "This PDF could not be read.");
    }
  }

  async function run() {
    if (!file || pageCount === null) return;
    setBusy(true);
    setError(null);
    try {
      let indices: number[] | undefined;
      if (scope === "pages") {
        indices = rangesToPageIndices(parsePageRanges(pages, pageCount));
      }
      const { rotatePdf } = await import("@/lib/converters/pdf");
      const bytes = await rotatePdf(file, angle, indices);
      setResult(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rotation failed.");
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
      {file && pageCount !== null && !result && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-700">
            <span className="font-medium">{file.name}</span> — {pageCount} page{pageCount > 1 ? "s" : ""}
          </p>
          <fieldset className="text-sm">
            <legend className="mb-1 font-medium">Rotation</legend>
            <div className="flex flex-wrap gap-2">
              {([[90, "90° clockwise"], [180, "180°"], [270, "90° counter-clockwise"]] as const).map(([v, label]) => (
                <button key={v} type="button" className={angle === v ? "btn-primary" : "btn-secondary"}
                  aria-pressed={angle === v} onClick={() => setAngle(v)}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="text-sm">
            <legend className="mb-1 font-medium">Apply to</legend>
            <label className="mr-4 inline-flex items-center gap-2">
              <input type="radio" name="scope" checked={scope === "all"} onChange={() => setScope("all")} className="accent-accent-700" />
              All pages
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="scope" checked={scope === "pages"} onChange={() => setScope("pages")} className="accent-accent-700" />
              Specific pages
            </label>
            {scope === "pages" && (
              <input type="text" className="input-base mt-2 max-w-md" placeholder="e.g. 2, 5-7" value={pages}
                onChange={(e) => setPages(e.target.value)} aria-label="Pages to rotate" />
            )}
          </fieldset>
          <button type="button" className="btn-primary" disabled={busy || (scope === "pages" && !pages.trim())} onClick={run}>
            {busy ? "Rotating…" : "Rotate PDF"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard onReset={() => { setFile(null); setResult(null); }} resetLabel="Rotate another PDF">
          <p className="font-medium text-accent-800">Rotation applied and saved into the PDF.</p>
          <button type="button" className="btn-primary mt-3"
            onClick={() => file && downloadBlob(result, `${safeBaseName(file.name)}-rotated.pdf`)}>
            Download rotated PDF
          </button>
        </ResultCard>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import type { WatermarkPosition } from "@/lib/converters/pdf";
import { downloadBlob, safeBaseName } from "@/lib/utils";

const POSITIONS: Array<[WatermarkPosition, string]> = [
  ["diagonal", "Diagonal"],
  ["center", "Center"],
  ["top", "Top"],
  ["bottom", "Bottom"],
];

export default function PdfWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [position, setPosition] = useState<WatermarkPosition>("diagonal");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(30);
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
    if (!file || !text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { watermarkPdf } = await import("@/lib/converters/pdf");
      const bytes = await watermarkPdf(file, {
        text: text.trim(),
        fontSize,
        opacity: opacity / 100,
        position,
      });
      setResult(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Adding the watermark failed.");
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
          <div className="text-sm">
            <label htmlFor="wm-text" className="mb-1 block font-medium">Watermark text</label>
            <input id="wm-text" type="text" className="input-base max-w-md" value={text}
              maxLength={80} placeholder="e.g. CONFIDENTIAL or DRAFT"
              onChange={(e) => setText(e.target.value)} />
          </div>
          <fieldset className="text-sm">
            <legend className="mb-1 font-medium">Position</legend>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map(([v, label]) => (
                <button key={v} type="button" className={position === v ? "btn-primary" : "btn-secondary"}
                  aria-pressed={position === v} onClick={() => setPosition(v)}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <label htmlFor="wm-size" className="mb-1 block font-medium">
                Font size: {fontSize} pt
              </label>
              <input id="wm-size" type="range" min={12} max={120} step={2} value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))} className="accent-accent-700" />
            </div>
            <div>
              <label htmlFor="wm-opacity" className="mb-1 block font-medium">
                Opacity: {opacity}%
              </label>
              <input id="wm-opacity" type="range" min={5} max={100} step={5} value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))} className="accent-accent-700" />
            </div>
          </div>
          <button type="button" className="btn-primary" disabled={busy || !text.trim()} onClick={run}>
            {busy ? "Adding watermark…" : "Add watermark"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard onReset={() => { setFile(null); setResult(null); }} resetLabel="Watermark another PDF">
          <p className="font-medium text-accent-800">Watermark added to every page of the PDF.</p>
          <button type="button" className="btn-primary mt-3"
            onClick={() => file && downloadBlob(result, `${safeBaseName(file.name)}-watermarked.pdf`)}>
            Download watermarked PDF
          </button>
        </ResultCard>
      )}
    </div>
  );
}

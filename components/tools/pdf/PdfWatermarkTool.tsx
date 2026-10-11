"use client";

import { useState, type CSSProperties } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import Range from "@/components/ui/Range";
import Segmented from "@/components/ui/Segmented";
import type { WatermarkPosition } from "@/lib/converters/pdf";
import { downloadBlob, safeBaseName } from "@/lib/utils";

const POSITIONS: Array<{ value: WatermarkPosition; label: string }> = [
  { value: "diagonal", label: "Diagonal" },
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
];

// An A4 page is 595pt wide; the preview is drawn at PREVIEW_W px, so one point
// of font size is PREVIEW_W / 595 px in the mock-up.
const PREVIEW_W = 176;
const PREVIEW_K = PREVIEW_W / 595;

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

  const previewText: CSSProperties = {
    fontSize: Math.max(5, fontSize * PREVIEW_K),
    opacity: opacity / 100,
    ...(position === "diagonal"
      ? { top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-45deg)" }
      : position === "center"
        ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
        : position === "top"
          ? { top: "9%", left: "50%", transform: "translateX(-50%)" }
          : { bottom: "9%", left: "50%", transform: "translateX(-50%)" }),
  };

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        label="Drag and drop a PDF here"
        hint="One PDF, up to 50 MB"
        onFiles={addFiles}
        disabled={busy}
      />

      {file && pageCount !== null && !result && (
        <div className="settings animate-fade-in-up mt-6">
          <p className="mb-5 text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{file.name}</span> —{" "}
            <span className="tabular-nums">{pageCount}</span> page{pageCount > 1 ? "s" : ""}
          </p>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="space-y-5">
              <Field label="Watermark text" htmlFor="wm-text">
                <input
                  id="wm-text"
                  type="text"
                  className="input-base max-w-md"
                  value={text}
                  maxLength={80}
                  placeholder="e.g. CONFIDENTIAL or DRAFT"
                  onChange={(e) => setText(e.target.value)}
                />
              </Field>

              <Field label="Position">
                <Segmented
                  label="Watermark position"
                  value={position}
                  onChange={setPosition}
                  options={POSITIONS}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Font size" htmlFor="wm-size" value={`${fontSize} pt`}>
                  <Range
                    id="wm-size"
                    min={12}
                    max={120}
                    step={2}
                    value={fontSize}
                    onChange={setFontSize}
                    valueText={`${fontSize} points`}
                  />
                </Field>
                <Field label="Opacity" htmlFor="wm-opacity" value={`${opacity}%`}>
                  <Range
                    id="wm-opacity"
                    min={5}
                    max={100}
                    step={5}
                    value={opacity}
                    onChange={setOpacity}
                    valueText={`${opacity} percent`}
                  />
                </Field>
              </div>
            </div>

            {/* Live mock-up of page one, so the settings can be judged by eye. */}
            <figure className="mx-auto md:mx-0" aria-hidden>
              <div
                className="relative overflow-hidden rounded-lg border border-ink-100 bg-white shadow-md"
                style={{ width: PREVIEW_W, height: PREVIEW_W * 1.414 }}
              >
                <div className="space-y-1.5 p-3">
                  <div className="h-2 w-2/3 rounded bg-slate-300" />
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="h-1 rounded bg-slate-200" style={{ width: `${88 - (i % 3) * 12}%` }} />
                  ))}
                </div>
                <span
                  className="absolute max-w-full whitespace-nowrap font-bold leading-none text-slate-700"
                  style={previewText}
                >
                  {text.trim() || "Your text"}
                </span>
              </div>
              <figcaption className="mt-2 text-center text-xs text-ink-500">Preview</figcaption>
            </figure>
          </div>

          <ActionButton
            className="btn-primary btn-lg mt-6"
            busy={busy}
            busyLabel="Adding watermark…"
            disabled={!text.trim()}
            onClick={run}
          >
            Add watermark
          </ActionButton>
        </div>
      )}

      <ErrorMessage message={error} />

      {result && (
        <ResultCard
          onReset={() => {
            setFile(null);
            setResult(null);
          }}
          resetLabel="Watermark another PDF"
          onAdjust={() => setResult(null)}
          adjustLabel="Change the watermark"
        >
          <p className="font-semibold text-accent-800">Watermark added to every page of the PDF.</p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => file && downloadBlob(result, `${safeBaseName(file.name)}-watermarked.pdf`)}
          >
            <DownloadIcon className="h-4 w-4" />
            Download watermarked PDF
          </button>
        </ResultCard>
      )}
    </div>
  );
}

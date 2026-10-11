"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon, RefreshIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import NumberField from "@/components/ui/NumberField";
import Switch from "@/components/ui/Switch";
import { imageDimensions, resizeImage, validateImageFile, type ImageMime } from "@/lib/converters/image";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIDE = 20000;

function outputMime(file: File): ImageMime {
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/webp") return "image/webp";
  return "image/jpeg";
}

export default function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [locked, setLocked] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; width: number; height: number } | null>(null);

  async function addFiles(incoming: File[]) {
    const f = incoming[0];
    const problem = validateImageFile(f, ACCEPT);
    if (problem) return setError(problem);
    setError(null);
    setResult(null);
    try {
      const d = await imageDimensions(f);
      setFile(f);
      setDims(d);
      setWidth(d.width);
      setHeight(d.height);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read this image.");
    }
  }

  // NumberField only reports complete, in-range numbers, so these never see the
  // half-typed values ("", "5" on the way to "500") that used to snap the
  // sibling field to nonsense.
  function updateWidth(w: number) {
    setWidth(w);
    if (locked && dims && dims.width > 0) {
      setHeight(Math.min(MAX_SIDE, Math.max(1, Math.round((w * dims.height) / dims.width))));
    }
  }
  function updateHeight(h: number) {
    setHeight(h);
    if (locked && dims && dims.height > 0) {
      setWidth(Math.min(MAX_SIDE, Math.max(1, Math.round((h * dims.width) / dims.height))));
    }
  }
  function applyPercent(pct: number) {
    if (!dims) return;
    setWidth(Math.max(1, Math.round((dims.width * pct) / 100)));
    setHeight(Math.max(1, Math.round((dims.height * pct) / 100)));
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const mime = outputMime(file);
      const blob = await resizeImage(file, { width, height, mime, quality: 0.92 });
      const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
      setResult({ blob, name: `${safeBaseName(file.name)}-${width}x${height}.${ext}`, width, height });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resizing failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <UploadZone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        label="Drag and drop an image here"
        hint="JPG, PNG or WebP, up to 25 MB"
        onFiles={addFiles}
        disabled={busy}
      />

      {file && dims && !result && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <p className="text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{file.name}</span> — currently{" "}
            <span className="tabular-nums">
              {dims.width} × {dims.height} px
            </span>
            , {formatBytes(file.size)}
          </p>

          <div className="flex flex-wrap items-end gap-4">
            <Field label="Width (px)" htmlFor="rs-width" className="w-32">
              <NumberField id="rs-width" min={1} max={MAX_SIDE} value={width} onChange={updateWidth} />
            </Field>
            <span aria-hidden className="pb-3 text-lg text-ink-500">
              ×
            </span>
            <Field label="Height (px)" htmlFor="rs-height" className="w-32">
              <NumberField id="rs-height" min={1} max={MAX_SIDE} value={height} onChange={updateHeight} />
            </Field>
            <div className="pb-2.5">
              <Switch checked={locked} onChange={setLocked}>
                Lock aspect ratio
              </Switch>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-900">Quick scale</span>
            {[25, 50, 75].map((p) => (
              <button key={p} type="button" className="btn-secondary btn-sm" onClick={() => applyPercent(p)}>
                {p}%
              </button>
            ))}
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => applyPercent(100)}
              aria-label="Reset to original size"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              Original
            </button>
          </div>

          <ActionButton className="btn-primary btn-lg" busy={busy} busyLabel="Resizing…" onClick={run}>
            Resize image
          </ActionButton>
        </div>
      )}

      <ErrorMessage message={error} />

      {result && (
        <ResultCard
          onReset={() => {
            setFile(null);
            setResult(null);
            setDims(null);
          }}
          resetLabel="Resize another image"
          onAdjust={() => setResult(null)}
          adjustLabel="Try other dimensions"
        >
          <p className="font-semibold text-accent-800">
            Resized to <span className="tabular-nums">{result.width} × {result.height} px</span> —{" "}
            {formatBytes(result.blob.size)}
          </p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => downloadBlob(result.blob, result.name)}
          >
            <DownloadIcon className="h-4 w-4" />
            Download resized image
          </button>
        </ResultCard>
      )}
    </div>
  );
}

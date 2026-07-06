"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { imageDimensions, resizeImage, validateImageFile, type ImageMime } from "@/lib/converters/image";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

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
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);

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

  function updateWidth(w: number) {
    setWidth(w);
    if (locked && dims && dims.width > 0) setHeight(Math.max(1, Math.round((w * dims.height) / dims.width)));
  }
  function updateHeight(h: number) {
    setHeight(h);
    if (locked && dims && dims.height > 0) setWidth(Math.max(1, Math.round((h * dims.width) / dims.height)));
  }
  function applyPercent(pct: number) {
    if (!dims) return;
    setWidth(Math.max(1, Math.round((dims.width * pct) / 100)));
    setHeight(Math.max(1, Math.round((dims.height * pct) / 100)));
  }

  async function run() {
    if (!file) return;
    if (width < 1 || height < 1 || width > 20000 || height > 20000) {
      return setError("Enter dimensions between 1 and 20000 pixels.");
    }
    setBusy(true);
    setError(null);
    try {
      const mime = outputMime(file);
      const blob = await resizeImage(file, { width, height, mime, quality: 0.92 });
      const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
      setResult({ blob, name: `${safeBaseName(file.name)}-${width}x${height}.${ext}` });
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
      />
      {file && dims && !result && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-700">
            <span className="font-medium">{file.name}</span> — current size {dims.width} × {dims.height} px,{" "}
            {formatBytes(file.size)}
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Width (px)</span>
              <input type="number" min={1} max={20000} className="input-base w-28" value={width}
                onChange={(e) => updateWidth(Number(e.target.value))} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Height (px)</span>
              <input type="number" min={1} max={20000} className="input-base w-28" value={height}
                onChange={(e) => updateHeight(Number(e.target.value))} />
            </label>
            <label className="flex items-center gap-2 pb-2 text-sm">
              <input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)}
                className="accent-accent-700" />
              Lock aspect ratio
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {[25, 50, 75].map((p) => (
              <button key={p} type="button" className="btn-secondary" onClick={() => applyPercent(p)}>
                {p}%
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary" disabled={busy} onClick={run}>
            {busy ? "Resizing…" : "Resize image"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard onReset={() => { setFile(null); setResult(null); setDims(null); }} resetLabel="Resize another image">
          <p className="font-medium text-accent-800">
            Resized to {width} × {height} px — {formatBytes(result.blob.size)}
          </p>
          <button type="button" className="btn-primary mt-3 mr-3" onClick={() => downloadBlob(result.blob, result.name)}>
            Download resized image
          </button>
        </ResultCard>
      )}
    </div>
  );
}

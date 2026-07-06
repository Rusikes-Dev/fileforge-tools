"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { cropImage, imageDimensions, validateImageFile, type ImageMime } from "@/lib/converters/image";
import { downloadBlob, safeBaseName } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

interface Rect { x: number; y: number; width: number; height: number }

export default function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ startX: number; startY: number; origin: Rect; mode: "move" | "resize" } | null>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

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
      // Start with a centered crop at 80% of the image.
      const w = Math.round(d.width * 0.8);
      const h = Math.round(d.height * 0.8);
      setRect({ x: Math.round((d.width - w) / 2), y: Math.round((d.height - h) / 2), width: w, height: h });
      setPreviewUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(f); });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read this image.");
    }
  }

  const scale = useCallback((): number => {
    if (!imgRef.current || !dims) return 1;
    return imgRef.current.clientWidth / dims.width;
  }, [dims]);

  function clampRect(r: Rect): Rect {
    if (!dims) return r;
    const width = Math.max(10, Math.min(r.width, dims.width));
    const height = Math.max(10, Math.min(r.height, dims.height));
    return {
      width,
      height,
      x: Math.max(0, Math.min(r.x, dims.width - width)),
      y: Math.max(0, Math.min(r.y, dims.height - height)),
    };
  }

  function startDrag(e: React.PointerEvent, mode: "move" | "resize") {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, origin: rect, mode };
  }
  function onDrag(e: React.PointerEvent) {
    const s = dragState.current;
    if (!s) return;
    const k = scale();
    const dx = (e.clientX - s.startX) / k;
    const dy = (e.clientY - s.startY) / k;
    if (s.mode === "move") {
      setRect(clampRect({ ...s.origin, x: Math.round(s.origin.x + dx), y: Math.round(s.origin.y + dy) }));
    } else {
      setRect(clampRect({ ...s.origin, width: Math.round(s.origin.width + dx), height: Math.round(s.origin.height + dy) }));
    }
  }
  function endDrag() { dragState.current = null; }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const mime: ImageMime =
        file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      const blob = await cropImage(file, rect, { mime, quality: 0.92 });
      const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
      setResult({ blob, name: `${safeBaseName(file.name)}-cropped.${ext}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cropping failed.");
    } finally {
      setBusy(false);
    }
  }

  const k = scale();

  return (
    <div>
      <UploadZone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        label="Drag and drop an image here"
        hint="JPG, PNG or WebP, up to 25 MB"
        onFiles={addFiles}
      />
      {file && previewUrl && dims && !result && (
        <div className="mt-4 space-y-4">
          <div className="relative inline-block max-w-full touch-none select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={previewUrl} alt={`Crop preview of ${file.name}`} className="block max-w-full rounded border border-ink-100" draggable={false} />
            <div
              role="application"
              aria-label="Crop selection. Drag to move; use the numeric fields below for precise values."
              className="absolute cursor-move border-2 border-accent-600 bg-accent-600/10"
              style={{ left: rect.x * k, top: rect.y * k, width: rect.width * k, height: rect.height * k }}
              onPointerDown={(e) => startDrag(e, "move")}
              onPointerMove={onDrag}
              onPointerUp={endDrag}
            >
              <span
                aria-hidden
                className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-nwse-resize rounded-sm border border-white bg-accent-700"
                onPointerDown={(e) => startDrag(e, "resize")}
                onPointerMove={onDrag}
                onPointerUp={endDrag}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {(["x", "y", "width", "height"] as const).map((field) => (
              <label key={field} className="text-sm">
                <span className="mb-1 block font-medium capitalize">{field} (px)</span>
                <input
                  type="number"
                  min={0}
                  className="input-base w-24"
                  value={rect[field]}
                  onChange={(e) => setRect(clampRect({ ...rect, [field]: Number(e.target.value) }))}
                />
              </label>
            ))}
          </div>
          <button type="button" className="btn-primary" disabled={busy} onClick={run}>
            {busy ? "Cropping…" : "Crop image"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard onReset={() => { setFile(null); setResult(null); }} resetLabel="Crop another image">
          <p className="font-medium text-accent-800">Cropped to {rect.width} × {rect.height} px.</p>
          <button type="button" className="btn-primary mt-3" onClick={() => downloadBlob(result.blob, result.name)}>
            Download cropped image
          </button>
        </ResultCard>
      )}
    </div>
  );
}

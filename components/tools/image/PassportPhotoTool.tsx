"use client";

import { useEffect, useRef, useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { downloadBlob, safeBaseName } from "@/lib/utils";
import { PASSPORT_PRESETS, mmToPx, cropAndExport, buildPrintSheet, type Rect, type SheetSize } from "@/lib/converters/passport-photo";

const BG_COLORS = [
  { label: "Keep original", value: null },
  { label: "White", value: "#ffffff" },
  { label: "Light grey", value: "#e8e8e8" },
  { label: "Light cream", value: "#f2ead9" },
];

export default function PassportPhotoTool() {
  const [presetId, setPresetId] = useState("us");
  const [customW, setCustomW] = useState(35);
  const [customH, setCustomH] = useState(45);
  const preset = PASSPORT_PRESETS.find((p) => p.id === presetId)!;
  const widthMm = presetId === "custom" ? customW : preset.widthMm;
  const heightMm = presetId === "custom" ? customH : preset.heightMm;
  const aspect = widthMm / heightMm;

  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const dragState = useRef<{ startX: number; startY: number; boxX: number; boxY: number } | null>(null);

  const [bgColor, setBgColor] = useState<string | null>(null);
  const [aiRemoving, setAiRemoving] = useState(false);
  const [aiRemovedBlob, setAiRemovedBlob] = useState<Blob | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [sheetSize, setSheetSize] = useState<SheetSize>("4x6in");
  const [sheetBusy, setSheetBusy] = useState(false);

  function centerBox(dispW: number, dispH: number, ratio: number, z: number) {
    let w = dispW, h = dispH;
    if (dispW / dispH > ratio) w = dispH * ratio;
    else h = dispW / ratio;
    w /= z;
    h /= z;
    const x = (dispW - w) / 2;
    const y = (dispH - h) / 2;
    setBox({ x, y, w, h });
  }

  function onImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    setDisplaySize({ w: rect.width, h: rect.height });
    setZoom(1);
    centerBox(rect.width, rect.height, aspect, 1);
  }

  // Recompute the crop box when the aspect ratio (preset/custom size) changes.
  useEffect(() => {
    if (displaySize.w > 0) centerBox(displaySize.w, displaySize.h, aspect, zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect]);

  function onZoomChange(z: number) {
    setZoom(z);
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    let w = displaySize.w, h = displaySize.h;
    if (displaySize.w / displaySize.h > aspect) w = displaySize.h * aspect;
    else h = displaySize.w / aspect;
    w /= z;
    h /= z;
    const x = Math.min(Math.max(cx - w / 2, 0), displaySize.w - w);
    const y = Math.min(Math.max(cy - h / 2, 0), displaySize.h - h);
    setBox({ x, y, w, h });
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, boxX: box.x, boxY: box.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const x = Math.min(Math.max(dragState.current.boxX + dx, 0), Math.max(displaySize.w - box.w, 0));
    const y = Math.min(Math.max(dragState.current.boxY + dy, 0), Math.max(displaySize.h - box.h, 0));
    setBox((b) => ({ ...b, x, y }));
  }
  function onPointerUp() {
    dragState.current = null;
  }

  async function addFiles(incoming: File[]) {
    setError(null);
    setResultUrl(null);
    setAiRemovedBlob(null);
    setBgColor(null);
    const f = incoming[0];
    if (!f.type.startsWith("image/")) return setError(`"${f.name}" doesn't look like an image file.`);
    setFile(f);
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(URL.createObjectURL(f));
  }

  async function runAiBackground() {
    if (!imgRef.current) return;
    setAiRemoving(true);
    setError(null);
    try {
      const outputPx = { w: mmToPx(widthMm, preset.dpi), h: mmToPx(heightMm, preset.dpi) };
      const croppedBlob = await cropAndExport(imgRef.current, box, displaySize, outputPx);
      const { removeImageBackground, flattenOntoColor } = await import("@/lib/converters/background-removal");
      const cutoutFile = new File([croppedBlob], "crop.jpg", { type: "image/jpeg" });
      const cutout = await removeImageBackground(cutoutFile, { model: "medium" });
      const flat = await flattenOntoColor(cutout, bgColor ?? "#ffffff");
      if (!bgColor) setBgColor("#ffffff");
      setAiRemovedBlob(flat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI background replacement failed.");
    } finally {
      setAiRemoving(false);
    }
  }

  async function generate() {
    if (!imgRef.current) return;
    setBusy(true);
    setError(null);
    try {
      const outputPx = { w: mmToPx(widthMm, preset.dpi), h: mmToPx(heightMm, preset.dpi) };
      let blob: Blob;
      if (aiRemovedBlob) {
        const { flattenOntoColor } = await import("@/lib/converters/background-removal");
        blob = bgColor ? await flattenOntoColor(aiRemovedBlob, bgColor) : aiRemovedBlob;
      } else {
        blob = await cropAndExport(imgRef.current, box, displaySize, outputPx);
      }
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultBlob(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate the photo.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadSheet() {
    if (!resultBlob) return;
    setSheetBusy(true);
    try {
      const sheet = await buildPrintSheet(resultBlob, { w: widthMm, h: heightMm }, sheetSize);
      downloadBlob(sheet, `${safeBaseName(file?.name ?? "passport-photo")}-print-sheet.png`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the print sheet.");
    } finally {
      setSheetBusy(false);
    }
  }

  function reset() {
    setFile(null);
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setImgUrl(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultBlob(null);
    setAiRemovedBlob(null);
    setBgColor(null);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Document / country</span>
          <select className="input-base" value={presetId} onChange={(e) => setPresetId(e.target.value)}>
            {PASSPORT_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        {presetId === "custom" ? (
          <div className="flex gap-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Width (mm)</span>
              <input type="number" className="input-base" value={customW} min={10} max={120}
                onChange={(e) => setCustomW(Number(e.target.value) || 1)} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Height (mm)</span>
              <input type="number" className="input-base" value={customH} min={10} max={120}
                onChange={(e) => setCustomH(Number(e.target.value) || 1)} />
            </label>
          </div>
        ) : (
          <div className="text-sm text-ink-600">
            <p><span className="font-medium">Size:</span> {preset.widthMm}×{preset.heightMm} mm</p>
            <p><span className="font-medium">Background:</span> {preset.background}</p>
          </div>
        )}
      </div>
      {preset.note && presetId !== "custom" && (
        <p className="mt-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">{preset.note}</p>
      )}
      <p className="mt-2 text-xs text-ink-500">
        Specifications change over time — always verify current requirements on the official portal before submitting.
      </p>

      {!imgUrl && (
        <div className="mt-4">
          <UploadZone
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            label="Drag and drop your photo here"
            hint="A clear, front-facing photo works best"
            onFiles={addFiles}
          />
        </div>
      )}

      {imgUrl && (
        <div className="mt-4">
          <div
            className="relative mx-auto max-w-[480px] touch-none select-none overflow-hidden rounded border border-ink-200"
            style={{ width: "100%" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imgUrl}
              alt="Uploaded photo"
              className="block w-full"
              onLoad={onImageLoad}
              draggable={false}
            />
            {displaySize.w > 0 && (
              <div
                className="absolute cursor-move border-2 border-accent-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              />
            )}
          </div>
          <label className="mt-3 block max-w-xs text-sm">
            <span className="mb-1 block font-medium">Zoom</span>
            <input type="range" min={1} max={3} step={0.05} value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))} className="w-full" />
          </label>
          <p className="mt-1 text-xs text-ink-500">Drag the frame to position your face inside it.</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Background:</span>
            {BG_COLORS.map((c) => (
              <button
                key={c.label}
                type="button"
                className={`rounded border px-3 py-1 text-sm ${bgColor === c.value && !aiRemoving ? "border-accent-600 bg-accent-100" : "border-ink-200"}`}
                onClick={() => setBgColor(c.value)}
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              className="rounded border border-ink-200 px-3 py-1 text-sm disabled:opacity-50"
              disabled={aiRemoving}
              onClick={runAiBackground}
            >
              {aiRemoving ? "Removing background…" : "Auto-replace with AI"}
            </button>
          </div>
          {aiRemoving && (
            <p className="mt-1 text-xs text-ink-500">First use downloads a one-time AI model (~10-40 MB, cached after).</p>
          )}

          <button type="button" className="btn-primary mt-4" disabled={busy} onClick={generate}>
            {busy ? "Generating…" : "Generate photo"}
          </button>
        </div>
      )}

      <ErrorMessage message={error} />

      {resultUrl && (
        <ResultCard onReset={reset} resetLabel="Start over with a new photo">
          <div className="flex flex-wrap items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Final passport photo" className="h-40 rounded border border-ink-200" />
            <div className="flex-1 space-y-3">
              <p className="font-medium text-accent-800">
                Your {widthMm}×{heightMm} mm photo is ready ({mmToPx(widthMm, preset.dpi)}×{mmToPx(heightMm, preset.dpi)} px, 300 DPI).
              </p>
              <button
                type="button"
                className="btn-secondary px-3 py-1.5"
                onClick={() => resultBlob && downloadBlob(resultBlob, `${safeBaseName(file?.name ?? "passport-photo")}.jpg`)}
              >
                Download photo
              </button>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <select className="input-base" value={sheetSize} onChange={(e) => setSheetSize(e.target.value as SheetSize)}>
                  <option value="4x6in">4×6 in print sheet</option>
                  <option value="a4">A4 print sheet</option>
                </select>
                <button type="button" className="btn-secondary px-3 py-1.5" disabled={sheetBusy} onClick={downloadSheet}>
                  {sheetBusy ? "Building…" : "Download print sheet"}
                </button>
              </div>
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  );
}

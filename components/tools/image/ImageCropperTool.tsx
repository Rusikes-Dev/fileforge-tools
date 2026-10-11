"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useObjectUrl } from "@/lib/hooks/useObjectUrl";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import NumberField from "@/components/ui/NumberField";
import Segmented from "@/components/ui/Segmented";
import { cropImage, imageDimensions, validateImageFile, type ImageMime } from "@/lib/converters/image";
import { downloadBlob, safeBaseName } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const MIN = 10;

interface Rect { x: number; y: number; width: number; height: number }
type Handle = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type RatioKey = "free" | "1:1" | "4:3" | "3:2" | "16:9";

const RATIOS: Record<RatioKey, number | null> = {
  free: null,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
};

const CORNERS: Handle[] = ["nw", "ne", "sw", "se"];
const EDGES: Handle[] = ["n", "s", "e", "w"];

// Where each grab handle sits on the selection box, and its cursor.
const HANDLE_STYLE: Record<Exclude<Handle, "move">, { pos: string; cursor: string }> = {
  nw: { pos: "-left-3.5 -top-3.5", cursor: "cursor-nwse-resize" },
  ne: { pos: "-right-3.5 -top-3.5", cursor: "cursor-nesw-resize" },
  sw: { pos: "-bottom-3.5 -left-3.5", cursor: "cursor-nesw-resize" },
  se: { pos: "-bottom-3.5 -right-3.5", cursor: "cursor-nwse-resize" },
  n: { pos: "-top-3.5 left-1/2 -translate-x-1/2", cursor: "cursor-ns-resize" },
  s: { pos: "-bottom-3.5 left-1/2 -translate-x-1/2", cursor: "cursor-ns-resize" },
  e: { pos: "-right-3.5 top-1/2 -translate-y-1/2", cursor: "cursor-ew-resize" },
  w: { pos: "-left-3.5 top-1/2 -translate-y-1/2", cursor: "cursor-ew-resize" },
};

const HANDLE_LABEL: Record<Exclude<Handle, "move">, string> = {
  nw: "top-left corner", ne: "top-right corner", sw: "bottom-left corner", se: "bottom-right corner",
  n: "top edge", s: "bottom edge", e: "right edge", w: "left edge",
};

export default function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const previewUrl = useObjectUrl(file);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });
  const [ratio, setRatio] = useState<RatioKey>("free");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string; width: number; height: number } | null>(null);
  // Width the preview is actually drawn at. It lives in state (fed by onLoad and
  // a ResizeObserver) because the selection box is positioned from it: reading
  // imgRef.current.clientWidth during render saw a null ref on first paint and
  // drew the box at the image's full pixel size, blowing the layout sideways.
  const [shown, setShown] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ startX: number; startY: number; origin: Rect; handle: Handle } | null>(null);

  const editing = Boolean(file && previewUrl && dims && !result);
  const k = dims && shown > 0 ? shown / dims.width : 0;
  const lockedRatio = RATIOS[ratio];

  useEffect(() => {
    const img = imgRef.current;
    if (!editing || !img || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setShown(img.clientWidth));
    ro.observe(img);
    setShown(img.clientWidth);
    return () => ro.disconnect();
  }, [editing, previewUrl]);

  async function addFiles(incoming: File[]) {
    const f = incoming[0];
    const problem = validateImageFile(f, ACCEPT);
    if (problem) return setError(problem);
    setError(null);
    setResult(null);
    try {
      const d = await imageDimensions(f);
      setShown(0);
      setFile(f);
      setDims(d);
      setRatio("free");
      // Start with a centred crop at 80% of the image.
      const w = Math.round(d.width * 0.8);
      const h = Math.round(d.height * 0.8);
      setRect({ x: Math.round((d.width - w) / 2), y: Math.round((d.height - h) / 2), width: w, height: h });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read this image.");
    }
  }

  function clampRect(r: Rect): Rect {
    if (!dims) return r;
    const width = Math.max(Math.min(MIN, dims.width), Math.min(r.width, dims.width));
    const height = Math.max(Math.min(MIN, dims.height), Math.min(r.height, dims.height));
    return {
      width,
      height,
      x: Math.max(0, Math.min(r.x, dims.width - width)),
      y: Math.max(0, Math.min(r.y, dims.height - height)),
    };
  }

  /** Largest box of `r`'s shape at ratio `ar`, centred on the same point and inside the image. */
  function fitRatio(r: Rect, ar: number): Rect {
    if (!dims) return r;
    let w = r.width;
    let h = w / ar;
    if (h > r.height) {
      h = r.height;
      w = h * ar;
    }
    const cx = r.x + r.width / 2;
    const cy = r.y + r.height / 2;
    const s = Math.min(1, dims.width / w, dims.height / h);
    w = Math.max(MIN, w * s);
    h = Math.max(MIN, h * s);
    return clampRect({
      x: Math.round(cx - w / 2),
      y: Math.round(cy - h / 2),
      width: Math.round(w),
      height: Math.round(h),
    });
  }

  function chooseRatio(next: RatioKey) {
    setRatio(next);
    const ar = RATIOS[next];
    if (ar) setRect((r) => fitRatio(r, ar));
  }

  /* --- Dragging ----------------------------------------------------------- */

  function startDrag(e: PointerEvent, handle: Handle) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, origin: rect, handle };
  }

  function onDrag(e: PointerEvent) {
    const s = drag.current;
    if (!s || !dims || k === 0) return;
    const dx = (e.clientX - s.startX) / k;
    const dy = (e.clientY - s.startY) / k;
    const o = s.origin;

    if (s.handle === "move") {
      setRect(clampRect({ ...o, x: Math.round(o.x + dx), y: Math.round(o.y + dy) }));
      return;
    }

    // Corner handles with a locked aspect ratio resize about the opposite corner.
    if (lockedRatio && s.handle.length === 2) {
      const west = s.handle.includes("w");
      const north = s.handle.includes("n");
      const anchorX = west ? o.x + o.width : o.x;
      const anchorY = north ? o.y + o.height : o.y;
      const roomX = west ? anchorX : dims.width - anchorX;
      const roomY = north ? anchorY : dims.height - anchorY;
      let w = o.width + (west ? -dx : dx);
      w = Math.max(MIN * Math.max(1, lockedRatio), Math.min(w, roomX, roomY * lockedRatio));
      const h = w / lockedRatio;
      setRect({
        x: Math.round(west ? anchorX - w : anchorX),
        y: Math.round(north ? anchorY - h : anchorY),
        width: Math.round(w),
        height: Math.round(h),
      });
      return;
    }

    // Free resize: move only the sides this handle owns.
    let L = o.x;
    let T = o.y;
    let R = o.x + o.width;
    let B = o.y + o.height;
    if (s.handle.includes("w")) L = Math.max(0, Math.min(L + dx, R - MIN));
    if (s.handle.includes("e")) R = Math.min(dims.width, Math.max(R + dx, L + MIN));
    if (s.handle.includes("n")) T = Math.max(0, Math.min(T + dy, B - MIN));
    if (s.handle.includes("s")) B = Math.min(dims.height, Math.max(B + dy, T + MIN));
    setRect({ x: Math.round(L), y: Math.round(T), width: Math.round(R - L), height: Math.round(B - T) });
  }

  function endDrag() {
    drag.current = null;
  }

  /** Arrow keys nudge the box; Alt/Ctrl + arrows resize it. Shift = 10 px steps. */
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 1;
    const dir: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
    };
    const d = dir[e.key];
    if (!d) return;
    e.preventDefault();
    if (e.altKey || e.ctrlKey) {
      const width = rect.width + d[0] * step;
      const height = lockedRatio ? width / lockedRatio : rect.height + d[1] * step;
      setRect(clampRect({ ...rect, width: Math.round(width), height: Math.round(height) }));
    } else {
      setRect(clampRect({ ...rect, x: rect.x + d[0] * step, y: rect.y + d[1] * step }));
    }
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const mime: ImageMime =
        file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      const blob = await cropImage(file, rect, { mime, quality: 0.92 });
      const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
      setResult({ blob, name: `${safeBaseName(file.name)}-cropped.${ext}`, width: rect.width, height: rect.height });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cropping failed.");
    } finally {
      setBusy(false);
    }
  }

  const handles = lockedRatio ? CORNERS : [...CORNERS, ...EDGES];

  return (
    <div>
      <UploadZone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        label="Drag and drop an image here"
        hint="JPG, PNG or WebP, up to 25 MB"
        onFiles={addFiles}
        disabled={busy}
      />

      {editing && file && previewUrl && dims && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Field label="Aspect ratio" className="min-w-0">
              <Segmented
                label="Aspect ratio"
                value={ratio}
                onChange={chooseRatio}
                options={(Object.keys(RATIOS) as RatioKey[]).map((r) => ({
                  value: r,
                  label: r === "free" ? "Free" : r,
                }))}
              />
            </Field>
            <p className="badge-accent tabular-nums" aria-live="off">
              {rect.width} × {rect.height} px
            </p>
          </div>

          {/* overflow-hidden clips the dimming layer; only the selection and
              its handles capture touches, so the page can still be scrolled by
              swiping over the rest of the picture. */}
          <div className="relative mx-auto w-fit max-w-full select-none overflow-hidden rounded-2xl border border-ink-100 bg-ink-50 [&_img]:max-h-[70vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={previewUrl}
              alt={`Crop preview of ${file.name}`}
              onLoad={(e) => setShown(e.currentTarget.clientWidth)}
              className="block h-auto max-w-full"
              draggable={false}
            />
            {k > 0 && (
              <div
                role="group"
                tabIndex={0}
                aria-label={`Crop selection: ${rect.width} by ${rect.height} pixels, starting ${rect.x} across and ${rect.y} down.`}
                aria-describedby="crop-help"
                className="absolute cursor-move touch-none border-2 border-white shadow-[0_0_0_9999px_rgb(0_0_0/0.55)] outline-offset-2 focus-visible:outline-accent-600"
                style={{ left: rect.x * k, top: rect.y * k, width: rect.width * k, height: rect.height * k }}
                onPointerDown={(e) => startDrag(e, "move")}
                onPointerMove={onDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKeyDown}
              >
                {/* Rule-of-thirds guides. */}
                <span aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className="border border-white/35 first:border-t-0" />
                  ))}
                </span>

                {handles.map((h) => {
                  const hh = h as Exclude<Handle, "move">;
                  return (
                    <span
                      key={h}
                      aria-hidden
                      title={`Resize from the ${HANDLE_LABEL[hh]}`}
                      className={`absolute z-10 flex h-7 w-7 touch-none items-center justify-center ${HANDLE_STYLE[hh].pos} ${HANDLE_STYLE[hh].cursor}`}
                      onPointerDown={(e) => startDrag(e, h)}
                      onPointerMove={onDrag}
                      onPointerUp={endDrag}
                      onPointerCancel={endDrag}
                    >
                      <span className="block h-3.5 w-3.5 rounded-[4px] border-2 border-white bg-accent-700 shadow-md" />
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <p id="crop-help" className="hint-text !mt-0">
            Drag the box to move it and the handles to resize. Keyboard: focus the box and use the
            arrow keys to nudge it (hold Shift for 10 px), or Alt + arrows to resize.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="X (px)" htmlFor="crop-x">
              <NumberField
                id="crop-x"
                min={0}
                max={Math.max(0, dims.width - rect.width)}
                value={rect.x}
                onChange={(n) => setRect(clampRect({ ...rect, x: n }))}
              />
            </Field>
            <Field label="Y (px)" htmlFor="crop-y">
              <NumberField
                id="crop-y"
                min={0}
                max={Math.max(0, dims.height - rect.height)}
                value={rect.y}
                onChange={(n) => setRect(clampRect({ ...rect, y: n }))}
              />
            </Field>
            <Field label="Width (px)" htmlFor="crop-w">
              <NumberField
                id="crop-w"
                min={MIN}
                max={dims.width}
                value={rect.width}
                onChange={(n) =>
                  setRect(
                    clampRect({
                      ...rect,
                      width: n,
                      height: lockedRatio ? Math.round(n / lockedRatio) : rect.height,
                    })
                  )
                }
              />
            </Field>
            <Field label="Height (px)" htmlFor="crop-h">
              <NumberField
                id="crop-h"
                min={MIN}
                max={dims.height}
                value={rect.height}
                onChange={(n) =>
                  setRect(
                    clampRect({
                      ...rect,
                      height: n,
                      width: lockedRatio ? Math.round(n * lockedRatio) : rect.width,
                    })
                  )
                }
              />
            </Field>
          </div>

          <ActionButton className="btn-primary btn-lg" busy={busy} busyLabel="Cropping…" onClick={run}>
            Crop image
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
          resetLabel="Crop another image"
          onAdjust={() => setResult(null)}
          adjustLabel="Adjust the crop"
        >
          <p className="font-semibold text-accent-800">
            Cropped to <span className="tabular-nums">{result.width} × {result.height} px</span>.
          </p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => downloadBlob(result.blob, result.name)}
          >
            <DownloadIcon className="h-4 w-4" />
            Download cropped image
          </button>
        </ResultCard>
      )}
    </div>
  );
}

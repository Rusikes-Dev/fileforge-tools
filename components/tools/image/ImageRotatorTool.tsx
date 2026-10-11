"use client";

import { useEffect, useRef, useState } from "react";
import { useObjectUrl } from "@/lib/hooks/useObjectUrl";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon, RefreshIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import { transformImage, validateImageFile, type ImageMime } from "@/lib/converters/image";
import { downloadBlob, safeBaseName } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const STAGE_HEIGHT = 288;
const STAGE_PADDING = 24;

export default function ImageRotatorTool() {
  const [file, setFile] = useState<File | null>(null);
  // Derived from `file`, so the URL is created and revoked in one place and
  // cannot leak when the user swaps images or leaves the page.
  const previewUrl = useObjectUrl(file);
  // Quarter-turns, unbounded: the preview animates the short way round each
  // click (270° → 360° instead of spinning back 270°), while the saved image
  // only needs the value mod 4.
  const [turns, setTurns] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const rotate = ((((turns % 4) + 4) % 4) * 90) as 0 | 90 | 180 | 270;
  const unchanged = rotate === 0 && !flipH && !flipV;

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewUrl]);

  function addFiles(incoming: File[]) {
    const f = incoming[0];
    const problem = validateImageFile(f, ACCEPT);
    if (problem) return setError(problem);
    setError(null);
    setResult(null);
    setTurns(0);
    setFlipH(false);
    setFlipV(false);
    setNatural(null);
    setFile(f);
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const mime: ImageMime =
        file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      const blob = await transformImage(file, { rotate, flipH, flipV, mime, quality: 0.92 });
      const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
      setResult({ blob, name: `${safeBaseName(file.name)}-rotated.${ext}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rotation failed.");
    } finally {
      setBusy(false);
    }
  }

  // A CSS transform doesn't change layout size, so a landscape photo turned 90°
  // used to poke out of its box and get clipped top and bottom. Instead, size a
  // box to the *rotated* footprint, scaled to fit the stage, and centre the
  // untransformed image inside it.
  const sideways = rotate === 90 || rotate === 270;
  const footW = natural ? (sideways ? natural.h : natural.w) : 0;
  const footH = natural ? (sideways ? natural.w : natural.h) : 0;
  const availW = Math.max(0, stageWidth - STAGE_PADDING * 2);
  const availH = STAGE_HEIGHT - STAGE_PADDING * 2;
  const scale = natural && footW > 0 && availW > 0 ? Math.min(1, availW / footW, availH / footH) : 1;

  return (
    <div>
      <UploadZone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        label="Drag and drop an image here"
        hint="JPG, PNG or WebP, up to 25 MB"
        onFiles={addFiles}
        disabled={busy}
      />

      {file && previewUrl && !result && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <div
            ref={stageRef}
            style={{ height: STAGE_HEIGHT }}
            className="bg-grid relative flex items-center justify-center overflow-hidden rounded-2xl border border-ink-100 bg-ink-50"
          >
            <div
              className="relative transition-[width,height] duration-300 ease-out"
              style={{ width: footW * scale || undefined, height: footH * scale || undefined }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`Preview of ${file.name}`}
                onLoad={(e) =>
                  setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
                }
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: natural?.w,
                  height: natural?.h,
                  maxWidth: "none",
                  transform: `translate(-50%, -50%) scale(${scale}) rotate(${turns * 90}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                  transition: "transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)",
                  opacity: natural ? 1 : 0,
                }}
                className="rounded-md shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => setTurns((t) => t - 1)}>
              <RefreshIcon className="h-4 w-4 -scale-x-100" />
              Rotate left
            </button>
            <button type="button" className="btn-secondary" onClick={() => setTurns((t) => t + 1)}>
              <RefreshIcon className="h-4 w-4" />
              Rotate right
            </button>
            <button
              type="button"
              className="btn-secondary"
              aria-pressed={flipH}
              onClick={() => setFlipH(!flipH)}
            >
              Flip horizontal
            </button>
            <button
              type="button"
              className="btn-secondary"
              aria-pressed={flipV}
              onClick={() => setFlipV(!flipV)}
            >
              Flip vertical
            </button>
            {!unchanged && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setTurns(0);
                  setFlipH(false);
                  setFlipV(false);
                }}
              >
                Reset
              </button>
            )}
          </div>

          <ActionButton
            className="btn-primary btn-lg"
            busy={busy}
            busyLabel="Applying…"
            disabled={unchanged}
            onClick={run}
          >
            Apply and prepare download
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
          resetLabel="Rotate another image"
          onAdjust={() => setResult(null)}
          adjustLabel="Keep editing"
        >
          <p className="font-semibold text-accent-800">Rotation applied.</p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => downloadBlob(result.blob, result.name)}
          >
            <DownloadIcon className="h-4 w-4" />
            Download image
          </button>
        </ResultCard>
      )}
    </div>
  );
}

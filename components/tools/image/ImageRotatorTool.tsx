"use client";

import { useState } from "react";
import { useObjectUrl } from "@/lib/hooks/useObjectUrl";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { transformImage, validateImageFile, type ImageMime } from "@/lib/converters/image";
import { downloadBlob, safeBaseName } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export default function ImageRotatorTool() {
  const [file, setFile] = useState<File | null>(null);
  // Derived from `file`, so the URL is created and revoked in one place and
  // cannot leak when the user swaps images or leaves the page.
  const previewUrl = useObjectUrl(file);
  const [rotate, setRotate] = useState<0 | 90 | 180 | 270>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);


  function addFiles(incoming: File[]) {
    const f = incoming[0];
    const problem = validateImageFile(f, ACCEPT);
    if (problem) return setError(problem);
    setError(null);
    setResult(null);
    setRotate(0);
    setFlipH(false);
    setFlipV(false);
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

  const transformCss = `rotate(${rotate}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  return (
    <div>
      <UploadZone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        label="Drag and drop an image here"
        hint="JPG, PNG or WebP, up to 25 MB"
        onFiles={addFiles}
      />
      {file && previewUrl && !result && (
        <div className="mt-4 space-y-4">
          <div className="flex min-h-56 items-center justify-center overflow-hidden rounded border border-ink-100 bg-ink-50 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={`Preview of ${file.name}`}
              className="max-h-72 max-w-full"
              style={{ transform: transformCss }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => setRotate(((rotate + 270) % 360) as 0 | 90 | 180 | 270)}>
              ⟲ Rotate left
            </button>
            <button type="button" className="btn-secondary" onClick={() => setRotate(((rotate + 90) % 360) as 0 | 90 | 180 | 270)}>
              ⟳ Rotate right
            </button>
            <button type="button" className="btn-secondary" onClick={() => setFlipH(!flipH)}>
              Flip horizontal
            </button>
            <button type="button" className="btn-secondary" onClick={() => setFlipV(!flipV)}>
              Flip vertical
            </button>
          </div>
          <button type="button" className="btn-primary" disabled={busy || (rotate === 0 && !flipH && !flipV)} onClick={run}>
            {busy ? "Applying…" : "Apply and prepare download"}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {result && (
        <ResultCard onReset={() => { setFile(null); setResult(null); }} resetLabel="Rotate another image">
          <p className="font-medium text-accent-800">Rotation applied.</p>
          <button type="button" className="btn-primary mt-3" onClick={() => downloadBlob(result.blob, result.name)}>
            Download image
          </button>
        </ResultCard>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { downloadBlob, safeBaseName } from "@/lib/utils";

const PRESET_COLORS = [
  { label: "Transparent (PNG)", value: null },
  { label: "White", value: "#ffffff" },
  { label: "Light grey", value: "#e8e8e8" },
  { label: "Light blue", value: "#bcd6f0" },
  { label: "Black", value: "#000000" },
];

export default function BackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [cutout, setCutout] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<{ url: string; color: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFile(null);
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setSrcUrl(null);
    setCutout(null);
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setError(null);
  }

  async function addFiles(incoming: File[]) {
    setError(null);
    const f = incoming[0];
    const { validatePhotoFile } = await import("@/lib/converters/background-removal");
    const problem = validatePhotoFile(f);
    if (problem) return setError(problem);

    setFile(f);
    setSrcUrl(URL.createObjectURL(f));
    setBusy(true);
    setStatus("Loading the model…");
    try {
      const { removeImageBackground } = await import("@/lib/converters/background-removal");
      const blob = await removeImageBackground(f, {
        model: "medium",
        onProgress: (label, current, total) => {
          if (label.includes("fetch")) setStatus(`Downloading model… ${Math.round((current / total) * 100)}%`);
          else setStatus("Removing background…");
        },
      });
      setCutout(blob);
      setPreview({ url: URL.createObjectURL(blob), color: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Background removal failed.");
    } finally {
      setBusy(false);
      setStatus("");
    }
  }

  async function applyColor(color: string | null) {
    if (!cutout) return;
    if (preview) URL.revokeObjectURL(preview.url);
    if (color === null) {
      setPreview({ url: URL.createObjectURL(cutout), color: null });
      return;
    }
    setBusy(true);
    try {
      const { flattenOntoColor } = await import("@/lib/converters/background-removal");
      const flat = await flattenOntoColor(cutout, color);
      setPreview({ url: URL.createObjectURL(flat), color });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not apply that background color.");
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (!preview || !file) return;
    const res = await fetch(preview.url);
    const blob = await res.blob();
    downloadBlob(blob, `${safeBaseName(file.name)}-no-bg.png`);
  }

  return (
    <div>
      <UploadZone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        label="Drag and drop a photo here"
        hint="One photo, up to 20 MB — works best with a clear, well-lit subject"
        onFiles={addFiles}
      />
      {busy && (
        <p className="mt-3 text-sm text-ink-500" role="status">
          {status || "Processing…"} {file && "(first use downloads a one-time AI model, ~10-40 MB — cached after that)"}
        </p>
      )}
      <ErrorMessage message={error} />
      {preview && (
        <ResultCard onReset={reset} resetLabel="Remove another background">
          <div className="grid gap-4 sm:grid-cols-2">
            {srcUrl && (
              <div>
                <p className="mb-1 text-xs font-medium text-ink-500">Original</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={srcUrl} alt="Original" className="max-h-64 w-full rounded border border-ink-100 object-contain" />
              </div>
            )}
            <div
              className="rounded border border-ink-100"
              style={{
                backgroundImage:
                  preview.color === null
                    ? "conic-gradient(#d9d9d9 90deg, transparent 90deg 180deg, #d9d9d9 180deg 270deg, transparent 270deg)"
                    : undefined,
                backgroundSize: preview.color === null ? "16px 16px" : undefined,
              }}
            >
              <p className="mb-1 px-1 pt-1 text-xs font-medium text-ink-500">Background removed</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt="Background removed" className="max-h-64 w-full object-contain" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Background:</span>
            {PRESET_COLORS.map((c) => (
              <button
                key={c.label}
                type="button"
                className={`rounded border px-3 py-1 text-sm ${
                  preview.color === c.value ? "border-accent-600 bg-accent-100" : "border-ink-200"
                }`}
                onClick={() => applyColor(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary mt-4" onClick={download}>
            Download PNG
          </button>
        </ResultCard>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { downloadBlob, formatBytes, percentChange, safeBaseName } from "@/lib/utils";

const HEIC_SIZE_LIMIT = 30 * 1024 * 1024; // 30 MB
const HEIC_COUNT_LIMIT = 20;

interface Result { name: string; originalSize: number; blob: Blob }

export default function HeicToJpgTool() {
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  async function addFiles(incoming: File[]) {
    setError(null);
    const valid: File[] = [];
    for (const f of incoming.slice(0, HEIC_COUNT_LIMIT)) {
      const isHeic = /\.(heic|heif)$/i.test(f.name) || f.type === "image/heic" || f.type === "image/heif";
      if (!isHeic) { setError(`"${f.name}" is not a HEIC/HEIF file.`); continue; }
      if (f.size > HEIC_SIZE_LIMIT) { setError(`"${f.name}" is larger than the 30 MB limit.`); continue; }
      valid.push(f);
    }
    if (valid.length === 0) return;

    setBusy(true);
    try {
      const { default: heic2any } = await import("heic2any");
      const converted: Result[] = [];
      for (let i = 0; i < valid.length; i++) {
        setProgress(`Converting ${i + 1} of ${valid.length}…`);
        const f = valid[i];
        try {
          const out = await heic2any({ blob: f, toType: "image/jpeg", quality: quality / 100 });
          const blob = Array.isArray(out) ? out[0] : out;
          converted.push({ name: `${safeBaseName(f.name)}.jpg`, originalSize: f.size, blob });
        } catch {
          setError(
            `"${f.name}" could not be converted. It may not be a valid HEIC photo, or it uses a variant this browser can't decode.`
          );
        }
      }
      setResults((prev) => [...prev, ...converted]);
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <div>
      <UploadZone
        accept=".heic,.heif,image/heic,image/heif"
        multiple
        label="Drag and drop HEIC photos here"
        hint="iPhone photos (.heic/.heif), up to 20 files, 30 MB each"
        onFiles={addFiles}
      />
      <label className="mt-4 block text-sm">
        <span className="mb-1 block font-medium">JPG quality: {quality}%</span>
        <input
          type="range"
          min={50}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full max-w-md"
        />
      </label>
      {busy && <p className="mt-3 text-sm text-ink-500" role="status">{progress || "Converting…"}</p>}
      <ErrorMessage message={error} />
      {results.length > 0 && (
        <ResultCard onReset={() => setResults([])} resetLabel="Convert more photos">
          <p className="font-medium text-accent-800">
            {results.length} JPG{results.length > 1 ? "s" : ""} ready.
          </p>
          <ul className="mt-2 space-y-2">
            {results.map((r, i) => (
              <li key={`${r.name}-${i}`} className="flex flex-wrap items-center gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                <span className="font-mono text-xs text-ink-500">
                  {formatBytes(r.originalSize)} → {formatBytes(r.blob.size)} ({percentChange(r.originalSize, r.blob.size)})
                </span>
                <button type="button" className="btn-secondary px-3 py-1" onClick={() => downloadBlob(r.blob, r.name)}>
                  Download
                </button>
              </li>
            ))}
          </ul>
        </ResultCard>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import FileList from "../FileList";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import {
  IMAGE_COUNT_LIMIT,
  convertImage,
  extensionFor,
  validateImageFile,
  type ImageMime,
} from "@/lib/converters/image";
import { downloadBlob, formatBytes, percentChange, safeBaseName } from "@/lib/utils";

interface Result {
  name: string;
  originalSize: number;
  blob: Blob;
}

export default function ImageConverter({
  acceptMimes,
  acceptAttr,
  outputChoices,
  defaultOutput,
  showQuality = true,
  showBackground = false,
  actionLabel,
}: {
  acceptMimes: string[];
  acceptAttr: string;
  outputChoices: ImageMime[];
  defaultOutput: ImageMime;
  showQuality?: boolean;
  showBackground?: boolean;
  actionLabel: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [output, setOutput] = useState<ImageMime>(defaultOutput);
  const [quality, setQuality] = useState(85);
  const [background, setBackground] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [progress, setProgress] = useState("");

  const lossy = output !== "image/png";

  function addFiles(incoming: File[]) {
    setError(null);
    setResults([]);
    const next = [...files];
    for (const file of incoming) {
      const problem = validateImageFile(file, acceptMimes);
      if (problem) {
        setError(problem);
        continue;
      }
      if (next.length >= IMAGE_COUNT_LIMIT) {
        setError(`You can process up to ${IMAGE_COUNT_LIMIT} files at a time.`);
        break;
      }
      next.push(file);
    }
    setFiles(next);
  }

  async function run() {
    setBusy(true);
    setError(null);
    setResults([]);
    const out: Result[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(`Processing ${i + 1} of ${files.length}…`);
        const blob = await convertImage(files[i], {
          mime: output,
          quality: lossy ? quality / 100 : undefined,
          background: showBackground ? background : undefined,
        });
        out.push({
          name: `${safeBaseName(files[i].name)}.${extensionFor(output)}`,
          originalSize: files[i].size,
          blob,
        });
      }
      setResults(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while processing this image.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  function reset() {
    setFiles([]);
    setResults([]);
    setError(null);
  }

  return (
    <div>
      <UploadZone
        accept={acceptAttr}
        multiple
        label="Drag and drop images here"
        hint="Up to 30 files, 25 MB each"
        onFiles={addFiles}
      />
      <FileList files={files} onRemove={(i) => setFiles(files.filter((_, idx) => idx !== i))} />
      {files.length > 0 && results.length === 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            {outputChoices.length > 1 && (
              <label className="text-sm">
                <span className="mb-1 block font-medium">Output format</span>
                <select
                  className="input-base w-auto"
                  value={output}
                  onChange={(e) => setOutput(e.target.value as ImageMime)}
                >
                  {outputChoices.map((c) => (
                    <option key={c} value={c}>
                      {extensionFor(c).toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {showQuality && lossy && (
              <label className="text-sm">
                <span className="mb-1 block font-medium">Quality: {quality}%</span>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-48 accent-accent-700"
                />
              </label>
            )}
            {showBackground && output === "image/jpeg" && (
              <label className="text-sm">
                <span className="mb-1 block font-medium">Background for transparency</span>
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-9 w-16 cursor-pointer rounded border border-ink-300"
                />
              </label>
            )}
          </div>
          <button type="button" className="btn-primary" disabled={busy} onClick={run}>
            {busy ? progress || "Processing…" : actionLabel}
          </button>
        </div>
      )}
      <ErrorMessage message={error} />
      {results.length > 0 && (
        <ResultCard onReset={reset} resetLabel="Convert more files">
          <p className="font-medium text-accent-800">Done — {results.length} file{results.length > 1 ? "s" : ""} ready.</p>
          <ul className="mt-2 space-y-2">
            {results.map((r) => (
              <li key={r.name} className="flex flex-wrap items-center gap-3 text-sm">
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

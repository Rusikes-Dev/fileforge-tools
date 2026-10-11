"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import FileList from "../FileList";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import BatchResults, { type BatchItem } from "../BatchResults";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import Progress from "@/components/ui/Progress";
import Range from "@/components/ui/Range";
import { addUniqueFiles, describeAddResult, uniqueName } from "@/lib/files";
import { safeBaseName } from "@/lib/utils";

const HEIC_SIZE_LIMIT = 30 * 1024 * 1024; // 30 MB
const HEIC_COUNT_LIMIT = 20;

function validateHeic(f: File): string | null {
  const isHeic = /\.(heic|heif)$/i.test(f.name) || f.type === "image/heic" || f.type === "image/heif";
  if (!isHeic) return `"${f.name}" is not a HEIC/HEIF file.`;
  if (f.size > HEIC_SIZE_LIMIT) return `"${f.name}" is larger than the 30 MB limit.`;
  return null;
}

export default function HeicToJpgTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BatchItem[]>([]);

  // Files are only *collected* on drop; conversion waits for the button. It used
  // to start the moment a file landed, using whatever the quality slider said at
  // that instant, with no chance to change it first — and silently ignored
  // anything past the 20th file.
  function addFiles(incoming: File[]) {
    const result = addUniqueFiles(files, incoming, { limit: HEIC_COUNT_LIMIT, validate: validateHeic });
    setError(describeAddResult(result, HEIC_COUNT_LIMIT));
    setFiles(result.files);
    setResults([]);
  }

  async function run() {
    setBusy(true);
    setError(null);
    setResults([]);
    setDone(0);
    const converted: BatchItem[] = [];
    const failed: string[] = [];
    const used = new Map<string, number>();
    try {
      const { default: heic2any } = await import("heic2any");
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        try {
          const out = await heic2any({ blob: f, toType: "image/jpeg", quality: quality / 100 });
          const blob = Array.isArray(out) ? out[0] : out;
          converted.push({
            name: uniqueName(`${safeBaseName(f.name)}.jpg`, used),
            originalSize: f.size,
            blob,
          });
        } catch {
          failed.push(f.name);
        }
        setDone(i + 1);
      }
      setResults(converted);
      if (failed.length > 0) {
        setError(
          `${failed.length === 1 ? `"${failed[0]}"` : `${failed.length} files`} could not be converted. ${
            failed.length === 1 ? "It" : "They"
          } may not be valid HEIC photos, or use a variant this browser can't decode.`
        );
      }
    } catch {
      setError("The HEIC decoder failed to load. Check your connection and try again.");
    } finally {
      setBusy(false);
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
        disabled={busy}
      />
      <FileList
        files={files}
        onRemove={(i) => {
          setFiles(files.filter((_, x) => x !== i));
          setResults([]);
        }}
        onClear={() => {
          setFiles([]);
          setResults([]);
        }}
      />

      {files.length > 0 && results.length === 0 && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <Field label="JPG quality" htmlFor="heic-quality" value={`${quality}%`} hint="90% is a good balance of size and detail.">
            <Range
              id="heic-quality"
              value={quality}
              min={50}
              max={100}
              onChange={setQuality}
              disabled={busy}
              valueText={`${quality} percent`}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-4">
            <ActionButton
              className="btn-primary btn-lg"
              busy={busy}
              busyLabel={`Converting ${Math.min(done + 1, files.length)} of ${files.length}…`}
              onClick={run}
            >
              Convert to JPG
            </ActionButton>
            {busy && (
              <div className="min-w-[10rem] flex-1">
                <Progress value={(done / files.length) * 100} label="Conversion progress" />
              </div>
            )}
          </div>
        </div>
      )}

      <ErrorMessage message={error} />

      {results.length > 0 && (
        <ResultCard
          onReset={() => {
            setFiles([]);
            setResults([]);
            setError(null);
          }}
          resetLabel="Convert more photos"
          onAdjust={() => setResults([])}
          adjustLabel="Change quality"
        >
          <BatchResults results={results} zipName="heic-to-jpg.zip" />
        </ResultCard>
      )}
    </div>
  );
}

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
import Segmented from "@/components/ui/Segmented";
import {
  IMAGE_COUNT_LIMIT,
  convertImage,
  extensionFor,
  validateImageFile,
  type ImageMime,
} from "@/lib/converters/image";
import { addUniqueFiles, describeAddResult, uniqueName } from "@/lib/files";
import { safeBaseName } from "@/lib/utils";

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
  const [results, setResults] = useState<BatchItem[]>([]);
  const [done, setDone] = useState(0);

  const lossy = output !== "image/png";

  // Any edit to the file list makes finished results stale, so drop them.
  function updateFiles(next: File[]) {
    setFiles(next);
    setResults([]);
  }

  function addFiles(incoming: File[]) {
    const result = addUniqueFiles(files, incoming, {
      limit: IMAGE_COUNT_LIMIT,
      validate: (f) => validateImageFile(f, acceptMimes),
    });
    setError(describeAddResult(result, IMAGE_COUNT_LIMIT));
    updateFiles(result.files);
  }

  async function run() {
    setBusy(true);
    setError(null);
    setResults([]);
    setDone(0);
    const out: BatchItem[] = [];
    const used = new Map<string, number>();
    try {
      for (let i = 0; i < files.length; i++) {
        const blob = await convertImage(files[i], {
          mime: output,
          quality: lossy ? quality / 100 : undefined,
          background: showBackground ? background : undefined,
        });
        out.push({
          name: uniqueName(`${safeBaseName(files[i].name)}.${extensionFor(output)}`, used),
          originalSize: files[i].size,
          blob,
        });
        setDone(i + 1);
      }
      setResults(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while processing this image.");
    } finally {
      setBusy(false);
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
        disabled={busy}
      />
      <FileList
        files={files}
        onRemove={(i) => updateFiles(files.filter((_, idx) => idx !== i))}
        onClear={() => updateFiles([])}
      />

      {files.length > 0 && results.length === 0 && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {outputChoices.length > 1 && (
              <Field label="Output format">
                <Segmented
                  label="Output format"
                  value={output}
                  onChange={setOutput}
                  disabled={busy}
                  options={outputChoices.map((c) => ({
                    value: c,
                    label: extensionFor(c).toUpperCase(),
                  }))}
                />
              </Field>
            )}
            {showQuality && lossy && (
              <Field label="Quality" htmlFor="img-quality" value={`${quality}%`} hint="Lower = smaller file">
                <Range
                  id="img-quality"
                  value={quality}
                  min={30}
                  max={100}
                  onChange={setQuality}
                  disabled={busy}
                  valueText={`${quality} percent`}
                />
              </Field>
            )}
            {showBackground && output === "image/jpeg" && (
              <Field
                label="Background for transparency"
                htmlFor="img-bg"
                hint="JPG can't be transparent, so see-through areas get this colour."
              >
                <input
                  id="img-bg"
                  type="color"
                  value={background}
                  disabled={busy}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-10 w-20"
                />
              </Field>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ActionButton
              className="btn-primary btn-lg"
              busy={busy}
              busyLabel={`Processing ${Math.min(done + 1, files.length)} of ${files.length}…`}
              onClick={run}
            >
              {actionLabel}
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
          onReset={reset}
          resetLabel="Start over with new files"
          onAdjust={() => setResults([])}
          adjustLabel="Change settings"
          title="All done"
        >
          <BatchResults results={results} zipName="converted-images.zip" />
        </ResultCard>
      )}
    </div>
  );
}

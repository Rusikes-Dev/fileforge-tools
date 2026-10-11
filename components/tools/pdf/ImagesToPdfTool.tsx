"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import FileList from "../FileList";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import Segmented from "@/components/ui/Segmented";
import { validateImageFile } from "@/lib/converters/image";
import type { Orientation, PageSize } from "@/lib/converters/pdf";
import { addUniqueFiles, describeAddResult } from "@/lib/files";
import { downloadBlob, safeBaseName } from "@/lib/utils";

const LIMIT = 30;

export default function ImagesToPdfTool({ kind }: { kind: "jpg" | "png" }) {
  const acceptMimes = kind === "jpg" ? ["image/jpeg"] : ["image/png"];
  const acceptAttr = kind === "jpg" ? "image/jpeg,.jpg,.jpeg" : "image/png,.png";
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("auto");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState<"0" | "20" | "50">("20");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The PDF remembers how many pages it was built with, so the message can
  // never disagree with the file list (it used to read "0 page is ready").
  const [result, setResult] = useState<{ blob: Blob; pages: number; name: string } | null>(null);

  // Any change to the list invalidates a finished PDF.
  function updateFiles(next: File[]) {
    setFiles(next);
    setResult(null);
  }

  function addFiles(incoming: File[]) {
    const outcome = addUniqueFiles(files, incoming, {
      limit: LIMIT,
      validate: (f) => validateImageFile(f, acceptMimes),
    });
    setError(describeAddResult(outcome, LIMIT));
    updateFiles(outcome.files);
  }

  function move(from: number, to: number) {
    const next = [...files];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    updateFiles(next);
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const { imagesToPdf } = await import("@/lib/converters/pdf");
      const bytes = await imagesToPdf(files, { pageSize, orientation, margin: Number(margin) });
      setResult({
        blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
        pages: files.length,
        name: `${safeBaseName(files[0]?.name ?? "images")}.pdf`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The PDF could not be created.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <UploadZone
        accept={acceptAttr}
        multiple
        label={`Drag and drop ${kind.toUpperCase()} files here`}
        hint="Up to 30 images, 25 MB each — each image becomes one page"
        onFiles={addFiles}
        disabled={busy}
      />
      <FileList
        files={files}
        reorderable
        onMove={move}
        onRemove={(i) => updateFiles(files.filter((_, x) => x !== i))}
        onClear={() => updateFiles([])}
      />

      {files.length > 0 && !result && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Page size">
              <Segmented
                label="Page size"
                value={pageSize}
                onChange={setPageSize}
                options={[
                  { value: "auto", label: "Match image" },
                  { value: "a4", label: "A4" },
                  { value: "letter", label: "Letter" },
                ]}
              />
            </Field>
            {pageSize !== "auto" && (
              <Field label="Orientation">
                <Segmented
                  label="Orientation"
                  value={orientation}
                  onChange={setOrientation}
                  options={[
                    { value: "auto", label: "Auto" },
                    { value: "portrait", label: "Portrait" },
                    { value: "landscape", label: "Landscape" },
                  ]}
                />
              </Field>
            )}
            <Field label="Margin">
              <Segmented
                label="Margin"
                value={margin}
                onChange={setMargin}
                options={[
                  { value: "0", label: "None" },
                  { value: "20", label: "Small" },
                  { value: "50", label: "Large" },
                ]}
              />
            </Field>
          </div>
          <ActionButton className="btn-primary btn-lg" busy={busy} busyLabel="Creating PDF…" onClick={run}>
            Create PDF
          </ActionButton>
        </div>
      )}

      <ErrorMessage message={error} />

      {result && (
        <ResultCard
          onReset={() => updateFiles([])}
          resetLabel="Create another PDF"
          onAdjust={() => setResult(null)}
          adjustLabel="Change layout"
        >
          <p className="font-semibold text-accent-800">
            Your PDF with {result.pages} page{result.pages === 1 ? "" : "s"} is ready.
          </p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => downloadBlob(result.blob, result.name)}
          >
            <DownloadIcon className="h-4 w-4" />
            Download PDF
          </button>
        </ResultCard>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { DownloadIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import Field from "@/components/ui/Field";
import Segmented from "@/components/ui/Segmented";
import { parsePageRanges, rangesToPageIndices } from "@/lib/converters/ranges";
import { downloadBlob, safeBaseName } from "@/lib/utils";

type Angle = "90" | "180" | "270";

export default function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [angle, setAngle] = useState<Angle>("90");
  const [scope, setScope] = useState<"all" | "pages">("all");
  const [pages, setPages] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  async function addFiles(incoming: File[]) {
    setError(null);
    setResult(null);
    const f = incoming[0];
    const { validatePdfFile, countPages } = await import("@/lib/converters/pdf");
    const problem = validatePdfFile(f);
    if (problem) return setError(problem);
    try {
      setPageCount(await countPages(f));
      setFile(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : "This PDF could not be read.");
    }
  }

  async function run() {
    if (!file || pageCount === null) return;
    setBusy(true);
    setError(null);
    try {
      let indices: number[] | undefined;
      if (scope === "pages") {
        indices = rangesToPageIndices(parsePageRanges(pages, pageCount));
      }
      const { rotatePdf } = await import("@/lib/converters/pdf");
      const bytes = await rotatePdf(file, Number(angle) as 90 | 180 | 270, indices);
      setResult(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rotation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        label="Drag and drop a PDF here"
        hint="One PDF, up to 50 MB"
        onFiles={addFiles}
        disabled={busy}
      />

      {file && pageCount !== null && !result && (
        <div className="settings animate-fade-in-up mt-6 space-y-5">
          <p className="text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{file.name}</span> —{" "}
            <span className="tabular-nums">{pageCount}</span> page{pageCount > 1 ? "s" : ""}
          </p>

          <Field label="Rotation">
            <Segmented
              label="Rotation"
              value={angle}
              onChange={setAngle}
              options={[
                { value: "90", label: "90° clockwise" },
                { value: "180", label: "180°" },
                { value: "270", label: "90° counter-clockwise" },
              ]}
            />
          </Field>

          <Field label="Apply to">
            <Segmented
              label="Apply rotation to"
              value={scope}
              onChange={setScope}
              options={[
                { value: "all", label: "All pages" },
                { value: "pages", label: "Specific pages" },
              ]}
            />
            {scope === "pages" && (
              <input
                type="text"
                className="input-base mt-3 max-w-md"
                placeholder="e.g. 2, 5-7"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                aria-label="Pages to rotate"
              />
            )}
          </Field>

          <ActionButton
            className="btn-primary btn-lg"
            busy={busy}
            busyLabel="Rotating…"
            disabled={scope === "pages" && !pages.trim()}
            onClick={run}
          >
            Rotate PDF
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
          resetLabel="Rotate another PDF"
          onAdjust={() => setResult(null)}
          adjustLabel="Change rotation"
        >
          <p className="font-semibold text-accent-800">Rotation applied and saved into the PDF.</p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => file && downloadBlob(result, `${safeBaseName(file.name)}-rotated.pdf`)}
          >
            <DownloadIcon className="h-4 w-4" />
            Download rotated PDF
          </button>
        </ResultCard>
      )}
    </div>
  );
}

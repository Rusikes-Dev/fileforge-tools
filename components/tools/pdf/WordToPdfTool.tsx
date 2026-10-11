"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import BatchResults, { type BatchItem } from "../BatchResults";
import Progress from "@/components/ui/Progress";
import { LoaderDots } from "@/components/ui/ActionButton";
import { addUniqueFiles, uniqueName } from "@/lib/files";
import { safeBaseName } from "@/lib/utils";

const LIMIT = 30;

export default function WordToPdfTool() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BatchItem[]>([]);
  // Names already used by earlier batches, so two "report.docx" files converted
  // in different drops still produce distinct downloads.
  const [used] = useState(() => new Map<string, number>());

  async function addFiles(incoming: File[]) {
    setError(null);
    setBusy(true);
    const problems: string[] = [];
    try {
      const { validateDocxFile, docxToPdf } = await import("@/lib/converters/docx-to-pdf");
      const accepted = addUniqueFiles([], incoming, { limit: LIMIT, validate: validateDocxFile });
      problems.push(...accepted.issues);
      if (accepted.overLimit > 0) problems.push(`Only ${LIMIT} files can be converted at a time.`);

      const converted: BatchItem[] = [];
      for (let i = 0; i < accepted.files.length; i++) {
        const f = accepted.files[i];
        setProgress([i + 1, accepted.files.length]);
        try {
          const bytes = await docxToPdf(f);
          converted.push({
            name: uniqueName(`${safeBaseName(f.name)}.pdf`, used),
            originalSize: f.size,
            blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
          });
        } catch (err) {
          problems.push(err instanceof Error ? err.message : `"${f.name}" could not be converted.`);
        }
      }
      setResults((prev) => [...prev, ...converted]);
    } finally {
      // Every problem is kept — a later file's error used to overwrite the
      // earlier ones, hiding which documents had failed.
      setError(problems.length > 0 ? problems.join(" ") : null);
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <UploadZone
        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx"
        multiple
        label="Drag and drop .docx files here"
        hint="Word documents up to 25 MB each — converted instantly in your browser"
        onFiles={addFiles}
        disabled={busy}
      />

      {busy && (
        <div className="animate-fade-in mt-5 flex flex-wrap items-center gap-4" role="status">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
            <LoaderDots className="text-accent-700" />
            {progress ? `Converting ${progress[0]} of ${progress[1]}…` : "Converting…"}
          </span>
          <div className="min-w-[10rem] flex-1">
            <Progress
              label="Conversion progress"
              value={progress ? ((progress[0] - 1) / progress[1]) * 100 : 0}
              indeterminate={!progress}
            />
          </div>
        </div>
      )}

      <ErrorMessage message={error} />

      {results.length > 0 && (
        <ResultCard
          onReset={() => {
            setResults([]);
            setError(null);
          }}
          resetLabel="Clear and convert more"
        >
          <BatchResults results={results} zipName="word-to-pdf.zip" showDelta={false} />
          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            Text, headings, bold/italic and lists are preserved. Images and complex layouts aren&apos;t carried
            over, and non-Latin scripts aren&apos;t supported yet.
          </p>
        </ResultCard>
      )}
    </div>
  );
}

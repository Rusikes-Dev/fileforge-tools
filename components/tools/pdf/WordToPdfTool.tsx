"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import { downloadBlob, formatBytes, safeBaseName } from "@/lib/utils";

export default function WordToPdfTool() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Array<{ name: string; blob: Blob }>>([]);

  async function addFiles(incoming: File[]) {
    setError(null);
    setBusy(true);
    const { validateDocxFile, docxToPdf } = await import("@/lib/converters/docx-to-pdf");
    const converted: Array<{ name: string; blob: Blob }> = [];
    for (const f of incoming) {
      const problem = validateDocxFile(f);
      if (problem) { setError(problem); continue; }
      try {
        const bytes = await docxToPdf(f);
        converted.push({
          name: `${safeBaseName(f.name)}.pdf`,
          blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : `"${f.name}" could not be converted.`);
      }
    }
    setResults((prev) => [...prev, ...converted]);
    setBusy(false);
  }

  return (
    <div>
      <UploadZone
        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx"
        multiple
        label="Drag and drop .docx files here"
        hint="Word documents up to 25 MB each — converted instantly in your browser"
        onFiles={addFiles}
      />
      {busy && <p className="mt-3 text-sm text-ink-500" role="status">Converting…</p>}
      <ErrorMessage message={error} />
      {results.length > 0 && (
        <ResultCard onReset={() => setResults([])} resetLabel="Convert more documents">
          <p className="font-medium text-accent-800">
            {results.length} PDF{results.length > 1 ? "s" : ""} ready.
          </p>
          <ul className="mt-2 space-y-2">
            {results.map((r, i) => (
              <li key={`${r.name}-${i}`} className="flex flex-wrap items-center gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                <span className="font-mono text-xs text-ink-500">{formatBytes(r.blob.size)}</span>
                <button type="button" className="btn-secondary px-3 py-1" onClick={() => downloadBlob(r.blob, r.name)}>
                  Download
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-500">
            Text, headings, bold/italic and lists are preserved. Images and complex layouts aren&apos;t carried over, and
            non-Latin scripts aren&apos;t supported yet.
          </p>
        </ResultCard>
      )}
    </div>
  );
}

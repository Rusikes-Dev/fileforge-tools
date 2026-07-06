"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import { formatBytes } from "@/lib/utils";

interface Entry { name: string; size: number; pages: number }

export default function PdfPageCounterTool() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addFiles(incoming: File[]) {
    setError(null);
    setBusy(true);
    const { validatePdfFile, countPages } = await import("@/lib/converters/pdf");
    const added: Entry[] = [];
    for (const f of incoming) {
      const problem = validatePdfFile(f);
      if (problem) { setError(problem); continue; }
      try {
        added.push({ name: f.name, size: f.size, pages: await countPages(f) });
      } catch (err) {
        setError(err instanceof Error ? err.message : `"${f.name}" could not be read.`);
      }
    }
    setEntries((prev) => [...prev, ...added]);
    setBusy(false);
  }

  const total = entries.reduce((sum, e) => sum + e.pages, 0);

  return (
    <div>
      <UploadZone
        accept="application/pdf,.pdf"
        multiple
        label="Drag and drop PDF files here"
        hint="Add as many PDFs as you like — counts appear instantly"
        onFiles={addFiles}
      />
      {busy && <p className="mt-3 text-sm text-ink-500" role="status">Counting…</p>}
      <ErrorMessage message={error} />
      {entries.length > 0 && (
        <div className="mt-4 rounded border border-ink-100" role="status">
          <ul className="divide-y divide-ink-100">
            {entries.map((e, i) => (
              <li key={`${e.name}-${i}`} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate">{e.name}</span>
                <span className="font-mono text-xs text-ink-500">{formatBytes(e.size)}</span>
                <span className="font-semibold">{e.pages} page{e.pages !== 1 ? "s" : ""}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50 px-3 py-2.5 text-sm">
            <span className="font-medium">Total across {entries.length} file{entries.length !== 1 ? "s" : ""}</span>
            <span className="font-semibold">{total} pages</span>
          </div>
        </div>
      )}
      {entries.length > 0 && (
        <button type="button" className="btn-secondary mt-3" onClick={() => setEntries([])}>
          Clear list
        </button>
      )}
    </div>
  );
}

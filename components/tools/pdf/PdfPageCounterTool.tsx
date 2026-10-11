"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import { LoaderDots } from "@/components/ui/ActionButton";
import { fileKey } from "@/lib/files";
import { formatBytes } from "@/lib/utils";

interface Entry { key: string; name: string; size: number; pages: number }

export default function PdfPageCounterTool() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addFiles(incoming: File[]) {
    setBusy(true);
    const problems: string[] = [];
    const seen = new Set(entries.map((e) => e.key));
    const added: Entry[] = [];
    try {
      const { validatePdfFile, countPages } = await import("@/lib/converters/pdf");
      for (const f of incoming) {
        const key = fileKey(f);
        // Counting the same file twice just inflates the total.
        if (seen.has(key)) {
          problems.push(`"${f.name}" is already in the list.`);
          continue;
        }
        const problem = validatePdfFile(f);
        if (problem) {
          problems.push(problem);
          continue;
        }
        try {
          added.push({ key, name: f.name, size: f.size, pages: await countPages(f) });
          seen.add(key);
        } catch (err) {
          problems.push(err instanceof Error ? err.message : `"${f.name}" could not be read.`);
        }
      }
      setEntries((prev) => [...prev, ...added]);
    } finally {
      setError(problems.length > 0 ? problems.join(" ") : null);
      setBusy(false);
    }
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
        disabled={busy}
      />

      {busy && (
        <p className="animate-fade-in mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink-700" role="status">
          <LoaderDots className="text-accent-700" />
          Counting…
        </p>
      )}

      <ErrorMessage message={error} />

      {entries.length > 0 && (
        <div className="animate-fade-in-up mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-surface shadow-sm">
          <ul className="divide-y divide-ink-100">
            {entries.map((e) => (
              <li key={e.key} className="flex items-center gap-3 px-4 py-3 text-sm">
                <span className="min-w-0 flex-1 truncate font-medium text-ink-900" title={e.name}>
                  {e.name}
                </span>
                <span className="hidden text-xs tabular-nums text-ink-500 sm:inline">{formatBytes(e.size)}</span>
                <span className="badge-accent shrink-0 tabular-nums">
                  {e.pages} page{e.pages !== 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3 border-t border-ink-100 bg-accent-50 px-4 py-3.5 text-sm">
            <span className="font-semibold text-accent-800">
              Total across {entries.length} file{entries.length !== 1 ? "s" : ""}
            </span>
            {/* Announced politely, and only here — not on every row. */}
            <span role="status" className="text-lg font-extrabold tabular-nums text-accent-800">
              {total} pages
            </span>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <button type="button" className="btn-secondary mt-4" onClick={() => setEntries([])}>
          Clear list
        </button>
      )}
    </div>
  );
}

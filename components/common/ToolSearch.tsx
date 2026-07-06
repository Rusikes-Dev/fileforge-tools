"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/tools/registry";

const categoryLabels: Record<string, string> = {
  "image-tools": "Image",
  "pdf-tools": "PDF",
  "text-tools": "Text",
  "developer-tools": "Developer",
};

export default function ToolSearch({
  index,
  large = false,
  autoFocus = false,
}: {
  index: SearchEntry[];
  large?: boolean;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return index
      .map((entry) => {
        const matches = terms.every((t) => entry.haystack.includes(t));
        if (!matches) return null;
        // Rank name matches above alias-only matches.
        const nameHit = terms.every((t) => entry.name.toLowerCase().includes(t));
        return { entry, score: nameHit ? 0 : 1 };
      })
      .filter((r): r is { entry: SearchEntry; score: number } => r !== null)
      .sort((a, b) => a.score - b.score || a.entry.name.localeCompare(b.entry.name))
      .slice(0, 8)
      .map((r) => r.entry);
  }, [query, index]);

  return (
    <div className="relative w-full">
      <label htmlFor="tool-search" className="sr-only">
        Search tools
      </label>
      <input
        id="tool-search"
        type="search"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls="tool-search-results"
        autoComplete="off"
        autoFocus={autoFocus}
        className={`input-base ${large ? "py-3 text-base" : ""}`}
        placeholder="Search tools, for example JPG to PDF"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim() && (
        <ul
          id="tool-search-results"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded border border-ink-100 bg-white shadow-md"
        >
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-ink-500">
              No tools match “{query}”. Try a format name like “png” or an action like “merge”.
            </li>
          )}
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/${r.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-ink-50"
              >
                <span className="font-medium text-ink-900">{r.shortName}</span>
                <span className="text-xs text-ink-500">{categoryLabels[r.category]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

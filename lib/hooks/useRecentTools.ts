"use client";

import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

const KEY = "ff:recent-tools";
const LIMIT = 6;

/**
 * Tracks recently opened tools, stored only in this browser. Nothing is sent
 * anywhere — the same privacy promise the tools themselves make.
 */
export function useRecentTools() {
  const [slugs, setSlugs, ready] = useLocalStorage<string[]>(KEY, []);

  const record = useCallback(
    (slug: string) => {
      setSlugs((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, LIMIT));
    },
    [setSlugs]
  );

  const clear = useCallback(() => setSlugs([]), [setSlugs]);

  return { slugs, record, clear, ready };
}

/** Records a visit to `slug` once on mount. */
export function useRecordToolVisit(slug: string) {
  const { record } = useRecentTools();
  useEffect(() => {
    record(slug);
  }, [slug, record]);
}

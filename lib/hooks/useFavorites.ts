"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const KEY = "ff:favorites";

/** Starred tools, stored only in this browser. */
export function useFavorites() {
  const [slugs, setSlugs, ready] = useLocalStorage<string[]>(KEY, []);

  const toggle = useCallback(
    (slug: string) => {
      setSlugs((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]
      );
    },
    [setSlugs]
  );

  const isFavorite = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, toggle, isFavorite, ready };
}

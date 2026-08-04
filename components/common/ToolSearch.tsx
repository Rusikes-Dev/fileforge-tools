"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/tools/registry";
import { CategoryIcon, SearchIcon } from "./Icon";

const categoryLabels: Record<string, string> = {
  "image-tools": "Image",
  "pdf-tools": "PDF",
  "text-tools": "Text",
  "developer-tools": "Developer",
};

const MAX_RESULTS = 8;

/**
 * Ranks a tool against the query. Lower is better.
 *
 * The original implementation only checked `includes` on a combined haystack,
 * so searching "pdf" ranked "Add Watermark to PDF" identically to "Merge PDF".
 * Scoring by where the match lands puts exact and prefix matches first.
 */
function score(entry: SearchEntry, terms: string[], raw: string): number | null {
  if (!terms.every((t) => entry.haystack.includes(t))) return null;

  const name = entry.shortName.toLowerCase();
  const full = entry.name.toLowerCase();

  if (name === raw) return 0;
  if (name.startsWith(raw)) return 1;
  if (full.startsWith(raw)) return 2;
  if (name.includes(raw)) return 3;
  if (full.includes(raw)) return 4;
  // Every term matched, but only via aliases or the slug.
  return 5;
}

export default function ToolSearch({
  index,
  large = false,
  autoFocus = false,
  placeholder = "Search tools — try “JPG to PDF” or “merge”",
  onNavigate,
}: {
  index: SearchEntry[];
  large?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  onNavigate?: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const optionId = (i: number) => `${listboxId}-opt-${i}`;

  const results = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return [];
    const terms = raw.split(/\s+/);
    return index
      .map((entry) => ({ entry, s: score(entry, terms, raw) }))
      .filter((r): r is { entry: SearchEntry; s: number } => r.s !== null)
      .sort((a, b) => a.s - b.s || a.entry.shortName.localeCompare(b.entry.shortName))
      .slice(0, MAX_RESULTS)
      .map((r) => r.entry);
  }, [query, index]);

  // Reset the highlight whenever the result set changes, otherwise the active
  // index can point past the end of a newly narrowed list.
  useEffect(() => setActiveIndex(0), [query]);

  const expanded = open && query.trim().length > 0;

  const close = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (slug: string) => {
      close();
      onNavigate?.();
      router.push(`/${slug}`);
    },
    [close, onNavigate, router]
  );

  // Dismiss on outside click. Without this the panel stays open over the page
  // after the user's attention has moved elsewhere.
  useEffect(() => {
    if (!expanded) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [expanded, close]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      if (query) {
        setQuery("");
      } else {
        close();
        inputRef.current?.blur();
      }
      return;
    }

    if (!expanded || results.length === 0) {
      if (e.key === "ArrowDown" && query.trim()) setOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(results.length - 1);
        break;
      case "Enter": {
        const target = results[activeIndex];
        if (target) {
          e.preventDefault();
          go(target.slug);
        }
        break;
      }
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <label htmlFor="tool-search" className="sr-only">
        Search tools
      </label>

      <div className="relative">
        <SearchIcon
          className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 ${
            large ? "h-[18px] w-[18px]" : "h-4 w-4"
          }`}
        />
        <input
          ref={inputRef}
          id="tool-search"
          type="search"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            expanded && results.length > 0 ? optionId(activeIndex) : undefined
          }
          autoComplete="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus -- only set on the
          // dedicated search page and in the command palette, where focusing
          // the field is the entire purpose of the view.
          autoFocus={autoFocus}
          className={`input-base pl-10 ${large ? "py-3.5 text-base" : ""}`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>

      {expanded && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="animate-scale-in absolute z-30 mt-2 w-full origin-top overflow-hidden rounded-xl border border-ink-100 bg-surface p-1 shadow-lg"
        >
          {results.length === 0 && (
            <li role="option" aria-selected={false} className="px-3 py-6 text-center">
              <p className="text-sm font-medium text-ink-900">No tools match “{query.trim()}”</p>
              <p className="mt-1 text-xs text-ink-500">
                Try a format like “png”, or an action like “merge”.
              </p>
            </li>
          )}

          {results.map((r, i) => (
            <li key={r.slug} role="none">
              <Link
                id={optionId(i)}
                role="option"
                aria-selected={i === activeIndex}
                href={`/${r.slug}`}
                onClick={() => {
                  close();
                  onNavigate?.();
                }}
                // Pointer-driven highlight is kept in sync with the keyboard
                // highlight so there is only ever one active row.
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  i === activeIndex ? "bg-ink-50" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                    i === activeIndex
                      ? "border-accent-100 bg-accent-50 text-accent-700"
                      : "border-ink-100 bg-surface text-ink-500"
                  }`}
                >
                  <CategoryIcon category={r.category} className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-ink-900">
                  {r.shortName}
                </span>
                <span className="shrink-0 text-xs text-ink-500">
                  {categoryLabels[r.category]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

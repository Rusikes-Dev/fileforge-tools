/** Pure text-processing functions shared by the text tools and tests. */

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function countCharacters(text: string): { withSpaces: number; withoutSpaces: number } {
  // Count user-perceived characters (code points), not UTF-16 units.
  const chars = Array.from(text);
  return {
    withSpaces: chars.length,
    withoutSpaces: chars.filter((c) => !/\s/.test(c)).length,
  };
}

export function countSentences(text: string): number {
  const matches = text.match(/[^.!?…]+[.!?…]+["')\]]*/g);
  if (matches) return matches.length;
  return text.trim() ? 1 : 0;
}

export function countParagraphs(text: string): number {
  return text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;
}

export function countLines(text: string): number {
  if (!text) return 0;
  return text.split("\n").length;
}

export type CaseMode = "upper" | "lower" | "title" | "sentence";

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.toLowerCase().replace(/(^|[\s\-("'])(\p{L})/gu, (_, pre, ch) => pre + ch.toUpperCase());
    case "sentence": {
      const lower = text.toLowerCase();
      return lower.replace(/(^\s*\p{L})|([.!?…]\s+\p{L})/gu, (m) => m.toUpperCase());
    }
  }
}

export interface DedupeOptions {
  caseInsensitive?: boolean;
  trim?: boolean;
}

export function removeDuplicateLines(
  text: string,
  opts: DedupeOptions = {}
): { result: string; removed: number } {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const kept: string[] = [];
  for (const line of lines) {
    let key = line;
    if (opts.trim) key = key.trim();
    if (opts.caseInsensitive) key = key.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      kept.push(line);
    }
  }
  return { result: kept.join("\n"), removed: lines.length - kept.length };
}

export type SortMode = "az" | "za" | "natural" | "length";

export function sortLines(text: string, mode: SortMode, caseInsensitive = false): string {
  const lines = text.split("\n");
  const collator = new Intl.Collator(undefined, {
    numeric: mode === "natural",
    sensitivity: caseInsensitive ? "accent" : "variant",
  });
  const sorted = [...lines].sort((a, b) =>
    mode === "length" ? a.length - b.length || collator.compare(a, b) : collator.compare(a, b)
  );
  if (mode === "za") sorted.reverse();
  return sorted.join("\n");
}

export interface CleanOptions {
  collapseSpaces?: boolean;
  trimLines?: boolean;
  removeBlankLines?: boolean;
  collapseBlankLines?: boolean;
}

export function cleanWhitespace(text: string, opts: CleanOptions): string {
  let lines = text.split("\n");
  if (opts.collapseSpaces) {
    lines = lines.map((l) => l.replace(/[ \t\u00A0]+/g, " "));
  }
  if (opts.trimLines) {
    lines = lines.map((l) => l.trim());
  }
  if (opts.removeBlankLines) {
    lines = lines.filter((l) => l.trim().length > 0);
  } else if (opts.collapseBlankLines) {
    const out: string[] = [];
    let prevBlank = false;
    for (const l of lines) {
      const blank = l.trim().length === 0;
      if (blank && prevBlank) continue;
      out.push(l);
      prevBlank = blank;
    }
    lines = out;
  }
  return lines.join("\n");
}

export interface ReplaceOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  regex?: boolean;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildSearchRegex(find: string, opts: ReplaceOptions): RegExp {
  let source = opts.regex ? find : escapeRegExp(find);
  if (opts.wholeWord && !opts.regex) source = `\\b${source}\\b`;
  return new RegExp(source, opts.caseSensitive ? "g" : "gi");
}

export function countMatches(text: string, find: string, opts: ReplaceOptions): number {
  if (!find) return 0;
  const re = buildSearchRegex(find, opts);
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    count++;
    if (m.index === re.lastIndex) re.lastIndex++; // avoid infinite loop on empty match
  }
  return count;
}

export function replaceAll(text: string, find: string, replacement: string, opts: ReplaceOptions): string {
  if (!find) return text;
  return text.replace(buildSearchRegex(find, opts), replacement);
}

const STOP_WORDS = new Set(
  "the a an and or but of to in on for with at by from as is are was were be been it its this that these those i you he she we they not no so if then than there here".split(" ")
);

export function wordFrequency(text: string, top = 10): Array<{ word: string; count: number }> {
  const words = text.toLowerCase().match(/\p{L}[\p{L}'’-]*/gu) ?? [];
  const freq = new Map<string, number>();
  for (const w of words) {
    if (STOP_WORDS.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, top)
    .map(([word, count]) => ({ word, count }));
}

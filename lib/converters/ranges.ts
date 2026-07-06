/** Page-range parsing shared by Split PDF, Extract PDF Pages and Rotate PDF. */

export interface PageRange {
  start: number;
  end: number;
}

/**
 * Parse input like "1-3, 5, 7-10" into validated ranges.
 * Pages are 1-based. Throws Error with a human-readable message on invalid input.
 */
export function parsePageRanges(input: string, totalPages: number): PageRange[] {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Enter at least one page or range, for example: 1-3, 5.");
  const parts = trimmed.split(",").map((p) => p.trim());
  const ranges: PageRange[] = [];
  for (const part of parts) {
    if (!part) continue;
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) {
      throw new Error(`"${part}" is not a valid page or range. Use numbers like 5 or ranges like 7-10.`);
    }
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end < 1) throw new Error("Page numbers start at 1.");
    if (start > end) {
      throw new Error(`Range ${start}-${end} is reversed. The first number must not be larger than the second.`);
    }
    if (end > totalPages) {
      throw new Error(
        `Page range ${start === end ? start : `${start}-${end}`} is invalid because this PDF contains ${totalPages} page${totalPages === 1 ? "" : "s"}.`
      );
    }
    ranges.push({ start, end });
  }
  if (ranges.length === 0) throw new Error("Enter at least one page or range, for example: 1-3, 5.");
  return ranges;
}

/** Flatten ranges into an ordered list of 0-based page indices (order preserved, duplicates allowed across ranges removed). */
export function rangesToPageIndices(ranges: PageRange[]): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const r of ranges) {
    for (let p = r.start; p <= r.end; p++) {
      const idx = p - 1;
      if (!seen.has(idx)) {
        seen.add(idx);
        out.push(idx);
      }
    }
  }
  return out;
}

export function formatRangeLabel(r: PageRange): string {
  return r.start === r.end ? `page ${r.start}` : `pages ${r.start}-${r.end}`;
}

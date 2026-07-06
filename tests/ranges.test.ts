import { describe, expect, it } from "vitest";
import { formatRangeLabel, parsePageRanges, rangesToPageIndices } from "@/lib/converters/ranges";

describe("parsePageRanges", () => {
  it("parses single pages and ranges", () => {
    expect(parsePageRanges("1-3, 5, 7-10", 12)).toEqual([
      { start: 1, end: 3 },
      { start: 5, end: 5 },
      { start: 7, end: 10 },
    ]);
  });

  it("tolerates extra whitespace", () => {
    expect(parsePageRanges("  2 -  4 ,6 ", 10)).toEqual([
      { start: 2, end: 4 },
      { start: 6, end: 6 },
    ]);
  });

  it("rejects empty input", () => {
    expect(() => parsePageRanges("   ", 10)).toThrow(/at least one page/i);
  });

  it("rejects garbage tokens with the token in the message", () => {
    expect(() => parsePageRanges("1-3, abc", 10)).toThrow(/"abc" is not a valid page/);
  });

  it("rejects reversed ranges", () => {
    expect(() => parsePageRanges("9-3", 10)).toThrow(/reversed/i);
  });

  it("rejects out-of-bounds ranges with the page count in the message", () => {
    expect(() => parsePageRanges("20-30", 12)).toThrow(
      "Page range 20-30 is invalid because this PDF contains 12 pages"
    );
  });

  it("rejects page 0", () => {
    expect(() => parsePageRanges("0-3", 10)).toThrow(/start at 1/i);
  });
});

describe("rangesToPageIndices", () => {
  it("flattens to 0-based indices and dedupes overlaps", () => {
    expect(rangesToPageIndices([{ start: 1, end: 3 }, { start: 3, end: 4 }])).toEqual([0, 1, 2, 3]);
  });
});

describe("formatRangeLabel", () => {
  it("labels single pages and ranges", () => {
    expect(formatRangeLabel({ start: 4, end: 4 })).toBe("page 4");
    expect(formatRangeLabel({ start: 2, end: 6 })).toBe("pages 2-6");
  });
});

import { describe, expect, it } from "vitest";
import {
  cleanWhitespace,
  convertCase,
  countCharacters,
  countSentences,
  countWords,
  removeDuplicateLines,
  replaceAll,
  countMatches,
  sortLines,
  wordFrequency,
} from "@/lib/converters/text";

describe("counters", () => {
  it("counts words", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("  hello   world  ")).toBe(2);
    expect(countWords("one\ntwo\tthree")).toBe(3);
  });

  it("counts characters with and without spaces", () => {
    expect(countCharacters("a b")).toEqual({ withSpaces: 3, withoutSpaces: 2 });
    // Emoji counted as one character (code point), not two UTF-16 units.
    expect(countCharacters("👍").withSpaces).toBe(1);
  });

  it("counts sentences", () => {
    expect(countSentences("One. Two! Three?")).toBe(3);
    expect(countSentences("No terminator")).toBe(1);
    expect(countSentences("")).toBe(0);
  });
});

describe("convertCase", () => {
  it("handles the four modes", () => {
    expect(convertCase("hello world", "upper")).toBe("HELLO WORLD");
    expect(convertCase("HeLLo", "lower")).toBe("hello");
    expect(convertCase("war and peace", "title")).toBe("War And Peace");
    expect(convertCase("first. second sentence. THIRD.", "sentence")).toBe(
      "First. Second sentence. Third."
    );
  });
});

describe("removeDuplicateLines", () => {
  it("keeps first occurrence and reports removals", () => {
    expect(removeDuplicateLines("a\nb\na")).toEqual({ result: "a\nb", removed: 1 });
  });

  it("supports case-insensitive and trimmed comparison", () => {
    expect(removeDuplicateLines("A\na", { caseInsensitive: true }).removed).toBe(1);
    expect(removeDuplicateLines("a \na", { trim: true }).removed).toBe(1);
  });
});

describe("sortLines", () => {
  it("sorts naturally when requested", () => {
    expect(sortLines("file10\nfile2\nfile1", "natural")).toBe("file1\nfile2\nfile10");
  });

  it("sorts descending and by length", () => {
    expect(sortLines("a\nc\nb", "za")).toBe("c\nb\na");
    expect(sortLines("ccc\na\nbb", "length")).toBe("a\nbb\nccc");
  });
});

describe("cleanWhitespace", () => {
  it("collapses spaces, trims and collapses blank lines", () => {
    const input = "a   b  \n\n\n c ";
    expect(
      cleanWhitespace(input, { collapseSpaces: true, trimLines: true, collapseBlankLines: true })
    ).toBe("a b\n\nc");
  });

  it("removes all blank lines when asked", () => {
    expect(cleanWhitespace("a\n\nb", { removeBlankLines: true })).toBe("a\nb");
  });
});

describe("find and replace", () => {
  it("counts and replaces case-insensitively by default", () => {
    expect(countMatches("Cat cat CAT", "cat", {})).toBe(3);
    expect(replaceAll("Cat cat", "cat", "dog", {})).toBe("dog dog");
  });

  it("supports whole word matching", () => {
    expect(countMatches("cat category", "cat", { wholeWord: true })).toBe(1);
  });

  it("supports regex with capture groups", () => {
    expect(replaceAll("2026-07-06", "(\\d+)-(\\d+)-(\\d+)", "$3/$2/$1", { regex: true })).toBe(
      "06/07/2026"
    );
  });
});

describe("wordFrequency", () => {
  it("ignores stop words and ranks by count", () => {
    const freq = wordFrequency("the apple and the apple and banana");
    expect(freq[0]).toEqual({ word: "apple", count: 2 });
    expect(freq.find((f) => f.word === "the")).toBeUndefined();
  });
});

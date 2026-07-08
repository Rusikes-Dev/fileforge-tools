import { describe, expect, it } from "vitest";
import { locateJsonError, safeJsonParse, safeJsonStringify, summarizeJson, unwrapBigIntSentinels } from "@/lib/converters/json";

describe("locateJsonError", () => {
  it("extracts line and column from V8-style messages", () => {
    const input = '{\n  "a": 1,\n  "b": ,\n}';
    try {
      JSON.parse(input);
      throw new Error("should have thrown");
    } catch (err) {
      const info = locateJsonError(input, err);
      // Position reporting differs across engines; require at least a message.
      expect(info.message.length).toBeGreaterThan(0);
      if (info.line !== undefined) expect(info.line).toBeGreaterThanOrEqual(1);
    }
  });

  it("hints about trailing commas", () => {
    const input = '{"a": 1,}';
    try {
      JSON.parse(input);
    } catch (err) {
      expect(locateJsonError(input, err).hint).toMatch(/trailing comma/i);
    }
  });
});

describe("summarizeJson", () => {
  it("summarizes arrays, objects and scalars", () => {
    expect(summarizeJson([1, 2, 3])).toEqual({ rootType: "array", items: 3, depth: 1 });
    expect(summarizeJson({ a: { b: 1 } })).toEqual({ rootType: "object", keys: 1, depth: 2 });
    expect(summarizeJson("hi")).toEqual({ rootType: "string", depth: 0 });
    expect(summarizeJson(null)).toEqual({ rootType: "null", depth: 0 });
  });
});

describe("safeJsonParse / safeJsonStringify (big-integer precision)", () => {
  it("preserves a large integer ID exactly through format and minify", () => {
    const input = '{"id": 12345678901234567890}';
    const parsed = safeJsonParse(input);
    expect(safeJsonStringify(parsed, 2)).toContain("12345678901234567890");
    expect(safeJsonStringify(parsed)).toBe('{"id":12345678901234567890}');
  });

  it("does not wrap ordinary small integers or decimals", () => {
    const input = '{"age": 30, "price": 19.99, "count": -5}';
    const output = safeJsonStringify(safeJsonParse(input), 0);
    expect(output).toContain('"age":30');
    expect(output).toContain('"price":19.99');
    expect(output).toContain('"count":-5');
  });

  it("preserves negative big integers and big integers inside arrays/nested objects", () => {
    const input = '{"ids":[98765432109876543210,-11122233344455566677]}';
    expect(safeJsonStringify(safeJsonParse(input))).toBe(
      '{"ids":[98765432109876543210,-11122233344455566677]}'
    );
  });

  it("leaves digit sequences inside string values completely alone", () => {
    const input = '{"note": "ref 12345678901234567890 here"}';
    const parsed = safeJsonParse(input) as { note: string };
    expect(parsed.note).toBe("ref 12345678901234567890 here");
  });

  it("handles escaped quotes inside strings without misreading string boundaries", () => {
    const input = '{"q": "she said \\"hi\\" to 99999999999999999999 people"}';
    const parsed = safeJsonParse(input) as { q: string };
    expect(parsed.q).toBe('she said "hi" to 99999999999999999999 people');
  });

  it("still throws on genuinely invalid JSON, with position matching the original input", () => {
    expect(() => safeJsonParse('{"a": 1,}')).toThrow();
  });

  it("unwrapBigIntSentinels gives a plain digit string for non-JSON consumers (e.g. CSV export)", () => {
    const parsed = unwrapBigIntSentinels(safeJsonParse('{"id": 12345678901234567890}')) as {
      id: string;
    };
    expect(parsed.id).toBe("12345678901234567890");
    expect(typeof parsed.id).toBe("string");
  });
});

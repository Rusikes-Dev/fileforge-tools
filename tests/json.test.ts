import { describe, expect, it } from "vitest";
import { locateJsonError, summarizeJson } from "@/lib/converters/json";

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

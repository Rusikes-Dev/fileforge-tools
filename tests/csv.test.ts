import { describe, expect, it } from "vitest";
import { csvToJson, jsonToCsv, parseCsv } from "@/lib/converters/csv";

describe("parseCsv", () => {
  it("parses simple rows", () => {
    expect(parseCsv("a,b\n1,2")).toEqual([["a", "b"], ["1", "2"]]);
  });

  it("handles quoted fields with commas, quotes and newlines", () => {
    expect(parseCsv('a,b\n"x,y","he said ""hi""\nnext"')).toEqual([
      ["a", "b"],
      ["x,y", 'he said "hi"\nnext'],
    ]);
  });

  it("normalizes CRLF line endings", () => {
    expect(parseCsv("a,b\r\n1,2\r\n")).toEqual([["a", "b"], ["1", "2"]]);
  });

  it("throws on unclosed quotes", () => {
    expect(() => parseCsv('a\n"unclosed')).toThrow(/unclosed quote/i);
  });
});

describe("csvToJson", () => {
  it("maps header row to keys", () => {
    expect(csvToJson("name,age\nJane,30")).toEqual([{ name: "Jane", age: "30" }]);
  });

  it("detects numbers when enabled, preserving leading zeros as strings", () => {
    expect(csvToJson("id,zip\n7,01234", { detectNumbers: true })).toEqual([{ id: 7, zip: "01234" }]);
  });

  it("fills missing cells with empty strings", () => {
    expect(csvToJson("a,b\n1")).toEqual([{ a: "1", b: "" }]);
  });

  it("rejects empty header names", () => {
    expect(() => csvToJson("a,,c\n1,2,3")).toThrow(/empty column name/i);
  });
});

describe("jsonToCsv", () => {
  it("unions keys across objects and escapes values", () => {
    const csv = jsonToCsv([{ a: 1 }, { a: 'x,"y', b: "line\nbreak" }]);
    expect(csv.split("\n")[0]).toBe("a,b");
    expect(csv).toContain('"x,""y"');
    expect(csv).toContain('"line\nbreak"');
  });

  it("round-trips with csvToJson", () => {
    const data = [{ name: "Jane, Q.", note: 'said "hi"' }];
    expect(csvToJson(jsonToCsv(data))).toEqual(data);
  });

  it("rejects non-object items with the item number", () => {
    expect(() => jsonToCsv([1, 2])).toThrow(/Item 1 is not an object/);
  });

  it("serializes nested values as JSON strings", () => {
    expect(jsonToCsv([{ tags: ["a", "b"] }])).toBe('tags\n"[""a"",""b""]"');
  });
});

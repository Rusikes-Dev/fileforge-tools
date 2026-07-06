import { describe, expect, it } from "vitest";
import { estimateEntropyBits, generatePassword, generateUuids } from "@/lib/converters/generators";

describe("generateUuids", () => {
  it("produces valid v4 UUIDs", () => {
    const [id] = generateUuids(1);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("respects count and formatting options", () => {
    const ids = generateUuids(5, { uppercase: true, noHyphens: true });
    expect(ids).toHaveLength(5);
    ids.forEach((id) => expect(id).toMatch(/^[0-9A-F]{32}$/));
    expect(new Set(ids).size).toBe(5);
  });
});

describe("generatePassword", () => {
  const base = { length: 20, lowercase: true, uppercase: true, digits: true, symbols: true, excludeAmbiguous: false };

  it("respects length", () => {
    expect(generatePassword(base)).toHaveLength(20);
  });

  it("includes at least one character from each enabled set", () => {
    for (let i = 0; i < 20; i++) {
      const pw = generatePassword(base);
      expect(pw).toMatch(/[a-z]/);
      expect(pw).toMatch(/[A-Z]/);
      expect(pw).toMatch(/[0-9]/);
      expect(pw).toMatch(/[^a-zA-Z0-9]/);
    }
  });

  it("excludes ambiguous characters when asked", () => {
    for (let i = 0; i < 20; i++) {
      const pw = generatePassword({ ...base, excludeAmbiguous: true });
      expect(pw).not.toMatch(/[l1IO0o]/);
    }
  });

  it("throws when no set is selected", () => {
    expect(() =>
      generatePassword({ ...base, lowercase: false, uppercase: false, digits: false, symbols: false })
    ).toThrow(/at least one/i);
  });
});

describe("estimateEntropyBits", () => {
  it("grows with length and pool size", () => {
    const small = estimateEntropyBits({ length: 8, lowercase: true, uppercase: false, digits: false, symbols: false, excludeAmbiguous: false });
    const large = estimateEntropyBits({ length: 16, lowercase: true, uppercase: true, digits: true, symbols: true, excludeAmbiguous: false });
    expect(large).toBeGreaterThan(small);
  });
});

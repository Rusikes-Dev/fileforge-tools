import { describe, expect, it } from "vitest";
import { addUniqueFiles, describeAddResult, fileKey, uniqueName } from "@/lib/files";
import { zipBlobs } from "@/lib/converters/zip";

const mk = (name: string, body = "x", lastModified = 1) =>
  new File([body], name, { type: "image/png", lastModified });

const acceptAll = () => null;

describe("fileKey", () => {
  it("is stable for the same file and differs by name, size or mtime", () => {
    expect(fileKey(mk("a.png"))).toBe(fileKey(mk("a.png")));
    expect(fileKey(mk("a.png"))).not.toBe(fileKey(mk("b.png")));
    expect(fileKey(mk("a.png", "xx"))).not.toBe(fileKey(mk("a.png", "x")));
    expect(fileKey(mk("a.png", "x", 2))).not.toBe(fileKey(mk("a.png", "x", 1)));
  });
});

describe("addUniqueFiles", () => {
  it("appends new files after the existing ones", () => {
    const r = addUniqueFiles([mk("a.png")], [mk("b.png")], { limit: 5, validate: acceptAll });
    expect(r.files.map((f) => f.name)).toEqual(["a.png", "b.png"]);
    expect(describeAddResult(r, 5)).toBeNull();
  });

  it("skips files that are already in the list and counts them", () => {
    const r = addUniqueFiles([mk("a.png")], [mk("a.png"), mk("b.png")], {
      limit: 5,
      validate: acceptAll,
    });
    expect(r.files).toHaveLength(2);
    expect(r.duplicates).toBe(1);
    expect(describeAddResult(r, 5)).toMatch(/1 duplicate file was skipped/);
  });

  it("skips duplicates inside the same drop", () => {
    const r = addUniqueFiles([], [mk("a.png"), mk("a.png")], { limit: 5, validate: acceptAll });
    expect(r.files).toHaveLength(1);
    expect(r.duplicates).toBe(1);
  });

  it("treats same-named files with different content as different files", () => {
    const r = addUniqueFiles([mk("a.png", "x")], [mk("a.png", "longer")], {
      limit: 5,
      validate: acceptAll,
    });
    expect(r.files).toHaveLength(2);
    expect(r.duplicates).toBe(0);
  });

  it("caps at the limit and reports how many were left out", () => {
    const r = addUniqueFiles([], [mk("a"), mk("b"), mk("c")], { limit: 2, validate: acceptAll });
    expect(r.files).toHaveLength(2);
    expect(r.overLimit).toBe(1);
    expect(describeAddResult(r, 2)).toMatch(/Only 2 files.*1 more was left out/);
  });

  it("rejects invalid files with their reason and does not let them use up the limit", () => {
    const r = addUniqueFiles([], [mk("bad.txt"), mk("a.png"), mk("b.png")], {
      limit: 2,
      validate: (f) => (f.name.endsWith(".txt") ? `${f.name} is not an image.` : null),
    });
    expect(r.files.map((f) => f.name)).toEqual(["a.png", "b.png"]);
    expect(r.issues).toEqual(["bad.txt is not an image."]);
    expect(describeAddResult(r, 2)).toBe("bad.txt is not an image.");
  });

  it("summarises many rejections instead of printing every one", () => {
    const r = addUniqueFiles([], [mk("1.txt"), mk("2.txt"), mk("3.txt"), mk("4.txt")], {
      limit: 5,
      validate: (f) => `${f.name} rejected.`,
    });
    expect(describeAddResult(r, 5)).toBe("1.txt rejected. 2.txt rejected. (+2 more skipped.)");
  });

  it("does not mutate the existing array", () => {
    const existing = [mk("a.png")];
    addUniqueFiles(existing, [mk("b.png")], { limit: 5, validate: acceptAll });
    expect(existing).toHaveLength(1);
  });
});

describe("uniqueName", () => {
  it("returns the name unchanged the first time and suffixes repeats before the extension", () => {
    const used = new Map<string, number>();
    expect(uniqueName("photo.jpg", used)).toBe("photo.jpg");
    expect(uniqueName("photo.jpg", used)).toBe("photo (2).jpg");
    expect(uniqueName("photo.jpg", used)).toBe("photo (3).jpg");
    expect(uniqueName("other.jpg", used)).toBe("other.jpg");
  });

  it("handles names without an extension", () => {
    const used = new Map<string, number>();
    expect(uniqueName("README", used)).toBe("README");
    expect(uniqueName("README", used)).toBe("README (2)");
  });
});

describe("zipBlobs", () => {
  it("produces an archive containing every file, renaming colliding names", async () => {
    const blob = await zipBlobs([
      { name: "a.txt", blob: new Blob(["one"]) },
      { name: "a.txt", blob: new Blob(["two"]) },
      { name: "b.txt", blob: new Blob(["three"]) },
    ]);
    expect(blob.size).toBeGreaterThan(0);

    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    expect(Object.keys(zip.files).sort()).toEqual(["a (2).txt", "a.txt", "b.txt"]);
    expect(await zip.file("a.txt")!.async("string")).toBe("one");
    expect(await zip.file("a (2).txt")!.async("string")).toBe("two");
  });
});

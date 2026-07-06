import { describe, expect, it } from "vitest";
import { buildSearchIndex, getRelatedTools, getTool, tools } from "@/lib/tools/registry";

describe("tool registry integrity", () => {
  it("has unique slugs", () => {
    const slugs = tools.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has 38 tools, all browser-processed and indexable", () => {
    expect(tools).toHaveLength(38);
    tools.forEach((t) => {
      expect(t.processing).toBe("browser");
      expect(t.indexable).toBe(true);
    });
  });

  it("has complete SEO content for every tool", () => {
    tools.forEach((t) => {
      expect(t.title.length, t.slug).toBeGreaterThan(20);
      expect(t.title.length, t.slug).toBeLessThanOrEqual(65);
      expect(t.description.length, t.slug).toBeGreaterThan(60);
      expect(t.description.length, t.slug).toBeLessThanOrEqual(165);
      expect(t.steps.length, t.slug).toBeGreaterThanOrEqual(3);
      expect(t.faqs.length, t.slug).toBeGreaterThanOrEqual(3);
      expect(t.about.length, t.slug).toBeGreaterThan(100);
      expect(t.aliases.length, t.slug).toBeGreaterThan(0);
    });
  });

  it("only references existing tools in related lists", () => {
    tools.forEach((t) => {
      const related = getRelatedTools(t);
      expect(related.length, t.slug).toBe(t.related.length);
      expect(related.length, t.slug).toBeGreaterThanOrEqual(3);
    });
  });

  it("finds tools by alias through the search index", () => {
    const index = buildSearchIndex();
    const hit = index.find((e) => e.haystack.includes("jpeg to png"));
    expect(hit?.slug).toBe("jpg-to-png");
    expect(getTool("merge-pdf")?.shortName).toBe("Merge PDF");
  });
});

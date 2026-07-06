import { imageTools } from "./data/image";
import { pdfTools } from "./data/pdf";
import { textTools } from "./data/text";
import { devTools } from "./data/dev";
import type { ToolCategoryId, ToolDef } from "./types";

export const tools: ToolDef[] = [...imageTools, ...pdfTools, ...textTools, ...devTools];

const bySlug = new Map(tools.map((t) => [t.slug, t]));

export function getTool(slug: string): ToolDef | undefined {
  return bySlug.get(slug);
}

export function getToolsByCategory(category: ToolCategoryId): ToolDef[] {
  return tools.filter((t) => t.category === category);
}

export function getPopularTools(): ToolDef[] {
  return tools.filter((t) => t.popular);
}

export function getRelatedTools(tool: ToolDef): ToolDef[] {
  return tool.related
    .map((slug) => bySlug.get(slug))
    .filter((t): t is ToolDef => Boolean(t));
}

export function getIndexableTools(): ToolDef[] {
  return tools.filter((t) => t.indexable);
}

/** Lightweight search index for the client-side tool search. */
export interface SearchEntry {
  slug: string;
  name: string;
  shortName: string;
  category: ToolCategoryId;
  haystack: string;
}

export function buildSearchIndex(): SearchEntry[] {
  return tools.map((t) => ({
    slug: t.slug,
    name: t.name,
    shortName: t.shortName,
    category: t.category,
    haystack: [t.name, t.shortName, t.slug.replace(/-/g, " "), ...t.aliases]
      .join(" ")
      .toLowerCase(),
  }));
}

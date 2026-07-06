import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { categories } from "@/lib/tools/categories";
import { getIndexableTools } from "@/lib/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tools"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({
      url: absoluteUrl(`/${c.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getIndexableTools().map((t) => ({
      url: absoluteUrl(`/${t.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: t.popular ? 0.8 : 0.6,
    })),
    ...["/about", "/privacy", "/terms", "/contact"].map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}

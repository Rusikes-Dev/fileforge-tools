import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { categories } from "@/lib/tools/categories";
import { getIndexableTools } from "@/lib/tools/registry";
import { posts } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tools"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
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
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...["/about", "/privacy", "/terms", "/contact"].map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}

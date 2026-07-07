import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";
import type { CategoryDef, ToolDef } from "./tools/types";
import { getCategory } from "./tools/categories";

export function toolMetadata(tool: ToolDef): Metadata {
  const url = absoluteUrl(`/${tool.slug}`);
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: url },
    robots: tool.indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tool.title,
      description: tool.description,
    },
  };
}

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export interface Crumb {
  name: string;
  href: string;
}

export function toolBreadcrumbs(tool: ToolDef): Crumb[] {
  const category = getCategory(tool.category) as CategoryDef;
  return [
    { name: "Home", href: "/" },
    { name: category.name, href: `/${category.id}` },
    { name: tool.shortName, href: `/${tool.slug}` },
  ];
}

export function breadcrumbJsonLd(crumbs: Crumb[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export function toolAppJsonLd(tool: ToolDef): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: absoluteUrl(`/${tool.slug}`),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool.description,
  };
}

export function faqJsonLd(tool: ToolDef): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(params: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    datePublished: params.publishedAt,
    dateModified: params.publishedAt,
    url: absoluteUrl(params.path),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: absoluteUrl(params.path),
  };
}

export function websiteJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };
}

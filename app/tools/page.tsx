import type { Metadata } from "next";
import { Suspense } from "react";
import ToolSearch from "@/components/common/ToolSearch";
import ToolCard from "@/components/common/ToolCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import JsonLd from "@/components/common/JsonLd";
import { categories } from "@/lib/tools/categories";
import { buildSearchIndex, getToolsByCategory, tools } from "@/lib/tools/registry";
import { breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "/tools",
  "All Tools — Free File Converters & Document Utilities",
  `Browse all ${tools.length} free browser-based tools: image converters, PDF utilities, text cleanup and developer helpers. No uploads, no sign-up.`
);

const crumbs = [
  { name: "Home", href: "/" },
  { name: "All Tools", href: "/tools" },
];

export default function ToolsPage() {
  return (
    <div className="container-site py-8">
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemListJsonLd(tools)]} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">All tools</h1>
      <p className="mt-2 max-w-2xl text-ink-700">
        Every tool on this site, organised by category. All {tools.length} tools run in your browser —
        your files are never uploaded.
      </p>
      <div id="search" className="mt-6 max-w-xl scroll-mt-20">
        <Suspense fallback={<div className="input-base h-12" />}>
          <ToolSearch index={buildSearchIndex()} large autoFocus={false} />
        </Suspense>
      </div>
      {categories.map((cat) => (
        <section key={cat.id} aria-labelledby={`all-${cat.id}`} className="mt-10">
          <h2 id={`all-${cat.id}`} className="text-2xl font-semibold">
            {cat.name}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {getToolsByCategory(cat.id).map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

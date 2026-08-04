import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ToolSearch from "@/components/common/ToolSearch";
import ToolCard from "@/components/common/ToolCard";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import JsonLd from "@/components/common/JsonLd";
import SectionHeading from "@/components/common/SectionHeading";
import { CategoryIcon } from "@/components/common/Icon";
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
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemListJsonLd(tools)]} />

      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-site py-8 sm:py-10">
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-5 max-w-3xl">
            <h1 className="text-display-sm">All tools</h1>
            <p className="mt-3 text-base leading-relaxed text-ink-700 sm:text-lg">
              Every tool on this site, organised by category. All {tools.length} run in your
              browser — your files are never uploaded.
            </p>
          </div>

          <div id="search" className="mt-6 max-w-xl scroll-mt-24">
            <Suspense fallback={<div className="skeleton h-[52px] w-full rounded-lg" />}>
              <ToolSearch index={buildSearchIndex()} large />
            </Suspense>
          </div>

          {/* Jump links double as an at-a-glance count per category. */}
          <nav aria-label="Jump to category" className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`#all-${cat.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-surface px-3 py-1.5 text-sm font-medium text-ink-700 shadow-xs transition-colors hover:border-ink-300 hover:text-ink-900"
              >
                <CategoryIcon category={cat.id} className="h-3.5 w-3.5 text-ink-500" />
                {cat.name}
                <span className="text-xs tabular-nums text-ink-500">
                  {getToolsByCategory(cat.id).length}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-site py-12">
        {categories.map((cat) => (
          <section
            key={cat.id}
            id={`all-${cat.id}`}
            aria-labelledby={`all-${cat.id}-heading`}
            className="mb-14 scroll-mt-24 last:mb-0"
          >
            <SectionHeading
              id={`all-${cat.id}-heading`}
              title={cat.name}
              description={cat.intro}
              href={`/${cat.id}`}
              linkLabel="Category page"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getToolsByCategory(cat.id).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

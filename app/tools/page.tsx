import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ToolSearch from "@/components/common/ToolSearch";
import ToolCard from "@/components/common/ToolCard";
import PageHero from "@/components/common/PageHero";
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

      <PageHero
        crumbs={crumbs}
        title="All tools"
        intro={`Every tool on this site, organised by category. All ${tools.length} run in your browser — your files are never uploaded.`}
      >
        <div id="search" className="relative z-20 mt-6 max-w-xl scroll-mt-24">
          <Suspense fallback={<div className="skeleton h-[52px] w-full rounded-2xl" />}>
            <ToolSearch index={buildSearchIndex()} large floating />
          </Suspense>
        </div>

        {/* Jump links double as an at-a-glance count per category. */}
        <nav aria-label="Jump to category" className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`#all-${cat.id}`}
              data-cat={cat.id}
              className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-surface py-1 pl-1 pr-3 text-sm font-semibold text-ink-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-line hover:text-ink-900 hover:shadow-md"
            >
              <span aria-hidden className="tile !h-6 !w-6 !rounded-full">
                <CategoryIcon category={cat.id} className="h-3.5 w-3.5" />
              </span>
              {cat.name}
              <span className="text-xs tabular-nums text-ink-500">
                {getToolsByCategory(cat.id).length}
              </span>
            </Link>
          ))}
        </nav>
      </PageHero>

      <div className="container-site py-12">
        {categories.map((cat) => (
          <section
            key={cat.id}
            id={`all-${cat.id}`}
            data-cat={cat.id}
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
            <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

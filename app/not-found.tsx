import Link from "next/link";
import { Suspense } from "react";
import ToolSearch from "@/components/common/ToolSearch";
import { CategoryIcon } from "@/components/common/Icon";
import { categories } from "@/lib/tools/categories";
import { buildSearchIndex, getPopularTools } from "@/lib/tools/registry";

export default function NotFound() {
  const popular = getPopularTools().slice(0, 6);

  return (
    <div className="container-site relative isolate max-w-3xl py-16 sm:py-24">
      <div aria-hidden className="aurora">
        <i />
        <i />
        <i />
      </div>
      <div className="text-center">
        {/* Huge, soft 404 — decorative, the real heading is the h1 below. */}
        <p
          aria-hidden
          className="text-gradient animate-float select-none text-[7rem] font-black leading-none sm:text-[10rem]"
        >
          404
        </p>
        <h1 className="mt-2 text-display-sm">This page doesn&apos;t exist</h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink-700">
          The link may be outdated, or the tool may have been renamed. Search for what you need
          below — it is probably still here under a different name.
        </p>

        <div className="relative z-20 mx-auto mt-8 max-w-md text-left">
          <Suspense fallback={<div className="skeleton h-[52px] w-full rounded-2xl" />}>
            <ToolSearch index={buildSearchIndex()} large floating />
          </Suspense>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
          Popular tools
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {popular.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/${t.slug}`}
                data-cat={t.category}
                className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-surface px-3 py-2.5 text-sm font-semibold text-ink-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-line hover:text-ink-900 hover:shadow-md"
              >
                <span aria-hidden className="tile !h-8 !w-8 !rounded-lg">
                  <CategoryIcon category={t.category} className="h-4 w-4" />
                </span>
                {t.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3 border-t border-ink-100 pt-10">
        <Link href="/" className="btn-primary">
          Back to the homepage
        </Link>
        <Link href="/tools" className="btn-secondary">
          Browse all tools
        </Link>
      </div>

      <nav aria-label="Categories" className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <Link key={c.id} href={`/${c.id}`} className="btn-ghost btn-sm">
            {c.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

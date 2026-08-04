import Link from "next/link";
import { Suspense } from "react";
import ToolSearch from "@/components/common/ToolSearch";
import { CategoryIcon } from "@/components/common/Icon";
import { categories } from "@/lib/tools/categories";
import { buildSearchIndex, getPopularTools } from "@/lib/tools/registry";

export default function NotFound() {
  const popular = getPopularTools().slice(0, 6);

  return (
    <div className="container-site max-w-3xl py-16 sm:py-24">
      <div className="text-center">
        <p className="badge-neutral mx-auto font-mono">404</p>
        <h1 className="mt-5 text-display-sm">This page doesn&apos;t exist</h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink-700">
          The link may be outdated, or the tool may have been renamed. Search for what you need
          below — it is probably still here under a different name.
        </p>

        <div className="mx-auto mt-8 max-w-md text-left">
          <Suspense fallback={<div className="skeleton h-[52px] w-full rounded-lg" />}>
            <ToolSearch index={buildSearchIndex()} large />
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
                className="flex items-center gap-2.5 rounded-lg border border-ink-100 bg-surface px-3.5 py-3 text-sm font-medium text-ink-700 shadow-xs transition-colors hover:border-ink-300 hover:text-ink-900"
              >
                <CategoryIcon category={t.category} className="h-4 w-4 text-ink-500" />
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

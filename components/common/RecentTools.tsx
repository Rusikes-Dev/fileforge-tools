"use client";

import Link from "next/link";
import { useRecentTools } from "@/lib/hooks/useRecentTools";
import type { ToolCategoryId } from "@/lib/tools/types";
import { CategoryIcon, ClockIcon } from "./Icon";

export interface ToolStub {
  slug: string;
  shortName: string;
  category: ToolCategoryId;
}

/**
 * Recently opened tools, read from this browser's local storage.
 *
 * Renders nothing until hydration completes and nothing at all when the list is
 * empty, so first-time visitors never see a stranded empty section.
 */
export default function RecentTools({ stubs }: { stubs: ToolStub[] }) {
  const { slugs, clear, ready } = useRecentTools();
  if (!ready) return null;

  const bySlug = new Map(stubs.map((s) => [s.slug, s]));
  const recent = slugs.map((s) => bySlug.get(s)).filter((t): t is ToolStub => Boolean(t));
  if (recent.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="container-site pt-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="recent-heading"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700"
        >
          <ClockIcon className="h-4 w-4 text-ink-500" />
          Recently used
        </h2>
        <button type="button" onClick={clear} className="btn-ghost btn-sm text-ink-500">
          Clear
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {recent.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/${t.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-surface px-3 py-1.5 text-sm font-medium text-ink-700 shadow-xs transition-colors hover:border-ink-300 hover:text-ink-900"
            >
              <CategoryIcon category={t.category} className="h-3.5 w-3.5 text-ink-500" />
              {t.shortName}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink-500">
        Stored only in this browser — never sent anywhere.
      </p>
    </section>
  );
}

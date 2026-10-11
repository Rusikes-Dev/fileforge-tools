import type { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { CategoryIcon } from "./Icon";
import type { Crumb } from "@/lib/seo";
import type { ToolCategoryId } from "@/lib/tools/types";

/**
 * The coloured header band shared by the tools index, category hubs and
 * individual tool pages. `category` re-themes the whole band (tile, glow and
 * gradient hairline) through the data-cat palettes in globals.css.
 */
export default function PageHero({
  crumbs,
  title,
  intro,
  category,
  children,
  compact = false,
}: {
  crumbs: Crumb[];
  title: string;
  intro: string;
  category?: ToolCategoryId;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      data-cat={category}
      className="relative isolate z-20 overflow-x-clip border-b border-ink-100 bg-subtle"
    >
      {/* Category-tinted glow, purely decorative. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span
          className="absolute -right-24 -top-32 h-80 w-80 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(var(--c1) / 0.35), transparent 65%)" }}
        />
        <span
          className="absolute -left-24 bottom-[-9rem] h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgb(var(--c2) / 0.28), transparent 65%)" }}
        />
        <div className="bg-grid absolute inset-0 opacity-70" />
      </div>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[rgb(var(--c1))] to-transparent opacity-60"
      />

      <div className={`container-site ${compact ? "py-6 sm:py-8" : "py-8 sm:py-12"}`}>
        <Breadcrumbs crumbs={crumbs} />
        <div className="mt-5 flex items-start gap-4 sm:gap-5">
          {category && (
            <span
              aria-hidden
              className="tile animate-pop-in hidden !h-14 !w-14 !rounded-2xl sm:flex"
            >
              <CategoryIcon category={category} className="h-7 w-7" />
            </span>
          )}
          <div className="min-w-0 max-w-3xl">
            <h1 className="animate-fade-in-up text-display-sm sm:text-display-md">{title}</h1>
            <p className="animate-fade-in-up mt-3 text-base leading-relaxed text-ink-700 [animation-delay:80ms] sm:text-lg">
              {intro}
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

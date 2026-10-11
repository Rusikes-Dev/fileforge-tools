import Link from "next/link";
import { ArrowRightIcon } from "./Icon";

/**
 * The shared heading + optional "view all" affordance used at the top of every
 * homepage and hub section, so spacing and type never drift between them.
 */
export default function SectionHeading({
  id,
  title,
  description,
  eyebrow,
  href,
  linkLabel,
}: {
  id: string;
  title: string;
  description?: string;
  /** Small label above the title, e.g. "Most used". */
  eyebrow?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent-700">
            <span
              aria-hidden
              className="h-1 w-6 rounded-full bg-gradient-to-r from-[rgb(var(--aurora-1))] to-[rgb(var(--aurora-2))]"
            />
            {eyebrow}
          </p>
        )}
        <h2 id={id} className="text-2xl font-bold sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="btn-secondary btn-sm group shrink-0"
        >
          {linkLabel}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

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
  href,
  linkLabel,
}: {
  id: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="min-w-0">
        <h2 id={id} className="text-xl font-semibold sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-500">{description}</p>
        )}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-700 hover:text-accent-800"
        >
          {linkLabel}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

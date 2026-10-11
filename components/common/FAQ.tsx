import type { ToolFaq } from "@/lib/tools/types";
import { PlusIcon } from "./Icon";

/**
 * FAQ list built on native <details>/<summary>.
 *
 * Collapsible without any JavaScript, keyboard-operable for free, and the
 * answers remain in the DOM when collapsed so search engines still index them
 * alongside the FAQPage structured data emitted by the page.
 */
export default function FAQ({
  faqs,
  headingId = "faq-heading",
  title = "Frequently asked questions",
}: {
  faqs: ToolFaq[];
  headingId?: string;
  title?: string;
}) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl font-bold">
        {title}
      </h2>
      <div className="mt-5 space-y-3">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            className="group overflow-hidden rounded-2xl border border-ink-100 bg-surface shadow-xs transition-all duration-300 open:border-accent-600/40 open:shadow-md"
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 font-semibold text-ink-900 transition-colors hover:bg-ink-50 sm:px-5 [&::-webkit-details-marker]:hidden">
              <span>{f.q}</span>
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition-all duration-300 ease-spring group-open:rotate-45 group-open:bg-accent-700 group-open:text-white dark:group-open:bg-accent-600 dark:group-open:text-ink-50"
              >
                <PlusIcon className="h-4 w-4" />
              </span>
            </summary>
            <div className="animate-fade-in-up px-4 pb-5 pt-0 text-sm leading-relaxed text-ink-700 sm:px-5">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

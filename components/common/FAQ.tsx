import type { ToolFaq } from "@/lib/tools/types";
import { ChevronDownIcon } from "./Icon";

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
      <h2 id={headingId} className="text-xl font-semibold">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-100 bg-surface">
        {faqs.map((f, i) => (
          <details key={f.q} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 font-medium text-ink-900 transition-colors hover:bg-ink-50 sm:px-5 [&::-webkit-details-marker]:hidden">
              <span>{f.q}</span>
              <ChevronDownIcon className="h-4 w-4 shrink-0 text-ink-500 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 pt-0 text-sm leading-relaxed text-ink-700 sm:px-5">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

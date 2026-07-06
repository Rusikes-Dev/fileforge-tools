import type { ToolFaq } from "@/lib/tools/types";

export default function FAQ({ faqs }: { faqs: ToolFaq[] }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-semibold">Frequently asked questions</h2>
      <dl className="mt-4 divide-y divide-ink-100 border-y border-ink-100">
        {faqs.map((f) => (
          <div key={f.q} className="py-4">
            <dt className="font-medium text-ink-900">{f.q}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-700">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

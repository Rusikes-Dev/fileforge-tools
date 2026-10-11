import Link from "next/link";
import PageHero from "@/components/common/PageHero";
import ToolCard from "@/components/common/ToolCard";
import JsonLd from "@/components/common/JsonLd";
import TrustBar from "@/components/common/TrustBar";
import FAQ from "@/components/common/FAQ";
import { ArrowRightIcon, CategoryIcon } from "@/components/common/Icon";
import type { CategoryDef } from "@/lib/tools/types";
import { categories } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

const sharedFaqs = [
  {
    q: "Do I need to create an account?",
    a: "No. Every tool works immediately with no sign-up, email address or payment details. There are no usage limits beyond what your own device can handle.",
  },
  {
    q: "Are my files uploaded anywhere?",
    a: "No. Each tool runs in your browser using JavaScript, so files are read directly from your device and processed in memory. You can confirm this in your browser's Network tab — no request carries your file.",
  },
  {
    q: "Which browsers are supported?",
    a: "Current versions of Chrome, Edge, Firefox and Safari on desktop and mobile. The tools rely on standard web APIs rather than plugins, so nothing extra needs installing.",
  },
];

export default function CategoryPage({ category }: { category: CategoryDef }) {
  const tools = getToolsByCategory(category.id);
  const others = categories.filter((c) => c.id !== category.id);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.name, href: `/${category.id}` },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemListJsonLd(tools)]} />

      <PageHero crumbs={crumbs} title={category.name} intro={category.intro} category={category.id}>
        <p className="badge-accent animate-fade-in-up mt-5 [animation-delay:160ms]">
          {tools.length} free tools
        </p>
      </PageHero>

      <div className="container-site py-12" data-cat={category.id}>
        {/* The h2 keeps the outline h1 → h2 → h3 (the cards' titles are h3). */}
        <h2 className="mb-6 text-2xl font-bold">All {category.name.toLowerCase()}</h2>
        <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>

        <section
          aria-labelledby={`about-${category.id}`}
          className="mt-16 max-w-3xl border-t border-ink-100 pt-12"
        >
          <h2 id={`about-${category.id}`} className="text-2xl font-bold">
            About {category.name.toLowerCase()}
          </h2>
          <div className="mt-4 space-y-4">
            {category.about.map((p) => (
              <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-ink-700">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby={`why-${category.id}`} className="mt-14">
          <h2 id={`why-${category.id}`} className="sr-only">
            Why use these tools
          </h2>
          <TrustBar />
        </section>

        <div className="mt-14 max-w-3xl">
          <FAQ faqs={sharedFaqs} headingId={`faq-${category.id}`} />
        </div>

        <section aria-labelledby={`other-${category.id}`} className="mt-16 border-t border-ink-100 pt-12">
          <h2 id={`other-${category.id}`} className="text-2xl font-bold">
            Other categories
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((c) => (
              <Link
                key={c.id}
                href={`/${c.id}`}
                data-cat={c.id}
                className="card-interactive group flex flex-col"
              >
                <span aria-hidden className="tile mb-4">
                  <CategoryIcon category={c.id} className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold text-ink-900">{c.name}</h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-ink-500">{c.intro}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                  {getToolsByCategory(c.id).length} tools
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

import Link from "next/link";
import Breadcrumbs from "@/components/common/Breadcrumbs";
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

      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-site py-8 sm:py-10">
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-5 flex items-start gap-4">
            <span
              aria-hidden
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent-100 bg-accent-50 text-accent-700 sm:flex"
            >
              <CategoryIcon category={category.id} className="h-6 w-6" />
            </span>
            <div className="max-w-3xl">
              <h1 className="text-display-sm">{category.name}</h1>
              <p className="mt-3 text-base leading-relaxed text-ink-700 sm:text-lg">
                {category.intro}
              </p>
              <p className="badge-neutral mt-4">{tools.length} free tools</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>

        <section
          aria-labelledby={`about-${category.id}`}
          className="mt-16 max-w-3xl border-t border-ink-100 pt-12"
        >
          <h2 id={`about-${category.id}`} className="text-xl font-semibold">
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
          <h2 id={`other-${category.id}`} className="text-xl font-semibold">
            Other categories
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((c) => (
              <Link key={c.id} href={`/${c.id}`} className="card-interactive group flex flex-col">
                <span
                  aria-hidden
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-700 transition-colors group-hover:border-accent-100 group-hover:bg-accent-50 group-hover:text-accent-700"
                >
                  <CategoryIcon category={c.id} className="h-[18px] w-[18px]" />
                </span>
                <h3 className="font-semibold text-ink-900 transition-colors group-hover:text-accent-700">
                  {c.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-ink-500">{c.intro}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700">
                  {getToolsByCategory(c.id).length} tools
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

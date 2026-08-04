import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import FAQ from "@/components/common/FAQ";
import JsonLd from "@/components/common/JsonLd";
import PrivacyBadge from "@/components/common/PrivacyBadge";
import RelatedTools from "@/components/common/RelatedTools";
import RecordVisit from "@/components/common/RecordVisit";
import AdSlot from "@/components/common/AdSlot";
import ToolRenderer from "@/components/tools/ToolRenderer";
import {
  ArrowRightIcon,
  CheckIcon,
  LockIcon,
  ShieldCheckIcon,
  SparkleIcon,
  WifiOffIcon,
} from "@/components/common/Icon";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  toolAppJsonLd,
  toolBreadcrumbs,
  toolMetadata,
} from "@/lib/seo";
import { getCategory } from "@/lib/tools/categories";
import { getRelatedTools, getTool, tools } from "@/lib/tools/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return {};
  return toolMetadata(tool);
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const crumbs = toolBreadcrumbs(tool);
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool);

  return (
    <>
      <JsonLd
        data={[breadcrumbJsonLd(crumbs), toolAppJsonLd(tool), faqJsonLd(tool), howToJsonLd(tool)]}
      />
      <RecordVisit slug={tool.slug} />

      {/* ------------------------------------------------------------- Header */}
      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-site py-6 sm:py-8">
          <Breadcrumbs crumbs={crumbs} />
          <div className="mt-5 max-w-3xl">
            <h1 className="text-display-sm">{tool.name}</h1>
            <p className="mt-3 text-base leading-relaxed text-ink-700 sm:text-lg">{tool.intro}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <PrivacyBadge />
              <span className="badge-neutral">Free · No sign-up</span>
              {tool.outputFormats.length > 0 && (
                <span className="badge-neutral">Outputs {tool.outputFormats.join(", ")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------- Tool */}
      <div className="container-site py-8 sm:py-10">
        <ToolRenderer slug={tool.slug} />
        <AdSlot slot="below-result" />
      </div>

      {/* ------------------------------------------------------------ Content */}
      <div className="container-site pb-16">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-12 lg:col-span-2">
            <section aria-labelledby="how-heading">
              <h2 id="how-heading" className="text-xl font-semibold">
                How to use {tool.shortName}
              </h2>
              <ol className="mt-5 space-y-4">
                {tool.steps.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-100 bg-accent-50 text-xs font-semibold text-accent-800"
                    >
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-ink-700">{s}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-xl font-semibold">
                About this tool
              </h2>
              <div className="mt-4 space-y-4">
                {tool.about.map((p) => (
                  <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-ink-700">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {tool.useCases.length > 0 && (
              <section aria-labelledby="use-cases-heading">
                <h2 id="use-cases-heading" className="text-xl font-semibold">
                  Common ways people use this
                </h2>
                <ul className="mt-4 space-y-3">
                  {tool.useCases.map((u) => (
                    <li key={u} className="flex gap-3">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                      <span className="text-sm leading-relaxed text-ink-700">{u}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tool.tips.length > 0 && (
              <section aria-labelledby="tips-heading">
                <h2 id="tips-heading" className="text-xl font-semibold">
                  Tips for better results
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {tool.tips.map((t) => (
                    <li key={t} className="panel flex gap-3 p-4">
                      <SparkleIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                      <span className="text-sm leading-relaxed text-ink-700">{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <FAQ faqs={tool.faqs} />
          </div>

          {/* ------------------------------------------------------- Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <section aria-labelledby="privacy-side-heading" className="card">
              <h2
                id="privacy-side-heading"
                className="flex items-center gap-2 text-base font-semibold"
              >
                <ShieldCheckIcon className="h-[18px] w-[18px] text-accent-600" />
                Your files stay private
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                This tool runs entirely in your browser. Files are read and processed on your own
                device and are never uploaded to a server. Closing the tab clears everything from
                memory.
              </p>
              <ul className="mt-4 space-y-2.5 border-t border-ink-100 pt-4">
                <li className="flex items-center gap-2.5 text-sm text-ink-700">
                  <LockIcon className="h-4 w-4 shrink-0 text-ink-500" />
                  No upload endpoint exists
                </li>
                <li className="flex items-center gap-2.5 text-sm text-ink-700">
                  <WifiOffIcon className="h-4 w-4 shrink-0 text-ink-500" />
                  Keeps working offline
                </li>
              </ul>
              <Link
                href="/privacy"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:text-accent-800"
              >
                How we handle data
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </section>

            {tool.inputFormats.length > 0 && (
              <section aria-labelledby="formats-heading" className="card">
                <h2 id="formats-heading" className="text-base font-semibold">
                  Supported formats
                </h2>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-ink-500">
                      Input
                    </dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {tool.inputFormats.map((f) => (
                        <span key={f} className="badge-neutral">
                          {f}
                        </span>
                      ))}
                    </dd>
                  </div>
                  {tool.outputFormats.length > 0 && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-ink-500">
                        Output
                      </dt>
                      <dd className="mt-1.5 flex flex-wrap gap-1.5">
                        {tool.outputFormats.map((f) => (
                          <span key={f} className="badge-neutral">
                            {f}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            {category && (
              <section aria-labelledby="category-side-heading" className="card">
                <h2 id="category-side-heading" className="text-base font-semibold">
                  More {category.name.toLowerCase()}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{category.intro}</p>
                <Link
                  href={`/${category.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:text-accent-800"
                >
                  Browse {category.name}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </section>
            )}

            <AdSlot slot="sidebar" />
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-ink-100 pt-12">
            <RelatedTools tools={related} />
          </div>
        )}
      </div>
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import FAQ from "@/components/common/FAQ";
import JsonLd from "@/components/common/JsonLd";
import PrivacyBadge from "@/components/common/PrivacyBadge";
import RelatedTools from "@/components/common/RelatedTools";
import AdSlot from "@/components/common/AdSlot";
import ToolRenderer from "@/components/tools/ToolRenderer";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  toolAppJsonLd,
  toolBreadcrumbs,
  toolMetadata,
} from "@/lib/seo";
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
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), toolAppJsonLd(tool), faqJsonLd(tool)]} />
      <div className="container-site py-6 sm:py-8">
        <Breadcrumbs crumbs={crumbs} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{tool.name}</h1>
          <PrivacyBadge />
        </div>
        <p className="mt-2 max-w-3xl text-ink-700">{tool.intro}</p>

        <div className="mt-6">
          <ToolRenderer slug={tool.slug} />
        </div>

        <AdSlot slot="below-result" />

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section aria-labelledby="how-heading">
              <h2 id="how-heading" className="text-xl font-semibold">
                How to use this tool
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-700">
                {tool.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-xl font-semibold">
                About this tool
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{tool.about}</p>
            </section>

            <FAQ faqs={tool.faqs} />
          </div>

          <aside className="space-y-6 lg:pl-4">
            <section aria-labelledby="privacy-side-heading" className="card">
              <h2 id="privacy-side-heading" className="text-base font-semibold">
                Your files stay private
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                This tool runs entirely in your browser using JavaScript. Files are read and processed
                on your own device and are never uploaded to a server. Closing the tab removes
                everything from memory.
              </p>
            </section>
            {tool.inputFormats.length > 0 && (
              <section aria-labelledby="formats-heading" className="card">
                <h2 id="formats-heading" className="text-base font-semibold">
                  Supported formats
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  Input: {tool.inputFormats.join(", ")}
                  {tool.outputFormats.length > 0 && <> · Output: {tool.outputFormats.join(", ")}</>}
                </p>
              </section>
            )}
            <AdSlot slot="sidebar" />
          </aside>
        </div>

        <div className="mt-12">
          <RelatedTools tools={getRelatedTools(tool)} />
        </div>
      </div>
    </>
  );
}

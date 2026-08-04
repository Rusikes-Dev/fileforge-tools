import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import ToolSearch from "@/components/common/ToolSearch";
import ToolCard from "@/components/common/ToolCard";
import JsonLd from "@/components/common/JsonLd";
import TrustBar from "@/components/common/TrustBar";
import SectionHeading from "@/components/common/SectionHeading";
import RecentTools from "@/components/common/RecentTools";
import { ArrowRightIcon, CategoryIcon, ShieldCheckIcon } from "@/components/common/Icon";
import { categories } from "@/lib/tools/categories";
import {
  buildSearchIndex,
  getPopularTools,
  getToolsByCategory,
  tools,
} from "@/lib/tools/registry";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { getSortedPosts } from "@/lib/blog/posts";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata(
  "/",
  `Free Online File Converter & Document Tools — ${site.name}`,
  site.description
);

const homeFaqs = [
  {
    q: "Are these tools really free?",
    a: "Yes. Every tool on this site is free to use with no account, no watermarks and no daily limits beyond your browser's own memory.",
  },
  {
    q: "Are my files uploaded to a server?",
    a: "No. All processing happens locally in your browser using JavaScript. Your files never leave your device, which also makes the tools fast and safe for confidential documents.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The tools run in any modern browser on desktop or mobile — Chrome, Firefox, Safari and Edge are all supported.",
  },
  {
    q: "Is there a file size limit?",
    a: "Because files are processed in your browser, practical limits depend on your device's memory. As a guideline, images up to 25 MB and PDFs up to 50 MB work reliably.",
  },
  {
    q: "How can I verify nothing is uploaded?",
    a: "Open your browser's developer tools, switch to the Network tab, and run any tool. You will see no request carrying your file — the work happens entirely in the page you already loaded.",
  },
];

export default function HomePage() {
  const popular = getPopularTools();
  const posts = getSortedPosts().slice(0, 3);
  const stubs = tools.map((t) => ({
    slug: t.slug,
    shortName: t.shortName,
    category: t.category,
  }));

  return (
    <>
      <JsonLd
        data={[
          websiteJsonLd(),
          organizationJsonLd({
            sameAs: [
              "https://www.producthunt.com/products/fileforge-tools",
              "https://www.saashub.com/fileforgetools-in-alternatives",
              "https://dev.to/rushikes-dev",
              "https://www.youtube.com/@KidsCoder",
            ],
          }),
        ]}
      />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-ink-100">
        {/* Soft brand wash behind the hero. Purely decorative, so it is hidden
            from assistive tech and cannot intercept pointer events. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-accent-50 via-ink-50 to-surface"
        />
        <div className="container-site py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="badge-accent mx-auto">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              {tools.length} tools · 100% browser-based
            </p>

            <h1 className="mt-5 text-display-sm sm:text-display-md lg:text-display-lg">
              File tools that never
              <span className="text-accent-700"> upload your files</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Convert images, edit PDFs, clean up text and run developer utilities — all processed
              locally on your device. No sign-up, no watermarks, no file ever leaving your browser.
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <Suspense fallback={<div className="skeleton h-[52px] w-full rounded-lg" />}>
                <ToolSearch index={buildSearchIndex()} large />
              </Suspense>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-500">
              <span>Free forever</span>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-ink-300 sm:block" />
              <span>No account needed</span>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-ink-300 sm:block" />
              <span>Works offline once loaded</span>
            </div>
          </div>
        </div>
      </section>

      <RecentTools stubs={stubs} />

      {/* ------------------------------------------------------------ Popular */}
      <section aria-labelledby="popular-heading" className="container-site py-14">
        <SectionHeading
          id="popular-heading"
          title="Most used tools"
          description="The tools people reach for most often, across every category."
          href="/tools"
          linkLabel={`Browse all ${tools.length}`}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((t) => (
            <ToolCard key={t.slug} tool={t} showCategory />
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- Categories */}
      <section aria-labelledby="categories-heading" className="border-y border-ink-100 bg-ink-50">
        <div className="container-site py-14">
          <SectionHeading
            id="categories-heading"
            title="Browse by category"
            description="Four focused collections covering images, documents, text and everyday development work."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const count = getToolsByCategory(cat.id).length;
              return (
                <Link key={cat.id} href={`/${cat.id}`} className="card-interactive group flex flex-col">
                  <span
                    aria-hidden
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 bg-ink-50 text-ink-700 transition-colors group-hover:border-accent-100 group-hover:bg-accent-50 group-hover:text-accent-700"
                  >
                    <CategoryIcon category={cat.id} className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-ink-900 transition-colors group-hover:text-accent-700">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
                    {cat.intro}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700">
                    {count} tools
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- Per-category tools */}
      {categories.map((cat) => {
        const catTools = getToolsByCategory(cat.id);
        return (
          <section key={cat.id} aria-labelledby={`${cat.id}-heading`} className="container-site py-12">
            <SectionHeading
              id={`${cat.id}-heading`}
              title={cat.name}
              description={cat.intro}
              href={`/${cat.id}`}
              linkLabel={`All ${catTools.length} tools`}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {catTools.slice(0, 6).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        );
      })}

      {/* -------------------------------------------------------- Privacy/why */}
      <section aria-labelledby="why-heading" className="border-y border-ink-100 bg-ink-50">
        <div className="container-site py-16">
          <SectionHeading
            id="why-heading"
            title="Why browser-based matters"
            description="Most online converters upload your file to a server you know nothing about. These tools do not have a server to upload to."
          />
          <TrustBar />

          <div className="mt-10 rounded-2xl border border-ink-100 bg-surface p-6 shadow-xs sm:p-8">
            <h3 className="text-base font-semibold text-ink-900">How to verify this yourself</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-700">
              You should not have to take a privacy claim on trust. Open your browser&apos;s
              developer tools, switch to the Network tab, then run any tool on this site with a
              file. No request carrying your file will appear, because the conversion happens in
              JavaScript inside the page you have already downloaded. You can also disconnect from
              the internet after the page loads — the tools keep working.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/privacy" className="btn-secondary">
                Read the privacy policy
              </Link>
              <Link href="/about" className="btn-ghost">
                How this site is built
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Articles */}
      <section aria-labelledby="blog-heading" className="container-site py-14">
        <SectionHeading
          id="blog-heading"
          title="Guides &amp; articles"
          description="Practical walkthroughs for common file and document problems."
          href="/blog"
          linkLabel="All articles"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-interactive group flex flex-col">
              <time dateTime={post.publishedAt} className="text-xs font-medium text-ink-500">
                {formatDate(post.publishedAt)}
              </time>
              <h3 className="mt-2 font-semibold leading-snug text-ink-900 transition-colors group-hover:text-accent-700">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section aria-labelledby="home-faq-heading" className="container-site pb-16">
        <SectionHeading id="home-faq-heading" title="Frequently asked questions" />
        <dl className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-surface">
          {homeFaqs.map((f) => (
            <div key={f.q} className="p-5 sm:p-6">
              <dt className="font-semibold text-ink-900">{f.q}</dt>
              <dd className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-700">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

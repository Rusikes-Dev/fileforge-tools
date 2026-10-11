import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import ToolSearch from "@/components/common/ToolSearch";
import ToolCard from "@/components/common/ToolCard";
import JsonLd from "@/components/common/JsonLd";
import TrustBar from "@/components/common/TrustBar";
import FAQ from "@/components/common/FAQ";
import SectionHeading from "@/components/common/SectionHeading";
import RecentTools from "@/components/common/RecentTools";
import {
  ArrowRightIcon,
  CategoryIcon,
  DownloadIcon,
  SparkleIcon,
  UploadIcon,
} from "@/components/common/Icon";
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

const steps = [
  {
    Icon: UploadIcon,
    cat: "image-tools",
    title: "Drop in your file",
    body: "Drag it anywhere on the page, pick it from your device, or paste it from the clipboard.",
  },
  {
    Icon: SparkleIcon,
    cat: "pdf-tools",
    title: "Tweak the options",
    body: "Choose a format, quality or page range. Everything updates instantly — no waiting on a server.",
  },
  {
    Icon: DownloadIcon,
    cat: "developer-tools",
    title: "Download the result",
    body: "Save the converted file straight from your browser. Close the tab and nothing is kept.",
  },
] as const;

/** Decorative format chips floating around the hero on wide screens. */
const floaters = [
  { label: "JPG → PNG", cat: "image-tools", cls: "left-[5%] top-[20%]", delay: "0s" },
  { label: "Merge PDF", cat: "pdf-tools", cls: "right-[5%] top-[16%]", delay: "-1.4s" },
  { label: "WebP", cat: "image-tools", cls: "left-[9%] bottom-[22%]", delay: "-2.6s" },
  { label: "JSON", cat: "developer-tools", cls: "right-[8%] bottom-[24%]", delay: "-0.8s" },
  { label: "Word counter", cat: "text-tools", cls: "left-[1.5%] top-[52%]", delay: "-3.2s" },
  { label: "QR code", cat: "developer-tools", cls: "right-[2%] top-[50%]", delay: "-2s" },
] as const;

export default function HomePage() {
  const popular = getPopularTools();
  const posts = getSortedPosts().slice(0, 3);
  const stubs = tools.map((t) => ({
    slug: t.slug,
    shortName: t.shortName,
    category: t.category,
  }));
  const quick = popular.slice(0, 5);

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
      {/* No vertical clipping and a z-index of its own: the search results are
          taller than the space left in the hero and must paint over the marquee,
          the popular chips and the stat tiles below it. The decorative layers
          clip themselves. */}
      <section className="relative isolate z-20 overflow-x-clip border-b border-ink-100">
        {/* Decorative layers — hidden from assistive tech and unable to
            intercept pointer events. */}
        <div aria-hidden className="aurora">
          <i />
          <i />
          <i />
        </div>
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        {floaters.map((f) => (
          <span
            key={f.label}
            aria-hidden
            data-cat={f.cat}
            style={{ animationDelay: f.delay }}
            className={`float-chip pointer-events-none hidden xl:inline-flex ${f.cls}`}
          >
            <span className="tile !h-6 !w-6 !rounded-full">
              <CategoryIcon category={f.cat} className="h-3 w-3" />
            </span>
            {f.label}
          </span>
        ))}

        <div className="container-site py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="badge-accent animate-fade-in-up mx-auto gap-2.5 border-accent-600/25 bg-surface/80 shadow-sm backdrop-blur">
              <span className="pulse-dot" aria-hidden />
              {tools.length} tools · 100% browser-based
            </p>

            <h1 className="animate-fade-in-up mt-6 text-display-sm [animation-delay:80ms] sm:text-display-md lg:text-display-lg">
              File tools that never{" "}
              <span className="text-gradient">upload your files</span>
            </h1>

            <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-700 [animation-delay:160ms] sm:text-lg">
              Convert images, edit PDFs, clean up text and run developer utilities — all processed
              locally on your device. No sign-up, no watermarks, no file ever leaving your browser.
            </p>

            <div className="animate-fade-in-up relative z-20 mx-auto mt-9 max-w-xl text-left [animation-delay:240ms]">
              <Suspense fallback={<div className="skeleton h-[60px] w-full rounded-2xl" />}>
                <ToolSearch index={buildSearchIndex()} large floating />
              </Suspense>
            </div>

            <div className="animate-fade-in-up mt-5 flex flex-wrap items-center justify-center gap-2 [animation-delay:320ms]">
              <span className="text-sm text-ink-500">Popular:</span>
              {quick.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  data-cat={t.category}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-surface/80 py-1 pl-1 pr-3 text-xs font-semibold text-ink-700 shadow-xs backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-line hover:text-ink-900 hover:shadow-md"
                >
                  <span aria-hidden className="tile !h-5 !w-5 !rounded-full">
                    <CategoryIcon category={t.category} className="h-3 w-3" />
                  </span>
                  {t.shortName}
                </Link>
              ))}
            </div>

            <dl className="animate-fade-in-up mx-auto mt-12 grid max-w-xl grid-cols-3 gap-3 [animation-delay:400ms]">
              {[
                { k: "Tools", v: String(tools.length) },
                { k: "Files uploaded", v: "0" },
                { k: "Price", v: "Free" },
              ].map((s) => (
                // Label first in the DOM (term, then description), shown below the
                // number visually.
                <div
                  key={s.k}
                  className="flex flex-col-reverse rounded-2xl border border-ink-100 bg-surface/70 px-3 py-3.5 shadow-xs backdrop-blur"
                >
                  <dt className="mt-0.5 text-xs font-medium text-ink-500">{s.k}</dt>
                  <dd className="text-gradient text-2xl font-extrabold tabular-nums sm:text-3xl">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Marquee */}
      <section aria-label="Every tool at a glance" className="border-b border-ink-100 bg-subtle py-5">
        <div className="marquee">
          <div className="marquee-track">
            <ul className="flex shrink-0 gap-3">
              {tools.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/${t.slug}`}
                    data-cat={t.category}
                    className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-surface py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink-700 shadow-xs transition-colors hover:border-line hover:text-ink-900"
                  >
                    <span aria-hidden className="tile !h-6 !w-6 !rounded-full">
                      <CategoryIcon category={t.category} className="h-3.5 w-3.5" />
                    </span>
                    {t.shortName}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Second copy makes the loop seamless. It is a visual duplicate
                only, so it is hidden from assistive tech and the tab order. */}
            <ul className="flex shrink-0 gap-3" aria-hidden data-dup>
              {tools.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/${t.slug}`}
                    tabIndex={-1}
                    data-cat={t.category}
                    className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-surface py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink-700 shadow-xs"
                  >
                    <span aria-hidden className="tile !h-6 !w-6 !rounded-full">
                      <CategoryIcon category={t.category} className="h-3.5 w-3.5" />
                    </span>
                    {t.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <RecentTools stubs={stubs} />

      {/* ------------------------------------------------------------ Popular */}
      <section aria-labelledby="popular-heading" className="container-site py-16">
        <SectionHeading
          id="popular-heading"
          eyebrow="Most used"
          title="The tools everyone reaches for"
          description="The conversions people run most often, across every category."
          href="/tools"
          linkLabel={`Browse all ${tools.length}`}
        />
        <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((t) => (
            <ToolCard key={t.slug} tool={t} showCategory />
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- Categories */}
      <section aria-labelledby="categories-heading" className="border-y border-ink-100 bg-subtle">
        <div className="container-site py-16">
          <SectionHeading
            id="categories-heading"
            eyebrow="Collections"
            title="Browse by category"
            description="Four focused collections covering images, documents, text and everyday development work."
          />
          <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const catTools = getToolsByCategory(cat.id);
              return (
                <Link
                  key={cat.id}
                  href={`/${cat.id}`}
                  data-cat={cat.id}
                  className="card-interactive group flex flex-col"
                >
                  <span aria-hidden className="tile mb-5 !h-14 !w-14 !rounded-2xl">
                    <CategoryIcon category={cat.id} className="h-7 w-7" />
                  </span>
                  <h3 className="text-lg font-bold text-ink-900">{cat.name}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
                    {cat.intro}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                    {catTools.length} tools
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- How it works */}
      <section aria-labelledby="how-heading" className="container-site py-16">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="Three steps, zero uploads"
          description="From file to finished result in a few seconds — entirely inside your browser tab."
        />
        <ol className="reveal relative grid gap-4 md:grid-cols-3">
          {steps.map(({ Icon, cat, title, body }, i) => (
            <li
              key={title}
              data-cat={cat}
              className="card-interactive relative flex flex-col overflow-hidden"
            >
              <span
                aria-hidden
                className="text-gradient absolute right-4 top-1 select-none text-7xl font-black leading-none opacity-25"
                style={{ backgroundImage: "linear-gradient(135deg, rgb(var(--c1)), rgb(var(--c2)))" }}
              >
                {i + 1}
              </span>
              <span aria-hidden className="tile mb-5">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-ink-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------- Per-category tools */}
      {categories.map((cat, idx) => {
        const catTools = getToolsByCategory(cat.id);
        return (
          <section
            key={cat.id}
            aria-labelledby={`${cat.id}-heading`}
            data-cat={cat.id}
            className={`border-t border-ink-100 py-14 ${idx % 2 === 0 ? "bg-subtle" : ""}`}
          >
            <div className="container-site">
              <SectionHeading
                id={`${cat.id}-heading`}
                title={cat.name}
                description={cat.intro}
                href={`/${cat.id}`}
                linkLabel={`All ${catTools.length} tools`}
              />
              <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catTools.slice(0, 6).map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* -------------------------------------------------------- Privacy/why */}
      <section aria-labelledby="why-heading" className="border-y border-ink-100 bg-subtle">
        <div className="container-site py-16">
          <SectionHeading
            id="why-heading"
            eyebrow="Privacy first"
            title="Why browser-based matters"
            description="Most online converters upload your file to a server you know nothing about. These tools do not have a server to upload to."
          />
          <div className="reveal">
            <TrustBar />
          </div>

          <div className="settings mt-10 !p-6 sm:!p-8">
            <h3 className="text-lg font-bold text-ink-900">How to verify this yourself</h3>
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
      <section aria-labelledby="blog-heading" className="container-site py-16">
        <SectionHeading
          id="blog-heading"
          eyebrow="Learn"
          title="Guides &amp; articles"
          description="Practical walkthroughs for common file and document problems."
          href="/blog"
          linkLabel="All articles"
        />
        <div className="reveal grid gap-4 sm:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-interactive group flex flex-col"
            >
              <time dateTime={post.publishedAt} className="text-xs font-semibold text-accent-700">
                {formatDate(post.publishedAt)}
              </time>
              <h3 className="mt-2 text-base font-bold leading-snug text-ink-900">{post.title}</h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                Read more
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className="container-site pb-20">
        <div className="mx-auto max-w-3xl">
          <FAQ faqs={homeFaqs} headingId="home-faq-heading" />
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import ToolSearch from "@/components/common/ToolSearch";
import ToolCard from "@/components/common/ToolCard";
import JsonLd from "@/components/common/JsonLd";
import { categories } from "@/lib/tools/categories";
import { buildSearchIndex, getPopularTools, getToolsByCategory, tools } from "@/lib/tools/registry";
import { pageMetadata, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { getSortedPosts } from "@/lib/blog/posts";

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
];

export default function HomePage() {
  const popular = getPopularTools();
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-site py-14 sm:py-20">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Free Online File Converter &amp; Document Tools
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-700">
            Convert images, edit PDFs, clean up text and format data — {tools.length} free tools that run
            entirely in your browser. No uploads, no sign-up, no watermarks.
          </p>
          <div className="mt-6 max-w-xl">
            <ToolSearch index={buildSearchIndex()} large />
          </div>
        </div>
      </section>

      <section aria-labelledby="popular-heading" className="container-site py-10">
        <h2 id="popular-heading" className="text-2xl font-semibold">Popular tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      {categories.map((cat) => {
        const catTools = getToolsByCategory(cat.id);
        return (
          <section key={cat.id} aria-labelledby={`${cat.id}-heading`} className="container-site py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`${cat.id}-heading`} className="text-2xl font-semibold">
                {cat.name}
              </h2>
              <Link href={`/${cat.id}`} className="text-sm font-medium text-accent-700 hover:underline">
                View all {catTools.length} tools →
              </Link>
            </div>
            <p className="mt-1 max-w-2xl text-ink-700">{cat.intro}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catTools.slice(0, 6).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        );
      })}

      <section aria-labelledby="why-heading" className="border-t border-ink-100 bg-ink-50">
        <div className="container-site py-12">
          <h2 id="why-heading" className="text-2xl font-semibold">Why use these tools?</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-semibold">Private by design</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                Your files are processed by your own browser and never uploaded anywhere. There is no
                server that could store, scan or leak your documents — the processing code runs on your
                device and works even on sensitive files like contracts or ID scans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Fast and free</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                No upload and download round-trips means results in seconds, even for large files. Every
                tool is completely free — no accounts, trials, watermarks or artificial limits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Works everywhere</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                The tools run in any modern browser on Windows, macOS, Linux, Android and iOS. Nothing to
                install and nothing to update.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="blog-heading" className="container-site py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="blog-heading" className="text-2xl font-semibold">From the blog</h2>
          <Link href="/blog" className="text-sm font-medium text-accent-700 hover:underline">
            View all posts →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {getSortedPosts().slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card flex flex-col gap-1.5 transition-colors hover:border-accent-600"
            >
              <span className="font-medium text-ink-900">{post.title}</span>
              <span className="line-clamp-3 text-sm text-ink-500">{post.excerpt}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-faq-heading" className="container-site py-12">
        <h2 id="home-faq-heading" className="text-2xl font-semibold">Frequently asked questions</h2>
        <dl className="mt-4 divide-y divide-ink-100 border-y border-ink-100">
          {homeFaqs.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-700">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

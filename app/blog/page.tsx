import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import JsonLd from "@/components/common/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getSortedPosts } from "@/lib/blog/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/blog",
  `Blog — Guides for File Conversion & Document Tasks | ${site.name}`,
  "Practical, step-by-step guides for common file conversion, PDF and document tasks — how to merge, compress and convert files without uploading them anywhere."
);

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogIndexPage() {
  const posts = getSortedPosts();
  return (
    <div className="container-site max-w-3xl py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-ink-700">
        Practical guides for common file conversion and document tasks — the how and why behind
        working with files privately, in your browser.
      </p>
      <div className="mt-8 divide-y divide-ink-100 border-y border-ink-100">
        {posts.map((post) => (
          <article key={post.slug} className="py-6">
            <p className="text-xs text-ink-500">{formatDate(post.publishedAt)}</p>
            <h2 className="mt-1 text-xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent-700 hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-2 inline-block text-sm font-medium text-accent-700 hover:underline"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

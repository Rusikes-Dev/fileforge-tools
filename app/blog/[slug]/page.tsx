import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import JsonLd from "@/components/common/JsonLd";
import RelatedTools from "@/components/common/RelatedTools";
import AdSlot from "@/components/common/AdSlot";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getAllPostSlugs, getPost } from "@/lib/blog/posts";
import { getTool } from "@/lib/tools/registry";
import type { ToolDef } from "@/lib/tools/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return pageMetadata(`/blog/${post.slug}`, post.title, post.description);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];
  const relatedTools = post.relatedTools
    .map((slug) => getTool(slug))
    .filter((t): t is ToolDef => Boolean(t));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          articleJsonLd({
            title: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            publishedAt: post.publishedAt,
          }),
        ]}
      />
      <article className="container-site max-w-3xl py-8">
        <Breadcrumbs crumbs={crumbs} />
        <p className="mt-4 text-xs text-ink-500">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{post.title}</h1>

        <div className="prose mt-6 space-y-4">
          {post.intro.map((p) => (
            <p key={p.slice(0, 40)} className="text-ink-700 leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <AdSlot slot="content" />

        {post.sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <div className="mt-3 space-y-4">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12">
          <RelatedTools tools={relatedTools} />
        </div>
      </article>
    </>
  );
}

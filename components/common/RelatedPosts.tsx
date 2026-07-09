import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-xl font-semibold">
        Related reading
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card flex flex-col gap-1.5 transition-colors hover:border-accent-600"
          >
            <span className="text-xs text-ink-500">{formatDate(post.publishedAt)}</span>
            <span className="font-medium text-ink-900">{post.title}</span>
            <span className="line-clamp-2 text-sm text-ink-500">{post.excerpt}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

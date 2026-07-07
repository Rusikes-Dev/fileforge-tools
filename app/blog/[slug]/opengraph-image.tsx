import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { getAllPostSlugs, getPost } from "@/lib/blog/posts";

export const alt = "FileForge Tools Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  const title = post?.title ?? site.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#171a1c",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "8px 20px",
            borderRadius: 999,
            background: "#0e7a63",
            color: "white",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          FileForge Tools Blog
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}

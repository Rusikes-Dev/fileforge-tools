import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { getTool, tools } from "@/lib/tools/registry";

export const alt = "Free browser-based file tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const categoryLabels: Record<string, string> = {
  "image-tools": "Image Tool",
  "pdf-tools": "PDF Tool",
  "text-tools": "Text Tool",
  "developer-tools": "Developer Tool",
};

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  const label = tool ? categoryLabels[tool.category] ?? "Free Tool" : "Free Tool";
  const name = tool?.shortName ?? site.shortName;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b614f",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 10,
              background: "white",
              color: "#0b614f",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "white" }}>
            {site.shortName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 20px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.15)",
              color: "#d5f4ea",
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            {label}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {name}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 28, color: "#d5f4ea" }}>
            Free · Runs in your browser · No upload required
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

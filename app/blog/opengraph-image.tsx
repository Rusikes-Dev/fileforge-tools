import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "FileForge Tools Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f6f7f8",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 12,
              background: "#0b614f",
              color: "white",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: "#3a4145" }}>
            {site.shortName}
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 76, fontWeight: 700, color: "#171a1c" }}>
          Blog
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "#3a4145", maxWidth: 880 }}>
          Practical guides for file conversion and document tasks — done privately, in your browser.
        </div>
      </div>
    ),
    { ...size }
  );
}

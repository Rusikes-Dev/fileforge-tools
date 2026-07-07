import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name;
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
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, color: "#171a1c" }}>
            {site.shortName}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 64,
            fontWeight: 700,
            color: "#171a1c",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Free Online File Converter &amp; Document Tools
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#3a4145", maxWidth: 900 }}>
          Convert, compress and edit files entirely in your browser — no uploads, no sign-up.
        </div>
        <div style={{ display: "flex", marginTop: 44, gap: 16 }}>
          {["Image Tools", "PDF Tools", "Text Tools", "Developer Tools"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                background: "#d5f4ea",
                color: "#0a4d40",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

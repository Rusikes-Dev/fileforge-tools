"use client";

import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../ErrorMessage";
import { DownloadIcon } from "@/components/common/Icon";
import Field from "@/components/ui/Field";
import Segmented from "@/components/ui/Segmented";
import { downloadBlob } from "@/lib/utils";

type EcLevel = "L" | "M" | "Q" | "H";
type Size = "200" | "300" | "500" | "1000";

export default function QrTool() {
  const [text, setText] = useState("");
  const [size, setSize] = useState<Size>("300");
  const [ec, setEc] = useState<EcLevel>("M");
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCode, setHasCode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      setError(null);
      if (!text.trim() || !canvasRef.current) {
        setHasCode(false);
        return;
      }
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled) return;
        await QRCode.toCanvas(canvasRef.current, text, {
          width: Number(size),
          errorCorrectionLevel: ec,
          margin: 2,
        });
        setHasCode(true);
      } catch (err) {
        setHasCode(false);
        setError(
          err instanceof Error && /too long|big/i.test(err.message)
            ? "This content is too long for a QR code at this error-correction level. Shorten it or lower the level."
            : "The QR code could not be generated."
        );
      }
    }
    render();
    return () => { cancelled = true; };
  }, [text, size, ec]);

  async function downloadPng() {
    canvasRef.current?.toBlob((blob) => {
      if (blob) downloadBlob(blob, "qr-code.png");
    }, "image/png");
  }

  async function downloadSvg() {
    const QRCode = (await import("qrcode")).default;
    const svg = await QRCode.toString(text, { type: "svg", errorCorrectionLevel: ec, margin: 2 });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg");
  }

  const label = text.length > 80 ? `${text.slice(0, 80)}…` : text;

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="qr-text" className="label-base">
          Content
        </label>
        <textarea
          id="qr-text"
          className="input-base h-24"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com — or any text"
        />
      </div>

      <div className="settings flex flex-wrap items-start gap-x-8 gap-y-5">
        <Field label="Size">
          <Segmented
            label="Size"
            value={size}
            onChange={setSize}
            options={[
              { value: "200", label: "200 px" },
              { value: "300", label: "300 px" },
              { value: "500", label: "500 px" },
              { value: "1000", label: "1000 px" },
            ]}
          />
        </Field>
        <Field label="Error correction" hint="Higher levels survive more damage but need a denser code.">
          <Segmented
            label="Error correction"
            value={ec}
            onChange={setEc}
            options={[
              { value: "L", label: "L · 7%", description: "7 percent recovery" },
              { value: "M", label: "M · 15%", description: "15 percent recovery, recommended" },
              { value: "Q", label: "Q · 25%", description: "25 percent recovery" },
              { value: "H", label: "H · 30%", description: "30 percent recovery" },
            ]}
          />
        </Field>
      </div>

      <ErrorMessage message={error} />

      {/* The canvas must stay mounted so QRCode can draw into it. */}
      <div
        className={
          hasCode
            ? "animate-pop-in inline-block max-w-full rounded-3xl border border-ink-100 bg-white p-4 shadow-lg"
            : "hidden"
        }
      >
        <canvas ref={canvasRef} role="img" aria-label={`QR code containing: ${label}`} className="h-auto max-w-full" />
      </div>

      {hasCode && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={downloadPng}>
            <DownloadIcon className="h-4 w-4" />
            Download PNG
          </button>
          <button type="button" className="btn-secondary" onClick={downloadSvg}>
            <DownloadIcon className="h-4 w-4" />
            Download SVG
          </button>
        </div>
      )}
    </div>
  );
}

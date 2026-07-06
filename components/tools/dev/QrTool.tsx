"use client";

import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../ErrorMessage";
import { downloadBlob } from "@/lib/utils";

type EcLevel = "L" | "M" | "Q" | "H";

export default function QrTool() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
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
          width: size,
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

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Content</span>
        <textarea className="input-base h-24" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com — or any text" />
      </label>
      <div className="flex flex-wrap items-end gap-4 text-sm">
        <label>
          <span className="mb-1 block font-medium">Size</span>
          <select className="input-base w-auto" value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value={200}>200 px</option>
            <option value={300}>300 px</option>
            <option value={500}>500 px</option>
            <option value={1000}>1000 px</option>
          </select>
        </label>
        <label>
          <span className="mb-1 block font-medium">Error correction</span>
          <select className="input-base w-auto" value={ec} onChange={(e) => setEc(e.target.value as EcLevel)}>
            <option value="L">L — 7%</option>
            <option value="M">M — 15% (recommended)</option>
            <option value="Q">Q — 25%</option>
            <option value="H">H — 30%</option>
          </select>
        </label>
      </div>
      <ErrorMessage message={error} />
      <div className={hasCode ? "inline-block rounded border border-ink-100 p-3" : "hidden"}>
        <canvas ref={canvasRef} aria-label={`QR code containing: ${text}`} className="max-w-full" />
      </div>
      {hasCode && (
        <div className="flex gap-2">
          <button type="button" className="btn-primary" onClick={downloadPng}>
            Download PNG
          </button>
          <button type="button" className="btn-secondary" onClick={downloadSvg}>
            Download SVG
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import ErrorMessage from "../ErrorMessage";
import { downloadBlob, formatBytes } from "@/lib/utils";

function detectMime(bytes: Uint8Array): { mime: string; ext: string } | null {
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return { mime: "image/png", ext: "png" };
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return { mime: "image/jpeg", ext: "jpg" };
  if (bytes[0] === 0x47 && bytes[1] === 0x49) return { mime: "image/gif", ext: "gif" };
  if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42) return { mime: "image/webp", ext: "webp" };
  return null;
}

export default function Base64ToImageTool() {
  const [input, setInput] = useState("");

  const parsed = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    let b64 = trimmed;
    const uriMatch = trimmed.match(/^data:image\/[a-z+]+;base64,(.+)$/is);
    if (uriMatch) b64 = uriMatch[1];
    b64 = b64.replace(/\s+/g, "");
    if (/%2B|%2F|%3D/i.test(b64)) {
      return { error: "This looks URL-encoded (%2B, %2F). Decode it with the URL Decoder first, then paste it here." };
    }
    if (!/^[A-Za-z0-9+/]+=*$/.test(b64)) {
      return { error: "The input contains characters that are not valid Base64. Check that the string was copied completely." };
    }
    try {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const kind = detectMime(bytes);
      if (!kind) {
        return { error: "The data decoded, but it doesn't look like a PNG, JPG, GIF or WebP image." };
      }
      const blob = new Blob([bytes], { type: kind.mime });
      return { blob, ...kind, size: bytes.length, dataUri: `data:${kind.mime};base64,${b64}` };
    } catch {
      return { error: "The Base64 string could not be decoded — it may be truncated." };
    }
  }, [input]);

  return (
    <div>
      <label htmlFor="b64-input" className="mb-1 block text-sm font-medium">
        Base64 string or data URI
      </label>
      <textarea
        id="b64-input"
        className="input-base h-40 font-mono text-xs"
        placeholder="data:image/png;base64,iVBORw0KGgo… or the raw Base64"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {parsed && "error" in parsed && <ErrorMessage message={parsed.error ?? null} />}
      {parsed && "blob" in parsed && (
        <div className="mt-4 rounded border border-accent-100 bg-accent-50 p-4" role="status">
          <p className="text-sm font-medium text-accent-800">
            Detected {parsed.ext.toUpperCase()} — {formatBytes(parsed.size)}
          </p>
          <div className="mt-3 flex items-center justify-center rounded border border-ink-100 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={parsed.dataUri} alt="Decoded preview" className="max-h-64 max-w-full" />
          </div>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => downloadBlob(parsed.blob, `decoded-image.${parsed.ext}`)}
          >
            Download image
          </button>
        </div>
      )}
    </div>
  );
}

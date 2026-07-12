"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import ResultCard from "../ResultCard";
import CopyButton from "../CopyButton";
import { OCR_LANGUAGES } from "@/lib/converters/ocr";

export default function ImageToTextTool() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lang, setLang] = useState("eng");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);

  async function addFiles(incoming: File[]) {
    setError(null);
    setText(null);
    const f = incoming[0];
    const { validateOcrImage } = await import("@/lib/converters/ocr");
    const problem = validateOcrImage(f);
    if (problem) return setError(problem);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
    setBusy(true);
    setStatus("Loading recognition model…");
    try {
      const { extractTextFromImage } = await import("@/lib/converters/ocr");
      const result = await extractTextFromImage(f, lang, (statusMsg, progress) => {
        const nice = statusMsg.replace(/_/g, " ");
        setStatus(`${nice.charAt(0).toUpperCase()}${nice.slice(1)}… ${Math.round(progress * 100)}%`);
      });
      setText(result);
      if (!result) {
        setError("No text was detected in this image. Try a clearer, higher-resolution photo of the text.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Text extraction failed.");
    } finally {
      setBusy(false);
      setStatus("");
    }
  }

  return (
    <div>
      <label className="mb-3 block text-sm">
        <span className="mb-1 block font-medium">Language in the image</span>
        <select className="input-base max-w-xs" value={lang} onChange={(e) => setLang(e.target.value)}>
          {OCR_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </label>
      <UploadZone
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        label="Drag and drop an image here"
        hint="A photo or screenshot containing text, up to 20 MB"
        onFiles={addFiles}
      />
      {busy && (
        <p className="mt-3 text-sm text-ink-500" role="status">
          {status || "Processing…"} (first use in this language downloads a small one-time model)
        </p>
      )}
      <ErrorMessage message={error} />
      {previewUrl && text !== null && (
        <ResultCard
          onReset={() => { setText(null); setPreviewUrl(null); }}
          resetLabel="Extract text from another image"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-medium text-ink-500">Image</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Source" className="max-h-64 w-full rounded border border-ink-100 object-contain" />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-ink-500">Extracted text</p>
              <textarea
                readOnly
                value={text}
                className="input-base h-64 w-full resize-none font-mono text-sm"
                placeholder="No text detected."
              />
            </div>
          </div>
          {text && (
            <div className="mt-3">
              <CopyButton text={text} label="Copy extracted text" />
            </div>
          )}
        </ResultCard>
      )}
    </div>
  );
}

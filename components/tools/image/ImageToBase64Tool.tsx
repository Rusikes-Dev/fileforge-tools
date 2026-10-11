"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import CopyButton from "../CopyButton";
import Segmented from "@/components/ui/Segmented";
import { validateImageFile } from "@/lib/converters/image";
import { formatBytes } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
type Flavor = "raw" | "dataUri" | "html" | "css";

export default function ImageToBase64Tool() {
  const [dataUri, setDataUri] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [flavor, setFlavor] = useState<Flavor>("dataUri");
  const [error, setError] = useState<string | null>(null);

  function addFiles(incoming: File[]) {
    const f = incoming[0];
    const problem = validateImageFile(f, ACCEPT);
    if (problem) return setError(problem);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setDataUri(reader.result as string);
      setFileInfo({ name: f.name, size: f.size });
    };
    reader.onerror = () => setError("This file could not be read.");
    reader.readAsDataURL(f);
  }

  function clear() {
    setDataUri(null);
    setFileInfo(null);
    setError(null);
  }

  const output = (() => {
    if (!dataUri) return "";
    switch (flavor) {
      case "raw": return dataUri.split(",")[1] ?? "";
      case "dataUri": return dataUri;
      case "html": return `<img src="${dataUri}" alt="" />`;
      case "css": return `background-image: url("${dataUri}");`;
    }
  })();

  return (
    <div>
      <UploadZone
        accept="image/*,.svg"
        label="Drag and drop an image here"
        hint="JPG, PNG, WebP, GIF or SVG, up to 25 MB (small images recommended)"
        onFiles={addFiles}
      />
      <ErrorMessage message={error} />
      {dataUri && fileInfo && (
        <div className="settings animate-fade-in-up mt-6 space-y-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUri}
              alt="Preview of the uploaded image"
              className="h-14 w-14 shrink-0 rounded-xl border border-ink-100 bg-surface object-cover"
            />
            <p className="min-w-0 flex-1 text-sm text-ink-700">
              <span className="block truncate font-semibold text-ink-900">{fileInfo.name}</span>
              {formatBytes(fileInfo.size)} · encoded length{" "}
              <span className="font-mono">{output.length.toLocaleString()} characters</span>
            </p>
            <button type="button" className="btn-ghost btn-sm" onClick={clear}>
              Clear
            </button>
          </div>

          <Segmented
            label="Output format"
            value={flavor}
            onChange={setFlavor}
            options={[
              { value: "raw", label: "Raw Base64" },
              { value: "dataUri", label: "Data URI" },
              { value: "html", label: "HTML <img>" },
              { value: "css", label: "CSS rule" },
            ]}
          />

          <textarea
            readOnly
            aria-label="Base64 output"
            className="input-base h-40 font-mono text-xs"
            value={output.length > 200_000 ? `${output.slice(0, 200_000)}… (truncated preview — Copy includes the full value)` : output}
          />
          <CopyButton text={output} label="Copy to clipboard" className="btn-primary" />
        </div>
      )}
    </div>
  );
}

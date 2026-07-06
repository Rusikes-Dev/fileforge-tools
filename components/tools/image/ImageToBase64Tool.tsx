"use client";

import { useState } from "react";
import UploadZone from "../UploadZone";
import ErrorMessage from "../ErrorMessage";
import CopyButton from "../CopyButton";
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
        <div className="mt-4 space-y-3">
          <p className="text-sm text-ink-700">
            <span className="font-medium">{fileInfo.name}</span> ({formatBytes(fileInfo.size)}) — encoded length:{" "}
            <span className="font-mono">{output.length.toLocaleString()} characters</span>
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Output format">
            {([["raw", "Raw Base64"], ["dataUri", "Data URI"], ["html", "HTML <img>"], ["css", "CSS rule"]] as const).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={value === flavor ? "btn-primary" : "btn-secondary"}
                  aria-pressed={value === flavor}
                  onClick={() => setFlavor(value)}
                >
                  {label}
                </button>
              )
            )}
          </div>
          <textarea
            readOnly
            aria-label="Base64 output"
            className="input-base h-40 font-mono text-xs"
            value={output.length > 200_000 ? `${output.slice(0, 200_000)}… (truncated preview — Copy includes the full value)` : output}
          />
          <CopyButton text={output} label="Copy to clipboard" />
        </div>
      )}
    </div>
  );
}

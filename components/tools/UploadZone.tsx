"use client";

import { useCallback, useId, useRef, useState } from "react";

export default function UploadZone({
  accept,
  multiple = false,
  label,
  hint,
  onFiles,
}: {
  /** value for the input's accept attribute, e.g. "image/jpeg,.jpg" */
  accept: string;
  multiple?: boolean;
  label: string;
  hint: string;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const inputId = useId();

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFiles(Array.from(list));
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFiles]
  );

  return (
    <div
      className={`rounded border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
        dragging ? "border-accent-600 bg-accent-50" : "border-ink-300 bg-ink-50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <p className="font-medium text-ink-900">{label}</p>
      <p className="mt-1 text-sm text-ink-500">{hint}</p>
      <div className="mt-4">
        <label htmlFor={inputId} className="btn-primary cursor-pointer">
          Choose {multiple ? "files" : "file"}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      <p className="mt-3 text-xs text-ink-500">
        Your files are processed locally in your browser. Nothing is uploaded.
      </p>
    </div>
  );
}

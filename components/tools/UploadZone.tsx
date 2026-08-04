"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { LockIcon, UploadIcon } from "@/components/common/Icon";

export default function UploadZone({
  accept,
  multiple = false,
  label,
  hint,
  onFiles,
  disabled = false,
  /** Enables Ctrl/Cmd+V of an image or file straight into the tool. */
  allowPaste = true,
}: {
  /** value for the input's accept attribute, e.g. "image/jpeg,.jpg" */
  accept: string;
  multiple?: boolean;
  label: string;
  hint: string;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  allowPaste?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const inputId = useId();

  // A drag entering a child element fires `dragleave` on the parent, so a
  // simple boolean flickers the highlight on and off as the pointer crosses the
  // inner text and button. Counting enter/leave pairs tracks the real state.
  const dragDepth = useRef(0);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const files = Array.from(list);
      // Guard against a multi-file drop on a single-file tool.
      onFiles(multiple ? files : files.slice(0, 1));
      // Reset so re-selecting the same file still fires `change`.
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFiles, multiple]
  );

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  // Paste-to-upload. Scoped to the document but ignores pastes aimed at a text
  // field so it can't hijack typing in another input on the page.
  useEffect(() => {
    if (!allowPaste || disabled) return;

    function onPaste(e: ClipboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      const data = e.clipboardData;
      if (!data || data.files.length === 0) return;
      e.preventDefault();
      handleFiles(data.files);
    }

    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [allowPaste, disabled, handleFiles]);

  const active = dragging && !disabled;

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        if (disabled) return;
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(e) => {
        // Required for `drop` to fire at all.
        e.preventDefault();
        if (!disabled) e.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={`group relative overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ease-out sm:py-14 ${
        active
          ? "border-accent-600 bg-accent-50 shadow-md"
          : "border-ink-300 bg-ink-50 hover:border-ink-500 hover:bg-subtle"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <div
        aria-hidden
        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-200 ${
          active
            ? "-translate-y-0.5 border-accent-600 bg-surface text-accent-700 shadow-sm"
            : "border-ink-100 bg-surface text-ink-500 shadow-xs group-hover:text-ink-700"
        }`}
      >
        <UploadIcon className={`h-5 w-5 transition-transform ${active ? "-translate-y-0.5" : ""}`} />
      </div>

      <p className="text-base font-semibold text-ink-900">{active ? "Drop to add" : label}</p>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">{hint}</p>

      <div className="mt-5">
        {/*
          The file input is visually hidden but must stay out of the tab order:
          a focusable invisible control strands keyboard users on an element
          they cannot see. This button is the real, visible control.
        */}
        <button type="button" className="btn-primary" onClick={openPicker} disabled={disabled}>
          Choose {multiple ? "files" : "file"}
        </button>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <p className="mt-4 text-xs text-ink-500">
        or drag &amp; drop{allowPaste ? " · or paste from clipboard" : ""}
      </p>

      <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
        <LockIcon className="h-3.5 w-3.5" />
        Processed on your device — nothing is uploaded
      </p>
    </div>
  );
}

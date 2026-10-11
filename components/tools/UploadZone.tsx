"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LockIcon, UploadIcon } from "@/components/common/Icon";

/** True when a drag carries files (as opposed to selected text or a link). */
function carriesFiles(e: DragEvent): boolean {
  return Array.from(e.dataTransfer?.types ?? []).includes("Files");
}

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

  // A drag entering a child element fires `dragleave` on the parent, so a
  // simple boolean flickers the highlight as the pointer crosses inner
  // elements. Counting enter/leave pairs tracks the real state.
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

  // Drag & drop is handled at window level on purpose:
  //  1. Dropping a file *anywhere* on the page adds it, not just on the dashed
  //     box — so a slightly-off drop works instead of being ignored.
  //  2. Browsers navigate to (and so unload) a file dropped on a page that
  //     doesn't cancel the event. Cancelling it here means a stray drop can
  //     never throw away the tool the person was using.
  useEffect(() => {
    function onEnter(e: DragEvent) {
      if (!carriesFiles(e)) return;
      e.preventDefault();
      dragDepth.current += 1;
      if (!disabled) setDragging(true);
    }
    function onOver(e: DragEvent) {
      if (!carriesFiles(e)) return;
      // Required for `drop` to fire at all.
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = disabled ? "none" : "copy";
    }
    function onLeave(e: DragEvent) {
      if (!carriesFiles(e)) return;
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setDragging(false);
    }
    function onDrop(e: DragEvent) {
      if (!carriesFiles(e)) return;
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      if (!disabled) handleFiles(e.dataTransfer?.files ?? null);
    }
    function reset() {
      dragDepth.current = 0;
      setDragging(false);
    }

    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragover", onOver);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragend", reset);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragend", reset);
    };
  }, [disabled, handleFiles]);

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
      data-active={active || undefined}
      data-disabled={disabled || undefined}
      // The whole box is a click target for mouse users; keyboard users get the
      // real button below, so this is a convenience rather than the only path.
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button, a, input, label")) return;
        openPicker();
      }}
      className="dropzone cursor-pointer px-6 py-10 text-center sm:py-14"
    >
      <div aria-hidden className="dz-icon">
        <UploadIcon className="h-6 w-6" />
      </div>

      <p className="text-lg font-semibold text-ink-900">{active ? "Drop to add" : label}</p>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">{hint}</p>

      <div className="mt-6">
        {/*
          The file input is visually hidden but must stay out of the tab order:
          a focusable invisible control strands keyboard users on an element
          they cannot see. This button is the real, visible control.
        */}
        <button type="button" className="btn-primary btn-lg" onClick={openPicker} disabled={disabled}>
          <UploadIcon className="h-4 w-4" />
          Choose {multiple ? "files" : "file"}
        </button>
        <input
          ref={inputRef}
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
        or drag &amp; drop anywhere on the page{allowPaste ? " · or paste from clipboard" : ""}
      </p>

      <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent-100 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-800">
        <LockIcon className="h-3.5 w-3.5" />
        Processed on your device — nothing is uploaded
      </p>
    </div>
  );
}

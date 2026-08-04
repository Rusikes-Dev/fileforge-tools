"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import ToolSearch from "@/components/common/ToolSearch";
import type { SearchEntry } from "@/lib/tools/registry";
import { SearchIcon } from "@/components/common/Icon";

/**
 * A ⌘K / Ctrl+K launcher for the tool index.
 *
 * Rendered from the header so it is reachable from every page. The dialog owns
 * focus while open and restores it to the trigger on close, which keyboard and
 * screen reader users depend on to avoid being dropped at the top of the
 * document after dismissing it.
 */
export default function CommandPalette({ index }: { index: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent));
  }, []);

  // Global shortcut. Ignored while the user is typing in a field so it can't
  // steal a genuine Ctrl+K (e.g. a browser or extension binding) mid-edit.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        const el = document.activeElement as HTMLElement | null;
        const typing =
          el &&
          (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
        if (typing) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll while the overlay is up, and restore focus on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    // Captured now: by the time cleanup runs the ref may point elsewhere.
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, [open]);

  // Minimal focus trap: keep Tab cycling inside the dialog.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search tools"
        aria-haspopup="dialog"
        className="btn-secondary hidden gap-2 pr-2 text-ink-500 sm:inline-flex"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden lg:inline">Search tools</span>
        <kbd
          aria-hidden
          className="ml-1 hidden rounded border border-ink-300 bg-ink-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-500 lg:inline-block"
        >
          {isMac ? "⌘" : "Ctrl"}K
        </kbd>
      </button>

      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-[70] flex items-start justify-center bg-ink-900/40 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search tools"
            className="animate-scale-in w-full max-w-xl rounded-2xl border border-ink-100 bg-surface p-3 shadow-lg"
          >
            <Suspense fallback={<div className="skeleton h-12 w-full" />}>
              <ToolSearch index={index} large autoFocus onNavigate={close} />
            </Suspense>
            <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 pb-1 text-xs text-ink-500">
              <span>
                <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd> to navigate
              </span>
              <span>
                <kbd className="font-mono">↵</kbd> to open
              </span>
              <span>
                <kbd className="font-mono">esc</kbd> to close
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

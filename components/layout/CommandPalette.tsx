"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ToolSearch from "@/components/common/ToolSearch";
import type { SearchEntry } from "@/lib/tools/registry";
import { CategoryIcon, SearchIcon } from "@/components/common/Icon";

const browse = [
  { name: "Image", href: "/image-tools", category: "image-tools" },
  { name: "PDF", href: "/pdf-tools", category: "pdf-tools" },
  { name: "Text", href: "/text-tools", category: "text-tools" },
  { name: "Developer", href: "/developer-tools", category: "developer-tools" },
] as const;

/**
 * A ⌘K / Ctrl+K launcher for the tool index.
 *
 * Rendered from the header so it is reachable from every page. The dialog owns
 * focus while open and restores it to the trigger on close, which keyboard and
 * screen reader users depend on to avoid being dropped at the top of the
 * document after dismissing it.
 *
 * The overlay is rendered through a portal into <body>. The header uses
 * `backdrop-filter`, and any ancestor with a backdrop filter becomes the
 * containing block for `position: fixed` descendants — so an overlay rendered
 * *inside* the header was clipped to the header's 64px strip instead of
 * covering the viewport (no dimming, results spilling out of the card, outside
 * clicks not registering).
 */
export default function CommandPalette({ index }: { index: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  // Mirrors `open` for the window-level key handler, which must decide
  // synchronously whether this Escape press belongs to the palette.
  const openRef = useRef(false);
  openRef.current = open;
  const dialogRef = useRef<HTMLDivElement>(null);
  // Whichever trigger opened the palette (icon on phones, pill on larger
  // screens, or the keyboard shortcut) gets focus back on close.
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const desktopTrigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent));
  }, []);

  const openFrom = useCallback((el: HTMLElement | null) => {
    returnFocusTo.current = el;
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

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
        if (!openRef.current) {
          returnFocusTo.current =
            desktopTrigger.current && desktopTrigger.current.offsetParent !== null
              ? desktopTrigger.current
              : mobileTrigger.current;
        }
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && openRef.current) {
        // Mark it handled so other Escape listeners (e.g. the cookie banner)
        // know this keypress was spent closing the palette.
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock body scroll while the overlay is up, and restore focus on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      returnFocusTo.current?.focus();
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

  const overlay = (
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-900/50 px-3 pt-[8vh] backdrop-blur-sm sm:px-4 sm:pt-[12vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
        className="animate-pop-in relative w-full max-w-xl rounded-3xl border border-ink-100 bg-surface p-3 shadow-lg"
      >
        {/* Aurora glow behind the card. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px -z-10 rounded-[1.6rem] bg-gradient-to-br from-[rgb(var(--aurora-1)/0.55)] via-[rgb(var(--aurora-2)/0.35)] to-[rgb(var(--aurora-3)/0.55)] blur-xl"
        />
        <Suspense fallback={<div className="skeleton h-14 w-full" />}>
          <ToolSearch index={index} large autoFocus onNavigate={close} />
        </Suspense>

        <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs font-medium text-ink-500">Browse</span>
          {browse.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              data-cat={b.category}
              onClick={close}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-ink-50 py-1 pl-1 pr-3 text-xs font-semibold text-ink-700 transition-colors hover:border-line hover:bg-surface hover:text-ink-900"
            >
              <span aria-hidden className="tile !h-5 !w-5 !rounded-full">
                <CategoryIcon category={b.category} className="h-3 w-3" />
              </span>
              {b.name}
            </Link>
          ))}
        </div>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-ink-100 px-1 pt-3 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd> navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="kbd">↵</kbd> open
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="kbd">esc</kbd> close
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Phones: compact icon button, so search is reachable on every page. */}
      <button
        ref={mobileTrigger}
        type="button"
        onClick={(e) => openFrom(e.currentTarget)}
        aria-label="Search tools"
        aria-haspopup="dialog"
        className="btn-secondary btn-icon sm:hidden"
      >
        <SearchIcon className="h-[18px] w-[18px]" />
      </button>

      {/* Larger screens: labelled pill with the shortcut. */}
      <button
        ref={desktopTrigger}
        type="button"
        onClick={(e) => openFrom(e.currentTarget)}
        // No aria-label here on purpose: the name comes from the visible text, so
        // it can never disagree with it (WCAG 2.5.3). The text is visually
        // hidden below `lg`, where only the icon shows, but stays in the name.
        aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
        aria-haspopup="dialog"
        className="btn-secondary hidden gap-2 pr-2.5 text-ink-500 sm:inline-flex"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="sr-only font-medium lg:not-sr-only">Search tools</span>
        <span aria-hidden className="ml-1 hidden items-center gap-1 lg:inline-flex">
          <kbd className="kbd">{isMac ? "⌘" : "Ctrl"}</kbd>
          <kbd className="kbd">K</kbd>
        </span>
      </button>

      {open && typeof document !== "undefined" && createPortal(overlay, document.body)}
    </>
  );
}

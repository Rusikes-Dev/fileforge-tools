"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { onToast, type ToastPayload } from "@/lib/toast";
import { AlertIcon, AnimatedCheckIcon, CloseIcon, InfoIcon } from "./Icon";

const MAX_VISIBLE = 3;

/** Errors stay long enough to read (and can be dismissed); confirmations are brief. */
function durationFor(tone: ToastPayload["tone"]): number {
  return tone === "error" ? 7000 : 2800;
}

const toneStyles: Record<ToastPayload["tone"], string> = {
  success: "border-accent-100 bg-accent-50 text-accent-800",
  error: "border-danger-200 bg-danger-50 text-danger-700",
  info: "border-ink-100 bg-surface text-ink-900",
};

function ToneIcon({ tone }: { tone: ToastPayload["tone"] }) {
  if (tone === "success") return <AnimatedCheckIcon className="h-[18px] w-[18px] shrink-0" />;
  if (tone === "error") return <AlertIcon className="h-[18px] w-[18px] shrink-0" />;
  return <InfoIcon className="h-[18px] w-[18px] shrink-0" />;
}

function ToastItem({ toast, onDone }: { toast: ToastPayload; onDone: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  const duration = durationFor(toast.tone);
  const remaining = useRef(duration);
  const startedAt = useRef(0);

  // Hovering or focusing a toast pauses its countdown (and its progress bar),
  // so a message can be read at leisure instead of vanishing mid-sentence.
  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => onDone(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
    };
  }, [paused, onDone, toast.id]);

  return (
    <div
      role={toast.tone === "error" ? "alert" : "status"}
      className={`animate-pop-in pointer-events-auto relative flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-2xl border py-3 pl-4 pr-2 text-sm font-medium shadow-lg ${
        toneStyles[toast.tone]
      } ${paused ? "toast-paused" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ToneIcon tone={toast.tone} />
      <span className="min-w-0 flex-1 leading-snug">{toast.message}</span>
      <button
        type="button"
        className="btn-ghost btn-sm btn-icon shrink-0 !text-current hover:!bg-black/5 dark:hover:!bg-white/10"
        aria-label="Dismiss notification"
        onClick={() => onDone(toast.id)}
      >
        <CloseIcon className="h-4 w-4" />
      </button>
      <span aria-hidden className="toast-bar" style={{ "--dur": `${duration}ms` } as CSSProperties} />
    </div>
  );
}

/**
 * Renders transient confirmations (copied, downloaded, failed).
 *
 * Layering: toasts sit above everything, including the cookie banner — the old
 * stack (z-60 under the banner's z-65) hid "Copied" feedback on a first visit.
 * The container is also lifted by the banner's height (--consent-h) so a toast
 * never covers the consent buttons either.
 */
export default function Toaster() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(
    () =>
      onToast((payload) => {
        setToasts((prev) =>
          [
            // Repeating the same message (mashing "Copy") replaces it rather
            // than stacking duplicates.
            ...prev.filter((t) => !(t.message === payload.message && t.tone === payload.tone)),
            payload,
          ].slice(-MAX_VISIBLE)
        );
      }),
    []
  );

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      style={{ bottom: "calc(var(--consent-h, 0px) + 1rem)" }}
      className="pointer-events-none fixed inset-x-0 z-[120] flex flex-col items-center gap-2 px-4 sm:!bottom-[calc(var(--consent-h,0px)+1.5rem)]"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDone={dismiss} />
      ))}
    </div>
  );
}

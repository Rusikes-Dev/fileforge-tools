"use client";

import { useEffect, useState } from "react";
import { onToast, type ToastPayload } from "@/lib/toast";
import { AlertIcon, AnimatedCheckIcon, InfoIcon } from "./Icon";

const DURATION = 2600;

const toneStyles: Record<ToastPayload["tone"], string> = {
  success: "border-accent-100 bg-accent-50 text-accent-800",
  error: "border-danger-200 bg-danger-50 text-danger-700",
  info: "border-ink-100 bg-surface text-ink-900",
};

function ToneIcon({ tone }: { tone: ToastPayload["tone"] }) {
  if (tone === "success") return <AnimatedCheckIcon className="h-4 w-4 shrink-0" />;
  if (tone === "error") return <AlertIcon className="h-4 w-4 shrink-0" />;
  return <InfoIcon className="h-4 w-4 shrink-0" />;
}

/**
 * Renders transient confirmations (copied, downloaded, failed).
 *
 * The container is an aria-live region so screen reader users get the same
 * confirmation sighted users do — a visual-only "Copied!" is invisible to them.
 * `pointer-events-none` on the stack keeps toasts from blocking clicks on the
 * page beneath while they fade.
 */
export default function Toaster() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  useEffect(() => {
    const timers = new Map<number, ReturnType<typeof setTimeout>>();

    const unsubscribe = onToast((payload) => {
      setToasts((prev) => [...prev.slice(-2), payload]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== payload.id));
        timers.delete(payload.id);
      }, DURATION);
      timers.set(payload.id, timer);
    });

    return () => {
      unsubscribe();
      // Without this, a pending timer fires after unmount and sets state on a
      // dead component.
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`animate-slide-in-up pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium shadow-lg ${toneStyles[t.tone]}`}
        >
          <ToneIcon tone={t.tone} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

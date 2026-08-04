"use client";

import type { ReactNode } from "react";
import { AnimatedCheckIcon } from "@/components/common/Icon";

export default function ResultCard({
  children,
  onReset,
  resetLabel = "Convert another file",
  title = "Done",
}: {
  children: ReactNode;
  onReset: () => void;
  resetLabel?: string;
  title?: string;
}) {
  return (
    <div
      className="animate-fade-in-up mt-5 overflow-hidden rounded-2xl border border-accent-100 bg-accent-50 shadow-xs"
      role="status"
    >
      <div className="flex items-center gap-2 border-b border-accent-100 px-4 py-2.5 sm:px-5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-600 text-white">
          <AnimatedCheckIcon className="h-3.5 w-3.5" />
        </span>
        <p className="text-sm font-semibold text-accent-800">{title}</p>
      </div>
      <div className="p-4 sm:p-5">
        {children}
        <button type="button" className="btn-secondary mt-4" onClick={onReset}>
          {resetLabel}
        </button>
      </div>
    </div>
  );
}

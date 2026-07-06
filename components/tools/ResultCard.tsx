"use client";

import type { ReactNode } from "react";

export default function ResultCard({
  children,
  onReset,
  resetLabel = "Convert another file",
}: {
  children: ReactNode;
  onReset: () => void;
  resetLabel?: string;
}) {
  return (
    <div className="mt-4 rounded border border-accent-100 bg-accent-50 p-4" role="status">
      {children}
      <button type="button" className="btn-secondary mt-3" onClick={onReset}>
        {resetLabel}
      </button>
    </div>
  );
}

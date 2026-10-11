import type { CSSProperties } from "react";

/**
 * Gradient progress bar. Pass `value` (0–100) for determinate progress, or
 * `indeterminate` when the amount of work isn't known up front.
 */
export default function Progress({
  value = 0,
  indeterminate = false,
  label,
  className = "",
}: {
  value?: number;
  indeterminate?: boolean;
  label: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`progress ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      data-indeterminate={indeterminate || undefined}
    >
      <i style={{ "--v": `${pct}%` } as CSSProperties} />
    </div>
  );
}

import type { ReactNode } from "react";

/**
 * Label + control + hint, laid out the same way in every tool. `value` shows a
 * live read-out (e.g. "85%") on the right of the label.
 */
export default function Field({
  label,
  htmlFor,
  value,
  hint,
  children,
  className = "",
}: {
  label: string;
  /** Id of the control this labels. Omit for composite controls that carry their own aria-label. */
  htmlFor?: string;
  value?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-sm font-semibold text-ink-900">
            {label}
          </label>
        ) : (
          <span className="text-sm font-semibold text-ink-900">{label}</span>
        )}
        {value && (
          <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-bold tabular-nums text-accent-800">
            {value}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="hint-text">{hint}</p>}
    </div>
  );
}

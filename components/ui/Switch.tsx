"use client";

import { useId, type ReactNode } from "react";

/** A labelled on/off switch built on a real checkbox (keyboard + AT friendly). */
export default function Switch({
  checked,
  onChange,
  children,
  hint,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
  hint?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="switch mt-0.5"
        checked={checked}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-ink-900">
          {children}
        </label>
        {hint && (
          <p id={hintId} className="hint-text !mt-0.5">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

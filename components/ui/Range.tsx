"use client";

import type { CSSProperties } from "react";

/** Slider whose track fills up to the thumb (the fill is driven by --p). */
export default function Range({
  id,
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  disabled = false,
  valueText,
}: {
  id?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
  /** Human wording for screen readers, e.g. "80 percent". */
  valueText?: string;
}) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      aria-label={label}
      aria-valuetext={valueText}
      style={{ "--p": `${pct}%` } as CSSProperties}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

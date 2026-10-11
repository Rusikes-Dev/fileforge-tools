"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Number input that lets you type.
 *
 * The old pattern — `value={n}` with `onChange` clamping straight away — turned
 * every half-typed value into the nearest legal one: clearing a field snapped it
 * to its minimum, so typing "500" ended up as "3000" or "15". Here the text is
 * the field's own state. A value is reported upward as soon as it is a valid
 * in-range number (so live previews still work), and out-of-range or empty text
 * is only corrected when the user leaves the field or presses Enter.
 */
export default function NumberField({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  integer = true,
  disabled = false,
  className = "input-base",
  label,
  describedBy,
}: {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  integer?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  describedBy?: string;
}) {
  const [text, setText] = useState(String(value));
  const focused = useRef(false);

  // Follow outside changes (aspect-ratio lock, "reset", presets) — but never
  // rewrite the text under the user's cursor while they are typing.
  useEffect(() => {
    if (!focused.current) setText(String(value));
  }, [value]);

  const normalise = (n: number) => (integer ? Math.round(n) : n);

  function handleChange(raw: string) {
    setText(raw);
    if (raw.trim() === "") return;
    const n = Number(raw);
    if (Number.isFinite(n) && n >= min && n <= max) onChange(normalise(n));
  }

  function settle() {
    const n = Number(text);
    if (text.trim() === "" || !Number.isFinite(n)) {
      setText(String(value));
      return;
    }
    const clamped = normalise(Math.min(max, Math.max(min, n)));
    setText(String(clamped));
    if (clamped !== value) onChange(clamped);
  }

  return (
    <input
      id={id}
      type="number"
      inputMode={integer ? "numeric" : "decimal"}
      className={className}
      value={text}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-label={label}
      aria-describedby={describedBy}
      onFocus={() => {
        focused.current = true;
      }}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={() => {
        focused.current = false;
        settle();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") settle();
      }}
    />
  );
}

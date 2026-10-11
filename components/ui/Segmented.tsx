"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Extra context for screen readers when the label alone is terse. */
  description?: string;
}

/**
 * Single-choice control with a gradient thumb that glides to the selection.
 * A proper radiogroup: one tab stop, arrow keys move and select, Home/End jump.
 */
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className = "",
}: {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const groupId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const index = options.findIndex((o) => o.value === value);
    const el = refs.current[index];
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth });
  }, [options, value]);

  useIsoLayoutEffect(measure, [measure]);

  // Labels can re-wrap when fonts load or the viewport changes; re-measure.
  useEffect(() => {
    const group = groupRef.current;
    if (!group || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(group);
    return () => ro.disconnect();
  }, [measure]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = options.findIndex((o) => o.value === value);
    let next = current;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % options.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (current - 1 + options.length) % options.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = options.length - 1;
    else return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      data-ready={thumb ? "true" : undefined}
      className={`segmented ${disabled ? "pointer-events-none opacity-60" : ""} ${className}`}
      onKeyDown={onKeyDown}
    >
      {thumb && (
        <span
          aria-hidden
          className="segmented-thumb"
          style={
            { width: thumb.width, transform: `translateX(${thumb.left}px)` } as CSSProperties
          }
        />
      )}
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            id={`${groupId}-${i}`}
            aria-checked={selected}
            aria-label={opt.description ? `${opt.label} — ${opt.description}` : undefined}
            tabIndex={selected ? 0 : -1}
            disabled={disabled}
            className="segmented-option"
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

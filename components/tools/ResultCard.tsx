"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { AnimatedCheckIcon } from "@/components/common/Icon";

// Fixed (not random) so server and client markup agree and the burst looks the
// same every time: [x, y, rotation, colour token, delay].
const BURST: Array<[string, string, string, string, string]> = [
  ["-34px", "-46px", "-160deg", "var(--aurora-1)", "0s"],
  ["30px", "-54px", "140deg", "var(--aurora-2)", "0.03s"],
  ["58px", "-18px", "200deg", "var(--aurora-3)", "0.06s"],
  ["-62px", "-14px", "-210deg", "var(--aurora-4)", "0.02s"],
  ["8px", "-66px", "90deg", "var(--aurora-2)", "0.08s"],
  ["-18px", "34px", "-120deg", "var(--aurora-3)", "0.05s"],
  ["46px", "30px", "180deg", "var(--aurora-1)", "0.09s"],
  ["-48px", "26px", "-80deg", "var(--aurora-4)", "0.04s"],
];

export default function ResultCard({
  children,
  onReset,
  resetLabel = "Convert another file",
  onAdjust,
  adjustLabel = "Change settings",
  title = "Done",
}: {
  children: ReactNode;
  /** Start over with a fresh file. */
  onReset: () => void;
  resetLabel?: string;
  /** Keep the current files and go back to the options — e.g. to retry another quality. */
  onAdjust?: () => void;
  adjustLabel?: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // A finished result may land below the fold on a tall file list; bring it
  // into view so nobody has to hunt for the download button.
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
  }, []);

  return (
    <div
      ref={ref}
      className="animate-fade-in-up relative mt-6 overflow-hidden rounded-3xl border border-accent-100 bg-accent-50 shadow-md"
      role="status"
    >
      <div className="relative flex items-center gap-3 border-b border-accent-100 px-4 py-3 sm:px-5">
        <span className="animate-pop-in relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(var(--btn-a))] to-[rgb(var(--btn-b))] text-white shadow-glow">
          <AnimatedCheckIcon className="h-4 w-4" />
        </span>
        <p className="text-base font-semibold text-accent-800">{title}</p>
        <span className="confetti !left-8" aria-hidden>
          {BURST.map(([x, y, r, k, dl], i) => (
            <i
              key={i}
              style={{ "--x": x, "--y": y, "--r": r, "--k": k, "--dl": dl } as CSSProperties}
            />
          ))}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        {children}
        <div className="mt-4 flex flex-wrap gap-2">
          {onAdjust && (
            <button type="button" className="btn-secondary" onClick={onAdjust}>
              {adjustLabel}
            </button>
          )}
          <button type="button" className={onAdjust ? "btn-ghost" : "btn-secondary"} onClick={onReset}>
            {resetLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

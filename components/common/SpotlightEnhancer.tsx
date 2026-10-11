"use client";

import { useEffect } from "react";

/**
 * Feeds the cursor position to every `.card-interactive` so its CSS spotlight
 * can follow the pointer. One delegated, rAF-throttled listener for the whole
 * site instead of a handler per card. Renders nothing.
 */
export default function SpotlightEnhancer() {
  useEffect(() => {
    // Touch has no hover, and the glow would just sit at a stale position.
    if (!window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    function paint() {
      frame = 0;
      const e = lastEvent;
      if (!e) return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".card-interactive");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }

    function onMove(e: PointerEvent) {
      lastEvent = e;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

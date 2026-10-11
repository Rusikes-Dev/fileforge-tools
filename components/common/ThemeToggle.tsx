"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function setDarkClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function applyTheme(theme: Theme) {
  setDarkClass(theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignore write failures (e.g. private browsing) — theme just won't persist.
  }
}

// The <html> class is the single source of truth (the inline script in the head
// sets it before first paint). Reading it through useSyncExternalStore keeps the
// switch in step with the page with no flash and no hydration mismatch: the
// server renders "light" and the client corrects it immediately after hydration.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Follow the OS if the user has never made an explicit choice here.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange(e: MediaQueryListEvent) {
      if (getStoredTheme()) return;
      setDarkClass(e.matches ? "dark" : "light");
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = dark ? "light" : "dark";
    const doc = document as ViewTransitionDoc;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Progressive enhancement: where View Transitions exist, the new theme
    // spreads outward from the switch like a ripple. Elsewhere it just flips.
    if (!calm && typeof doc.startViewTransition === "function") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      const transition = doc.startViewTransition(() => applyTheme(next));
      transition.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
          );
        })
        .catch(() => undefined);
      return;
    }
    applyTheme(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="daynight"
      onClick={toggle}
    >
      <span aria-hidden className="dn-cloud" style={{ right: 7, top: 6, width: 20 }} />
      <span aria-hidden className="dn-cloud" style={{ right: 17, top: 16, width: 16 }} />
      <span aria-hidden className="dn-star" style={{ left: 9, top: 8 }} />
      <span aria-hidden className="dn-star" style={{ left: 17, top: 19, width: 2, height: 2 }} />
      <span aria-hidden className="dn-star" style={{ left: 25, top: 10 }} />
      <span aria-hidden className="dn-knob">
        <span className="dn-crater" style={{ left: 4, top: 5, width: 5, height: 5 }} />
        <span className="dn-crater" style={{ left: 11, top: 11, width: 4, height: 4 }} />
      </span>
    </button>
  );
}

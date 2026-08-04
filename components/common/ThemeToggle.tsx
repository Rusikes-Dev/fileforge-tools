"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./Icon";

type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignore write failures (e.g. private browsing) — theme just won't persist.
  }
}

export default function ThemeToggle() {
  // Starts null so nothing meaningful renders until the real theme is known on
  // the client. Rendering an icon before then would briefly contradict the
  // inline anti-flash script and cause a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = getStoredTheme();
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(stored ?? system);
  }, []);

  // Follow the OS if the user has never made an explicit choice here.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange(e: MediaQueryListEvent) {
      if (getStoredTheme()) return;
      const next: Theme = e.matches ? "dark" : "light";
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  const dark = theme === "dark";
  const label = dark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      className="btn-secondary btn-icon"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {/* Reserve the icon box before hydration so the header can't shift. */}
      {theme === null ? (
        <span className="h-4 w-4" aria-hidden />
      ) : dark ? (
        <SunIcon className="h-[18px] w-[18px]" />
      ) : (
        <MoonIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}

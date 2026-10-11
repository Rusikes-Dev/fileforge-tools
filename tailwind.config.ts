import type { Config } from "tailwindcss";

/** Maps a CSS custom property holding an "R G B" triplet to a Tailwind colour
 *  that still supports opacity modifiers (e.g. `bg-surface/95`). */
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Page/card/input background. A dedicated token (separate from
        // Tailwind's literal `white`) so it can flip dark in dark mode without
        // affecting places that intentionally use literal white (e.g. button
        // label text on a solid accent-coloured background).
        surface: token("surface"),
        subtle: token("subtle"),
        // Borders of controls the user must be able to find (>= 3:1).
        line: token("line"),
        // Focus ring colour.
        focus: token("focus"),
        accent: {
          50: token("accent-50"),
          100: token("accent-100"),
          600: token("accent-600"),
          700: token("accent-700"),
          800: token("accent-800"),
        },
        ink: {
          900: token("ink-900"),
          700: token("ink-700"),
          500: token("ink-500"),
          300: token("ink-300"),
          200: token("ink-300"),
          100: token("ink-100"),
          50: token("ink-50"),
        },
        danger: {
          50: token("danger-50"),
          200: token("danger-200"),
          600: token("danger-600"),
          700: token("danger-700"),
        },
        warning: {
          50: token("warning-50"),
          200: token("warning-200"),
          700: token("warning-700"),
        },
      },

      // A deliberate radius ramp. Controls sit at 8–12px, containers at 16px
      // and hero/feature surfaces at 24px+ so nesting reads as intentional.
      borderRadius: {
        DEFAULT: "0.5rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      // Shadows resolve to the tokens in globals.css so dark mode can deepen
      // them without every component needing a `dark:` variant.
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        focus: "var(--shadow-focus)",
        glow: "var(--shadow-glow)",
        none: "none",
      },

      maxWidth: {
        site: "76rem",
        prose: "68ch",
      },

      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },

      // Display sizes for hero headings, with tracking and leading baked in so
      // they can't drift between pages.
      fontSize: {
        "display-sm": ["2.125rem", { lineHeight: "1.12", letterSpacing: "-0.03em" }],
        "display-md": ["2.75rem", { lineHeight: "1.06", letterSpacing: "-0.034em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.02", letterSpacing: "-0.038em" }],
      },

      transitionTimingFunction: {
        // Decelerating curve — motion arrives quickly then settles.
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        // Gentle overshoot used for "pop" interactions.
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

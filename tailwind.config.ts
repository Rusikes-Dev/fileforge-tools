import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Page/card/input background. A dedicated token (separate from Tailwind's
        // literal `white`) so it can flip dark in dark mode without affecting
        // places that intentionally use literal white (e.g. button label text
        // on a solid accent-colored background).
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        accent: {
          50: "rgb(var(--color-accent-50) / <alpha-value>)",
          100: "rgb(var(--color-accent-100) / <alpha-value>)",
          600: "rgb(var(--color-accent-600) / <alpha-value>)",
          700: "rgb(var(--color-accent-700) / <alpha-value>)",
          800: "rgb(var(--color-accent-800) / <alpha-value>)",
        },
        ink: {
          900: "rgb(var(--color-ink-900) / <alpha-value>)",
          700: "rgb(var(--color-ink-700) / <alpha-value>)",
          500: "rgb(var(--color-ink-500) / <alpha-value>)",
          300: "rgb(var(--color-ink-300) / <alpha-value>)",
          100: "rgb(var(--color-ink-100) / <alpha-value>)",
          50: "rgb(var(--color-ink-50) / <alpha-value>)",
        },
      },
      borderRadius: { DEFAULT: "6px" },
      maxWidth: { site: "72rem" },
    },
  },
  plugins: [],
};
export default config;

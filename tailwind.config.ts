import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#eefbf7",
          100: "#d5f4ea",
          600: "#0e7a63",
          700: "#0b614f",
          800: "#0a4d40",
        },
        ink: {
          900: "#171a1c",
          700: "#3a4145",
          500: "#5f6a70",
          300: "#c6cdd1",
          100: "#e8ebed",
          50: "#f6f7f8",
        },
      },
      borderRadius: { DEFAULT: "6px" },
      maxWidth: { site: "72rem" },
    },
  },
  plugins: [],
};
export default config;

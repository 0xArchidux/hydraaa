import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#1E293B", deep: "#0F172A" },
        water: "#0284C7",
        air: "#0D9488",
        fire: "#EA580C",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      // keyframes są zdefiniowane w app/globals.css
      animation: {
        float: "float 7s ease-in-out infinite",
        wave: "wave 14s linear infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        flicker: "flicker 2.4s ease-in-out infinite",
        "scroll-line": "scroll-line 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

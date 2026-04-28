import type { Config } from "tailwindcss";

/**
 * Black & white luxury palette.
 * We keep the original token NAMES so existing class references
 * (text-ink, bg-cream, border-gold, etc.) cleanly invert.
 *
 *   cream     → primary background  (#000)
 *   beige     → elevated surface    (#0F0F0F)
 *   sand      → tertiary surface    (#1A1A1A)
 *   ink       → primary text        (#FFFFFF)
 *   gold      → subtle accent       (#BFBFBF)
 *   goldlight → bright accent       (#E5E5E5)
 *   warm      → muted text          (#737373)
 *   cocoa     → soft warning        (#A0A0A0)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#000000",
        beige: "#0F0F0F",
        sand: "#1A1A1A",
        warm: "#737373",
        ink: "#FFFFFF",
        gold: "#BFBFBF",
        goldlight: "#E5E5E5",
        cocoa: "#A0A0A0",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"IBM Plex Sans"', "ui-serif", "Georgia", "serif"],
      },
      letterSpacing: {
        widest: "0.32em",
      },
      backgroundImage: {
        grain:
          "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
        gold:
          "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%)",
      },
      boxShadow: {
        soft: "0 30px 80px -32px rgba(0,0,0,0.9)",
        ring: "0 0 0 1px rgba(255,255,255,0.12)",
      },
      keyframes: {
        breathe: {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.015)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        breathe: "breathe 5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;

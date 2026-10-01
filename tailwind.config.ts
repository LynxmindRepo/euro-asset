import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-low": "rgb(var(--surface-low) / <alpha-value>)",
        "surface-high": "rgb(var(--surface-high) / <alpha-value>)",
        "surface-lowest": "rgb(var(--surface-lowest) / <alpha-value>)",
        "surface-bright": "rgb(var(--surface-bright) / <alpha-value>)",
        "surface-tint": "rgb(var(--surface-tint) / <alpha-value>)",
        "surface-legal": "rgb(var(--surface-legal) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
        "primary-accent": "rgb(var(--primary-accent) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        tint: "rgb(var(--tint) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        "danger-ink": "rgb(var(--danger-ink) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        "success-ink": "rgb(var(--success-ink) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
        "info-ink": "rgb(var(--info-ink) / <alpha-value>)"
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        brand: ["var(--font-brand)", "Georgia", "serif"]
      },
      boxShadow: {
        ambient: "0 20px 40px rgba(25, 28, 30, 0.06)",
        panel: "0 28px 70px rgba(9, 31, 58, 0.1)"
      },
      borderRadius: {
        xl2: "1rem"
      },
      spacing: {
        18: "4.5rem",
        20: "5rem"
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      backgroundImage: {
        "midnight-gradient":
          "linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary-container)) 62%, rgb(var(--primary-accent)) 100%)"
      }
    }
  },
  plugins: []
};

export default config;

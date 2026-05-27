import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        danger: "#f43f5e",
        warning: "#f59e0b",
        safe: "#22c55e",
        care: "#38bdf8",
      },
      boxShadow: {
        glow: "0 0 38px rgba(56, 189, 248, 0.22)",
        risk: "0 0 32px rgba(244, 63, 94, 0.24)",
      },
      backgroundImage: {
        "care-radial":
          "radial-gradient(circle at top left, rgba(56,189,248,.22), transparent 32%), radial-gradient(circle at 70% 20%, rgba(34,197,94,.14), transparent 28%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

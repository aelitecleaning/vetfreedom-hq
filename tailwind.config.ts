import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Field-manual palette: olive/graphite with a signal-gold accent
        base: {
          950: "#0b0e0c",
          900: "#11150f",
          800: "#1a2016",
          700: "#242c1e",
          600: "#33402a",
        },
        olive: {
          400: "#8a9a5b",
          500: "#6b7a3f",
          600: "#525f30",
        },
        signal: {
          // "signal gold" accent — sparingly, for CTAs and the Freedom Score
          400: "#f0b429",
          500: "#de911d",
          600: "#cb6e17",
        },
        sand: "#e8e2d0",
      },
      fontFamily: {
        stencil: ["var(--font-stencil)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        brief: "68rem",
      },
    },
  },
  plugins: [],
};

export default config;

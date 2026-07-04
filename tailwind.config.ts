import type { Config } from "tailwindcss";

// Friendly, warm LIGHT theme. Token NAMES are kept from the original dark theme
// so components don't need per-element edits — only the VALUES changed. Mental
// model for the (historically dark-named) scale under this light theme:
//   base.950  → warm cream  (page background)
//   base.900  → white       (cards, inputs)
//   base.800  → soft fill    (hover / selected)
//   base.700  → soft border
//   base.600  → faint text / strong border
//   sand      → INK (primary dark text)   ← value flipped for a light bg
//   olive.400 → muted warm-gray body text
//   signal.*  → friendly gold accent (CTAs, highlights)
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#faf6ee", // page background — warm cream
          900: "#ffffff", // cards / inputs
          800: "#f3ecdf", // subtle fill, hover, selected
          700: "#e9e0ce", // borders
          600: "#a99a7e", // faint text / strong border
        },
        olive: {
          400: "#6d6453", // muted body text (warm gray)
          500: "#6f8a4e", // friendly green accent (progress bars)
          600: "#5a7340",
        },
        signal: {
          400: "#a86400", // accent TEXT / links (readable amber on light)
          500: "#f2a834", // CTA button background (friendly gold)
          600: "#d98a16", // hover / accents
        },
        sand: "#2c2721", // primary INK (dark text)
      },
      fontFamily: {
        // stencil → Poppins (friendly display, used for headings + labels)
        stencil: ["var(--font-stencil)", "system-ui", "sans-serif"],
        // sans → Inter (clean, readable body)
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        brief: "68rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(44,39,33,0.04), 0 8px 24px -12px rgba(44,39,33,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

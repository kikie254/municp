import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Palette sampled from the official Elgeyo Marakwet County crest */
        green: {
          950: "#041F15",
          900: "#062B1C",
          800: "#083A26",
          700: "#0A4A30",
          600: "#0B5D3A",
          500: "#14764A",
          400: "#2E9463",
          300: "#6FB894",
          200: "#B4D8C6",
          100: "#DCEBE2",
          50: "#F1F7F3",
        },
        gold: {
          700: "#8F6E00",
          600: "#B98D00",
          500: "#D9A900",
          400: "#E8B800",
          300: "#F2CE3F",
          200: "#F7E28A",
          100: "#FBF1C4",
          50: "#FDF9E8",
        },
        clay: "#C89860",
        flag: {
          red: "#B0231A",
          dark: "#7C1710",
        },
        ink: {
          DEFAULT: "#13211B",
          soft: "#3B4A43",
          muted: "#5D6B64",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          warm: "#FAF8F3",
          line: "#E4E0D6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.4rem, 5.2vw, 4.4rem)", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem, 3.6vw, 3.1rem)", { lineHeight: "1.09", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.6rem, 2.5vw, 2.2rem)", { lineHeight: "1.16", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(6, 43, 28, 0.04), 0 12px 28px -18px rgba(6, 43, 28, 0.28)",
        lift: "0 2px 4px rgba(6, 43, 28, 0.05), 0 26px 48px -24px rgba(6, 43, 28, 0.35)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      maxWidth: {
        shell: "1240px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;

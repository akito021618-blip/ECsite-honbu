import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAFAF7",
        midnight: "#0F0F1A",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E2C97A",
          dark: "#A07C30",
        },
        navy: "#2C3E50",
        "warm-gray": "#F5F5F0",
        "muted-gold": "#D4B896",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C9A84C 0%, #E2C97A 50%, #C9A84C 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #0F0F1A 0%, #1a1a2e 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        luxury: "0 4px 30px rgba(201, 168, 76, 0.15)",
        "luxury-hover": "0 8px 40px rgba(201, 168, 76, 0.25)",
        card: "0 2px 20px rgba(15, 15, 26, 0.08)",
        "card-hover": "0 8px 40px rgba(15, 15, 26, 0.15)",
      },
      borderColor: {
        gold: "#C9A84C",
        "gold-light": "rgba(201, 168, 76, 0.3)",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;

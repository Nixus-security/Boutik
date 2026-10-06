import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf3",
          100: "#d6fae2",
          200: "#b0f3c9",
          300: "#7ce7ab",
          400: "#42d387",
          500: "#1cb96c",
          600: "#129756",
          700: "#127847",
          800: "#135f3b",
          900: "#124e32",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 1rem))" },
        },
      },
      animation: {
        marquee: "marquee var(--duration,30s) linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

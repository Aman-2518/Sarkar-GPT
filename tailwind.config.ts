import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#FFF7ED",
          100: "#FFE9CF",
          300: "#FFB65C",
          500: "#F97A1F",
          600: "#E4600A",
          700: "#B84C08",
        },
        tricolor: {
          green: "#0B6E4F",
        },
        ink: {
          900: "#1A1410",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "warm-gradient": "linear-gradient(135deg, #FFB65C 0%, #F97A1F 50%, #B84C08 100%)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;

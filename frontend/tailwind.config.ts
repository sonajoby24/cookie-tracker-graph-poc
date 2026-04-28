import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#030712",
        surface: "#0B1117",
        cyan: "#38BDF8",
        indigo: "#818CF8",
        border: "#1F2937",
        text: "#E5EEF7",
        muted: "#94A3B8"
      },
      boxShadow: {
        dex: "0 0 0 1px rgba(31,41,55,1), 0 0 0.5px rgba(56,189,248,0.30), 0 18px 50px rgba(2,8,23,0.35)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
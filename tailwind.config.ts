import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        ink: "#17130f",
        surface: "#211b15",
        raised: "#2c241c",
        line: "#3b3128",
        paper: "#f4ece0",
        muted: "#b8a993",
        accent: "#f29e4c",
        "accent-strong": "#ffb978",
        danger: "#ff9d87",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ['"Work Sans"', "system-ui", "sans-serif"],
      },
    },
  },
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold1: "var(--gold1)",
        gold4: "var(--gold4)",
        blue1: "var(--blue1)",
        blue3: "var(--blue3)",
      },
    },
  },
  plugins: [],
};
export default config;

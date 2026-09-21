import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#246BFD",
        "brand-blue-dark": "#1454DA",
        "brand-ink": "#06111F",
        "brand-navy": "#081A2E"
      }
    }
  },
  plugins: []
};

export default config;

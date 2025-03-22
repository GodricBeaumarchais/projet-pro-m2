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
        "gold": {
          100: "#F0E6D2",
          200: "#C8AA6E",
          300: "#C8AA6E",
          400: "#C89B3C",
          500: "#785A28",
          600: "#463714",
          700: "#32281E",
        },
        "Hextech": {
          100: "#CDFAFA",
          200: "#0AC8B9",
          300: "#0397AB",
          400: "#005A82",
          500: "#0A323C",
          600: "#091428",
          700: "#0A1428",
        }
      },
    },
  },
  plugins: [],
};
export default config;

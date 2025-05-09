

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // <-- This enables dark mode via the "dark" class!
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./account/state-one/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/dashboard/Management/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        roboto: ['"Roboto"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;


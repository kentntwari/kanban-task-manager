/** @type {import('tailwindcss').Config} */

import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1440px",
      xl: "1728px",
    },
    container: {
      center: true,
    },
    colors: {
      black: "#000112",
      white: "#fff",
      red: "#ea5555",
      "dim-red": "#ff9898",
      "main-purple": "#635FC7",
      "dim-purple": "#a8a4ff",
      "very-dark-grey": "#20212c",
      "dark-grey": "#2b2c37",
      "medium-grey": "#828fa3",
      "light-grey": "#f4f7fd",
      "line-dark": "#3e3f4e",
      "line-light": "#e4ebfa",
    },
    fontFamily: {
      sans: ["Plus Jakarta Sans", "sans-serif"],
    },
    fontSize: {
      "2xl": [
        "24px",
        {
          lineHeight: "30px",
          fontWeight: "700",
        },
      ],
      xl: [
        "18px",
        {
          lineHeight: "23px",
          fontWeight: "700",
        },
      ],
      lg: [
        "15px",
        {
          lineHeight: "19px",
          fontWeight: "700",
        },
      ],
      md: [
        "13px",
        {
          lineHeight: "23px",
          fontWeight: "500",
        },
      ],
      sm: [
        "12px",
        {
          lineHeight: "15px",
          fontWeight: "700",
        },
      ],
      asm: [
        "12px",
        {
          lineHeight: "15px",
          letterSpacing: "2.4px",
          fontWeight: "700",
        },
      ],
    },
    extend: {},
  },
};

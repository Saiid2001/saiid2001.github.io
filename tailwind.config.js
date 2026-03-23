/** @type {import('tailwindcss').Config} */
//https://www.color-hex.com/color-palette/27007

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B1A17",
          light: "#262420",
        },
        secondary:{
          DEFAULT: "#E45826",
          light : "#E6D5B8",
        },
        muted: {
          DEFAULT: "#b8a99a",
          light: "#d4c8bb",
        },
        gray: {
          DEFAULT: "#aaaaaa",
        light: "#bbbbbb",
        }
      },
      screens: {
        '3xl': '1930px',
      }
    },
    fontFamily: {
      sans: ['"Maven Pro"', 'sans-serif'],
      mono: ['"Ubuntu Mono"', 'monospace']
    },
  },
  plugins: [require('daisyui')],
  safelist: [
    "bg-primary",
    "bg-secondary",
    "hover:bg-primary-light",
    "hover:bg-secondary-light",
    "rounded-full"
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "base-100": "#FFF9F0",
          "base-content": "#1B1A17",
          primary: "#517a8b",
          secondary: "#E45826",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "base-100": "#1B1A17",
          "base-content": "#E6D5B8", 
          primary: "#1B1A17",
          secondary: "#E45826"
        }
      }
    ]
  }
};

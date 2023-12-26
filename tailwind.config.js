/** @type {import('tailwindcss').Config} */
//https://www.color-hex.com/color-palette/27007

module.exports = {
  darkMode: 'class',
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#517a8b",
          light: "#5e94a1",
        },
        secondary:{
          DEFAULT: "#f0aa0f",
          light : "#fae782",
        },
        gray: {
          DEFAULT: "#aaaaaa",
        light: "#bbbbbb",
        }
      },
    },
  },
  plugins: [require('daisyui'),],
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
          primary: "#517a8b",
          secondary: "#f0aa0f"
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#517a8b",
          secondary: "#fdc944"
        }
      }
    ]
  }
};

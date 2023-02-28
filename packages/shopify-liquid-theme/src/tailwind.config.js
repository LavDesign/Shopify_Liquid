/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const path = require("path");
const bedrockConfig = require("../bedrock.config.js");

// Configure tailwind screens from bedrock.config.js
const screens = bedrockConfig.theme.breakpoints;

Object.entries(screens).forEach(([key, value]) => {
  screens[key] = `${value}px`;
});

module.exports = {
  theme: {
    fontFamily: {
      primary: ["var(--font-family-primary)", "sans-serif"],
      secondary: ["var(--font-family-secondary)", "monospace"],
    },
    fontSize: {
      lg: "var(--font-size-lg)",
      base: "var(--font-size)",
      sm: "var(--font-size-sm)",
      xs: "var(--font-size-xs)",
    },
    spacing: {
      0.5: "0.125rem", // 2px - 2 units increment
      1: "0.25em",
      1.5: "0.375em",
      2: "0.5em",
      2.5: "0.625em",
      3: "0.75em",
      3.5: "0.875em",
      4: "1em",
      4.5: "1.125em",
      5: "1.25em",
      6: "1.5em", // 24px - 4 units increment
      7: "1.75em",
      8: "2em",
      9: "2.25em",
      10: "2.5em",
      11: "2.75em",
      12: "3em",
      13: "3.25em",
      14: "3.5em",
      15: "3.75em",
      16: "4em",
      17: "4.25em",
      18: "4.5em",
      19: "4.75em",
      20: "5em",
      21: "5.25em",
      22: "5.5em",
      23: "5.75em",
      24: "6em",
      25: "6.25em", // 100px
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "primary-100": "var(--color-primary-100)",
      "primary-200": "var(--color-primary-200)",
      "primary-300": "var(--color-primary-300)",
      "primary-400": "var(--color-primary-400)",
      "primary-500": "var(--color-primary-500)",
      "primary-600": "var(--color-primary-600)",
      "primary-700": "var(--color-primary-700)",
      "primary-800": "var(--color-primary-800)",
      "primary-900": "var(--color-primary-900)",

      "secondary-100": "var(--color-secondary-100)",
      "secondary-200": "var(--color-secondary-200)",
      "secondary-300": "var(--color-secondary-300)",
      "secondary-400": "var(--color-secondary-400)",
      "secondary-500": "var(--color-secondary-500)",
      "secondary-600": "var(--color-secondary-600)",
      "secondary-700": "var(--color-secondary-700)",
      "secondary-800": "var(--color-secondary-800)",
      "secondary-900": "var(--color-secondary-900)",

      "tertiary-100": "var(--color-tertiary-100)",
      "tertiary-200": "var(--color-tertiary-200)",
      "tertiary-300": "var(--color-tertiary-300)",
      "tertiary-400": "var(--color-tertiary-400)",
      "tertiary-500": "var(--color-tertiary-500)",
      "tertiary-600": "var(--color-tertiary-600)",
      "tertiary-700": "var(--color-tertiary-700)",
      "tertiary-800": "var(--color-tertiary-800)",
      "tertiary-900": "var(--color-tertiary-900)",

      "grey-100": "var(--color-grey-100)",
      "grey-200": "var(--color-grey-200)",
      "grey-300": "var(--color-grey-300)",
      "grey-400": "var(--color-grey-400)",
      "grey-500": "var(--color-grey-500)",
      "grey-600": "var(--color-grey-600)",
      "grey-700": "var(--color-grey-700)",
      "grey-800": "var(--color-grey-800)",
      "grey-900": "var(--color-grey-900)",

      red: "var(--color-util-red)",
      green: "var(--color-util-green)",
      yellow: "var(--color-util-yellow)",
      white: "var(--color-util-white)",
    },
    screens,
  },
  plugins: [],
  content: [path.resolve(__dirname, "**/*.{js,vue,liquid,scss}")],
};

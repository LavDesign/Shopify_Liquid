const path = require("path");
const ThemeResolver = require("@bva/theme-resolver/postcss");
const { themePaths } = require("./webpack-utils");

module.exports = {
  plugins: {
    "postcss-import": {
      resolve: ThemeResolver([themePaths.themeOverride, themePaths.themeBase]),
    },
    "tailwindcss/nesting": {},
    tailwindcss: {
      config: path.resolve(__dirname, "./src/tailwind.config.js"),
    },
    autoprefixer: {},
    "@bva/ui-shared": {},
  },
};

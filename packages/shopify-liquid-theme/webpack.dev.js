const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin-next");

module.exports = merge(common, {
  mode: "development",
  plugins: [
    /**
     * docs: https://www.npmjs.com/package/eslint-webpack-plugin
     */
    new ESLintPlugin({
      files: "src/**/*.{js,vue}",
      overrideConfigFile: path.resolve(__dirname, "./.eslintrc.js"),
    }),
    /**
     * docs: https://www.npmjs.com/package/stylelint-webpack-plugin
     */
    new StylelintPlugin({
      files: "src/**/*.{vue,css,sass,scss}",
      configFile: path.resolve(__dirname, "./.stylelintrc.js"),
    }),
    /**
     * docs: https://www.npmjs.com/package/webpack-shell-plugin-next
     */
    new WebpackShellPlugin({
      onDoneWatch: {
        scripts: ["gulp icons:build"],
        blocking: false,
        parallel: true,
      },
    }),
  ],
});

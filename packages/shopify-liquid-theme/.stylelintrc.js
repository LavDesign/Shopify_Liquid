// See: https://stylelint.io/user-guide/configure

const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  extends: ["stylelint-config-recommended", "stylelint-config-prettier"],
  /**
   * add plugins
   * docs: https://stylelint.io/user-guide/configure#plugins
   */
  plugins: [
    // 'stylelint-scss' // stylelint by itself supports SCSS syntax very well
  ],
  /**
   * ignore certain files
   * docs: https://stylelint.io/user-guide/configure#ignorefiles
   */
  ignoreFiles: ["src/**/assets", "dist"],
  /**
   * add custom rules
   * docs: https://stylelint.io/user-guide/rules/list
   */
  rules: {},
  overrides: [],
  customSyntax: "postcss-html",
};

// See: https://stylelint.io/user-guide/configure

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
  ignoreFiles: ["packages/theme-dawn/**/*.{css,scss}"],
  /**
   * add custom rules
   * docs: https://stylelint.io/user-guide/rules/list
   */
  rules: {},
  /**
   * add overrides
   * https://stylelint.io/user-guide/rules/#overrides
   */
  overrides: [],
};

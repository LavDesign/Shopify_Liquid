// See: https://eslint.org/docs/user-guide/configuring/configuration-files

module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier", "plugin:vue/vue3-essential"],
  plugins: ["prettier", "vue"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
    ecmaVersion: 2021,
    sourceType: "module",
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    commonjs: true,
  },
  /**
   * Define globals to solve [GLOBAL] is not defined no undef
   */
  globals: {
    Shopify: "readonly",
  },
  /**
   * add custom rules
   * docs: https://eslint.org/docs/rules
   */
  rules: {
    "prettier/prettier": "error",
  },
  overrides: [],

  /**
   * ignore certain files
   * docs: https://eslint.org/docs/user-guide/configuring#ignorepatterns-in-config-files
   */
  ignorePatterns: ["packages/theme-dawn/*"],
};

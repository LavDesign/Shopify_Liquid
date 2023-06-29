/**
 * Webpack config – Common
 * - This config is merged with webpack.dev.js or webpack.prod.js
 *   depending on the environment (dev, prod respectively).
 *
 * See: https://v4.webpack.js.org/configuration/#root
 */
require("dotenv").config();

const path = require("path");
const webpack = require("webpack");
const CopyWebPackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ThemeResolver = require("@bva/theme-resolver/webpack");
const { VueLoaderPlugin } = require("vue-loader");

const { render: ejsRender } = require("./ejs-utils");
const { resolveEntries, themePaths } = require("./webpack-utils");

const ejsSchema = {
  ...require("./src/theme-base/ejs/schema-default"),
  ...require(`./src/${process.env.THEME_OVERRIDE_DIR}/ejs/schema-default`),
};

const isDevelopment = process.env.NODE_ENV == "development";

const paths = {
  src: path.resolve(__dirname, "./src"),
  dist: path.resolve(__dirname, "./dist"),
  bedrockConfig: path.resolve(__dirname, "./bedrock.config.js"),
};

const flags = {
  cleanOnBuild: true,
};

module.exports = {
  stats: "minimal",
  /**
   * Theme Override System Touchpoint
   *   - Handles resolving entry points in `from:` configured below
   *   - Items with a lower index in the list have higher priority
   *   - Path specificed in `to:` is relative to output.path
   */
  entry: resolveEntries(
    [
      {
        from: path.join(themePaths.themeOverride, "/entries"),
        to: "assets",
      },
      {
        from: path.join(themePaths.themeBase, "/entries"),
        to: "assets",
      },
    ],
    {
      debug: isDevelopment,
    }
  ),
  output: {
    path: paths.dist,
    filename: "[name].js",
    clean: flags.cleanOnBuild,
  },
  resolve: {
    extensions: ["*", ".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm-bundler.js",
      "@": paths.src,
      "bedrock-config": paths.bedrockConfig,
    },
    plugins: [
      // https://www.npmjs.com/package/revolver-webpack-plugin
      /**
       * Theme Override System Touchpoint
       *   - Handles resolving relative imports for files listed in `fileExtension`
       *   - NOTE: Reltaive imports in files must specify an extension
       */
      new ThemeResolver([themePaths.themeOverride, themePaths.themeBase], {
        fileExtension: [".js", ".css", ".vue"],
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      ...(() => {
        const rules = [];
        const loaders = [{ test: /\.(css|postcss)$/i }];

        loaders.forEach((element, index) => {
          rules.push({
            test: element.test,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: require(path.resolve(
                    __dirname,
                    "./postcss.config.js"
                  )),
                },
              },
            ],
          });

          if (element.loader) rules[index].use.push(element.loader);
        });

        return rules;
      })(),
    ],
  },
  plugins: [
    // Docs: https://webpack.js.org/plugins/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      filename: "./[name].css",
      chunkFilename: "[id].css",
    }),
    // Docs: https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
    }),
    // Docs: https://vue-loader.vuejs.org/guide/
    new VueLoaderPlugin(),
    // Docs: https://www.npmjs.com/package/copy-webpack-plugin
    /**
     * Theme Override System Touchpoint
     *  - Handles copy merging files from THEME_FOLDER/shopify to output.path
     *  - Patterns with higher priority win (NOTE: `force: true` is required)
     *  - EjsSchmea is merged at the top of this file
     */
    new CopyWebPackPlugin({
      patterns: [
        {
          context: themePaths.themeBase,
          from: "shopify",
          priority: 0,
          force: true,
          transform(buffer) {
            return ejsRender(buffer.toString(), {
              schema: ejsSchema,
            });
          },
        },
        {
          context: themePaths.themeOverride,
          from: "shopify",
          priority: 1,
          force: true,
          transform(buffer) {
            return ejsRender(buffer.toString(), {
              schema: ejsSchema,
            });
          },
        },
      ],
    }),
  ],
};

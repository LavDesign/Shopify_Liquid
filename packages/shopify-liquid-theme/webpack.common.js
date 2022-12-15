/**
 * Webpack config – Common
 * - This config is merged with webpack.dev.js or webpack.prod.js
 *   depending on the environment (dev, prod respectively).
 *
 * See: https://v4.webpack.js.org/configuration/#root
 */

const path = require("path");
const webpack = require("webpack");
const CopyWebPackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RevolverWebpackPlugin = require("revolver-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const { render: ejsRender } = require("./ejs-utils");
const { resolveEntries, getRelativePath } = require("./webpack-utils");

const ejsSchema = {
  ...require("./src/theme-base/ejs/schema-default"),
  ...require("./src/theme-override/ejs/schema-default"),
};

const isDevelopment = process.env.NODE_ENV == "development";

const paths = {
  src: path.resolve(__dirname, "./src"),
  dist: path.resolve(__dirname, "./dist"),
  bedrockConfig: path.resolve(__dirname, "./bedrock.config.js"),
  themeBase: path.resolve(__dirname, "./src/theme-base"),
  themeOverride: path.relative(__dirname, "./src/theme-override"),
};

const flags = {
  cleanOnBuild: true,
};

module.exports = {
  stats: "minimal",
  /**
   * Theme Override System Touchpoint
   *   - Handles resolving entry points in `from:` configured below
   *   - Items lower in the list have higher priority
   *   - Path specificed in `to:` is relative to output.path
   */
  entry: resolveEntries(
    [
      {
        from: path.join(paths.themeBase, "/entries"),
        to: "assets",
      },
      {
        from: path.join(paths.themeOverride, "/entries"),
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
      new RevolverWebpackPlugin({
        directoryList: [
          {
            path: paths.themeBase,
          },
          {
            path: paths.themeOverride,
          },
        ],
        fileExtension: [".js", ".scss", ".vue"],
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

        const loaders = [
          { test: /\.(css|postcss)$/i },
          {
            test: /\.s[ac]ss$/i,
            loader: {
              loader: "sass-loader",
              options: {
                // Fixes missing global imports for files listed in `extensions`
                // See: https://www.npmjs.com/package/sass-loader#additionaldata
                additionalData: (content, loaderContext) => {
                  // Get the relative path that will resolve correctly for RevolverWebpackPlugin
                  const { dir, ext } = path.parse(loaderContext.resourcePath);
                  const src = path.resolve(__dirname, "./src/");
                  // -1 offset is necessary to resolve file between theme-base / theme-override (see WebpackRevolverPlugin)
                  const rel = getRelativePath(dir, src, { offset: -1 });
                  // Add entry into the array below to add an additional import.
                  // Example: [
                  //  `@import "${rel}/scss/tools/tools.scss"`
                  // ]
                  const imports = [
                    `@import "${rel}/scss/settings/settings.scss";`,
                    `@import "${rel}/scss/tools/tools.scss";`,
                  ];
                  // Update this list to apply imports to only certain extensions.
                  const extensions = [".vue"];
                  if (extensions.includes(ext)) {
                    return imports.join(" ") + content;
                  } else {
                    return content;
                  }
                },
              },
            },
          },
        ];

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
          context: paths.themeBase,
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
          context: paths.themeOverride,
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

const glob = require("glob");
const path = require("path");
const { watch, src, dest } = require("gulp");
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const inject = require("gulp-inject");
const debug = require("gulp-debug");

const paths = {
  themeBase: path.resolve(__dirname, "./src/theme-base"),
  themeOverride: path.resolve(__dirname, "./src/theme-override"),
  store: path.resolve(__dirname, "./src/theme-base/icons/icon-store.liquid"),
  dest: path.resolve(__dirname, "./dist/snippets"),
};

/**
 * Resolve a single list of uniquie icon files for a list of configs
 * @param {Array} pathConfigs List of path configs
 * @returns List of unique icon pathConfigs
 * @example
 * resolveIcons([
 *   {
 *     context: "src/theme-base/icons"
 *   },
 *   {
 *     context: "src/theme-override/icons"
 *   }
 * ]);
 */
const resolveIcons = (pathConfigs = []) => {
  let icons = {};
  // OUTER LOOP: Iterater over configs
  for (const { context, pattern = "**/*.svg" } of pathConfigs) {
    const files = glob.sync(pattern, { cwd: context });
    // INNER LOOP: Update icons obj using file name as key
    for (const file of files) {
      const parsed = path.parse(file);
      const key = parsed.name;
      const value = path.resolve(context, file);
      icons[key] = value;
    }
  }
  // Return a list of unique icon file paths.
  return Object.values(icons);
};

/**
 * Build icon svg file(s) and inject into icon-store.liquid.
 */
function buildIcons() {
  const storeOpts = { inlineSvg: true };
  const svgminOpts = {};
  const injectOpts = {
    transform: (path, file) => {
      return file.contents.toString();
    },
  };
  const iconFiles = resolveIcons([
    {
      context: path.join(paths.themeBase, "/icons"),
    },
    {
      context: path.join(paths.themeOverride, "/icons"),
    },
  ]);

  // Gulp operations
  const icons = src(iconFiles)
    .pipe(debug({ title: "Icons:" }))
    .pipe(svgmin(svgminOpts))
    .pipe(svgstore(storeOpts));
  // Inject svg into icon store
  const store = src([paths.store])
    .pipe(debug({ title: "Icon store:" }))
    .pipe(inject(icons, injectOpts))
    .pipe(dest(paths.dest));

  return store;
}

/**
 * Watch icon svg and icon-store.liquid file(s)
 * and run icon:build task.
 */
function iconsWatch() {
  watch(`${paths.icons}/${paths.patterns.svg}`, buildIcons);
  watch(paths.store, buildIcons);
}

/**
 * Print simple help text, used as default task.
 */
function printHelp(cb) {
  console.log("Usage: gulp <task> [options]");
  console.log("  Tasks: help, icons:build, icons:watch");
  cb();
}

exports["icons:build"] = buildIcons;
exports["icons:watch"] = iconsWatch;
exports["help"] = printHelp;
exports.default = printHelp;

const glob = require("glob");
const path = require("path");
const chalk = require("chalk");

const THEME_OVERRIDE_DIR = process.env.THEME_OVERRIDE_DIR || "theme-override";

const LOG_LEVEL_SILENT = "silent";
const LOG_LEVEL_INFO = "info";
const LOG_LEVEL_VERBOSE = "verbose";

/**
 * Iterate a list of entry configs, resolve the winning config,
 * and return a Webpack-compatible entry config object.
 *
 * Note: Entries are based on file name.
 * Note: Entries later in the list win over earlier entries.
 *
 * @param {Array} entryConfigs - List of webpack entries
 * @param {Boolean} logLevel - Print debug info, valid values are: "silent", "info", "verbose".
 * @returns {Object}
 * @example
 * // Abbreviated Webpack config...
 * module.exports = {
 *   entry: resolveEntries([
 *     {
 *       from: "./src/theme-base/entries",
 *       to: "assets",
 *     },
 *     {
 *       from: "./src/theme-override/entries",
 *       to: "assets",
 *     },
 *   ]),
 * };
 */
const resolveEntries = (entryConfigs = [], { logLevel = LOG_LEVEL_SILENT }) => {
  const entry = {};

  if (logLevel == LOG_LEVEL_VERBOSE) {
    console.log(
      chalk.bold(`[VERBOSE]: Resolving entries...`),
      "entryConfig:",
      entryConfigs
    );
  }

  // OUTER LOOP: Iterate over configs
  for (const {
    from,
    to,
    pattern = "**/*.*",
    extensions = false,
  } of entryConfigs) {
    if (logLevel == LOG_LEVEL_VERBOSE) {
      console.log(chalk.bold(`[VERBOSE]: Processing entry config: `), {
        from,
        to,
        pattern,
        extensions,
      });
    }

    const files = glob.sync(pattern, { cwd: from });
    if (logLevel == LOG_LEVEL_VERBOSE) {
      console.log(chalk.bold(`[VERBOSE]: Globbing files: `), files);
    }
    // INNER LOOP: Iterate files and update the entry obj.
    for (const file of files) {
      const parsed = path.parse(file);
      const dir = parsed.dir;
      const name = extensions ? parsed.base : parsed.name;
      const entryKey = dir ? `${to}/${dir}/${name}` : `${to}/${name}`;
      const entryValue = path.resolve(from, file);

      if (logLevel == LOG_LEVEL_VERBOSE) {
        console.log(chalk.bold(`[VERBOSE]: Parsing file: `), {
          file,
          parsed,
          dir,
          name,
          entryKey,
          entryValue,
        });
      }

      // Update the entry memo object
      entry[entryKey] = entryValue;

      if (logLevel == LOG_LEVEL_VERBOSE) {
        console.log(chalk.bold("[VERBOSE]: Updating entry memo: "), entry);
      }
    }
  }
  if (logLevel == "info" || logLevel == LOG_LEVEL_VERBOSE) {
    console.log(chalk.bold(`[INFO]: Resolved entries:`));
    for (const key in entry) {
      console.log(` → ${key}: ${entry[key].replace(__dirname, ".")}`);
    }
  }
  return entry;
};

/**
 * Get a relative path with an negative offset.
 * @param {String} from
 * @param {String} to
 * @param {Number} offset A negative number to offset by
 * @returns {String}
 */
const getRelativePath = (from, to, { offset = 0 }) => {
  if (offset > 0) {
    throw "[ERROR]: webpack-utils.js::getRelativePath: offset must be a negative number!";
  }
  const raw = path.relative(from, to);
  const parts = raw.split("/");
  const rel = parts.slice(0, parts.length + offset).join("/");
  return rel;
};

const themePaths = {
  themeBase: path.resolve(__dirname, "./src/theme-base"),
  themeOverride: path.resolve(__dirname, `./src/${THEME_OVERRIDE_DIR}`),
  store: path.resolve(__dirname, "./src/theme-base/icons/icon-store.liquid"),
  dest: path.resolve(__dirname, "./dist/snippets"),
};

module.exports = { resolveEntries, getRelativePath, themePaths };

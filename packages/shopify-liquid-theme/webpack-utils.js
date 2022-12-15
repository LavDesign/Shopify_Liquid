const glob = require("glob");
const path = require("path");
const chalk = require("chalk");

/**
 * Iterate a list of entry configs, resolve the winning config,
 * and return a Webpack-compatible entry config object.
 *
 * Note: Entries are based on file name.
 * Note: Entries later in the list win over earlier entries.
 *
 * @param {Array} entryConfigs - List of webpack entries
 * @param {Boolean} debug - Print debug info
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
const resolveEntries = (entryConfigs = [], { debug = false }) => {
  const entry = {};

  // OUTER LOOP: Iterate over configs
  for (const {
    from,
    to,
    pattern = "**/*.*",
    extensions = false,
  } of entryConfigs) {
    const files = glob.sync(pattern, { cwd: from });
    // INNER LOOP: Iterate files and update the entry obj.
    for (const file of files) {
      const parsed = path.parse(file);
      const dir = parsed.dir;
      const name = extensions ? parsed.base : parsed.name;
      const entryKey = dir ? `${to}/${dir}/${name}` : `${to}/${name}`;
      const entryValue = path.resolve(from, file);
      entry[entryKey] = entryValue;
    }
  }
  if (debug) {
    console.log(chalk.bold(`[INFO]: Resolve Entries:`));
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

module.exports = { resolveEntries, getRelativePath };

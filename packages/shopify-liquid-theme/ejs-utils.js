const ejs = require("ejs");

/**
 * Render a template string (source) for a schema (options.schema).
 * See: webpack.common.js > plugins > CopyPlugin to see where this is loaded.
 *
 * @param {String} source
 * @param {Object} options
 * @returns String
 */
function render(source, options) {
  const schema = options.schema || {};
  return ejs.render(source, schema);
}
module.exports = {
  render,
};

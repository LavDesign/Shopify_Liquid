/**
 * EJS Schema
 * - Write standard JS in this file and export properties in `module.exports`
 *   at the bottom of the file.
 * - You can add an EJS template to any file in ./src/shopify and
 *   webpack.common.js > plugins > CopyPlugin > patterns > transform
 *   will run that file through EJS.
 *
 * Example:
 *   // schema.js
 *   const messages = { helloWorld: "Hello World "}
 *   module.exports = { messages };
 *
 *   // src/shopify/templates/foo.liquid
 *   <p><%= messages.helloWorld %></p>
 *
 * See: webpack.common.js > plugins > CopyPlugin to see where this file is loaded.
 * See: https://ejs.co/#docs
 */

/*
  Color Palletes
*/
const colorsPrimary = [
  { label: "900", value: "#576041" },
  { label: "800", value: "#788064" },
  { label: "700", value: "#989F85" },
  { label: "600", value: "#C0C7AF" },
  { label: "500", value: "#E2E6D7" },
  { label: "400", value: "#F1F3EB" },
  { label: "300", value: "#F9FBF2" },
  { label: "200", value: "#C4C4C4" },
  { label: "100", value: "#C4C4C4" },
];

const colorsSecondary = [
  { label: "900", value: "#C4952B" },
  { label: "800", value: "#DAB052" },
  { label: "700", value: "#EFD089" },
  { label: "600", value: "#F6E0AE" },
  { label: "500", value: "#FFF0CD" },
  { label: "400", value: "#FFF9ED" },
  { label: "300", value: "#C4C4C4" },
  { label: "200", value: "#C4C4C4" },
  { label: "100", value: "#C4C4C4" },
];

const colorsTertiary = [
  { label: "900", value: "#534D4D" },
  { label: "800", value: "#87847D" },
  { label: "700", value: "#C7C0B4" },
  { label: "600", value: "#E5DCCD" },
  { label: "500", value: "#FFFCFA" },
  { label: "400", value: "#C4C4C4" },
  { label: "300", value: "#C4C4C4" },
  { label: "200", value: "#C4C4C4" },
  { label: "100", value: "#C4C4C4" },
];

const colorsGreyScale = [
  { label: "900", value: "#000000" },
  { label: "800", value: "#333232" },
  { label: "700", value: "#4D4C4B" },
  { label: "600", value: "#666564" },
  { label: "500", value: "#807E7D" },
  { label: "400", value: "#999796" },
  { label: "300", value: "#B2B0AC" },
  { label: "200", value: "#CCCAC8" },
  { label: "100", value: "#E6E3E1" },
];

const colorsUtil = [
  { label: "Red", value: "#BD572F" },
  { label: "Green", value: "#537857" },
  { label: "Yellow", value: "#FCD162" },
  { label: "White", value: "#FFFFFF" },
];

/*
  All Colors
*/
const colorsAll = [
  { label: "Primary 900", value: "--color-primary-900" },
  { label: "Primary 800", value: "--color-primary-800" },
  { label: "Primary 700", value: "--color-primary-700" },
  { label: "Primary 600", value: "--color-primary-600" },
  { label: "Primary 500", value: "--color-primary-500" },
  { label: "Primary 400", value: "--color-primary-400" },
  { label: "Primary 300", value: "--color-primary-300" },
  { label: "Primary 200", value: "--color-primary-200" },
  { label: "Primary 100", value: "--color-primary-100" },
  { label: "Secondary 900", value: "--color-secondary-900" },
  { label: "Secondary 800", value: "--color-secondary-800" },
  { label: "Secondary 700", value: "--color-secondary-700" },
  { label: "Secondary 600", value: "--color-secondary-600" },
  { label: "Secondary 500", value: "--color-secondary-500" },
  { label: "Secondary 400", value: "--color-secondary-400" },
  { label: "Secondary 300", value: "--color-secondary-300" },
  { label: "Secondary 200", value: "--color-secondary-200" },
  { label: "Secondary 100", value: "--color-secondary-100" },
  { label: "Tertiary 900", value: "--color-tertiary-900" },
  { label: "Tertiary 800", value: "--color-tertiary-800" },
  { label: "Tertiary 700", value: "--color-tertiary-700" },
  { label: "Tertiary 600", value: "--color-tertiary-600" },
  { label: "Tertiary 500", value: "--color-tertiary-500" },
  { label: "Tertiary 400", value: "--color-tertiary-400" },
  { label: "Tertiary 300", value: "--color-tertiary-300" },
  { label: "Tertiary 200", value: "--color-tertiary-200" },
  { label: "Tertiary 100", value: "--color-tertiary-100" },
  { label: "Grey 900", value: "--color-grey-900" },
  { label: "Grey 800", value: "--color-grey-800" },
  { label: "Grey 700", value: "--color-grey-700" },
  { label: "Grey 600", value: "--color-grey-600" },
  { label: "Grey 500", value: "--color-grey-500" },
  { label: "Grey 400", value: "--color-grey-400" },
  { label: "Grey 300", value: "--color-grey-300" },
  { label: "Grey 200", value: "--color-grey-200" },
  { label: "Grey 100", value: "--color-grey-100" },
  { label: "Util-red", value: "--color-util-red" },
  { label: "Util-green", value: "--color-util-green" },
  { label: "Util-yellow", value: "--color-util-yellow" },
  { label: "Util-White", value: "--color-util-white" },
];

const colorsSchemaPicker = [
  { label: "Primary", value: "--color-primary-900" },
  { label: "Secondary", value: "--color-secondary-900" },
  { label: "Tertiary", value: "--color-tertiary-900" },
  { label: "Black", value: "--color-grey-900" },
  { label: "Util - Red", value: "--color-util-red" },
  { label: "Util - Green", value: "--color-util-green" },
  { label: "Util - Yellow", value: "--color-util-yellow" },
  { label: "Util - White", value: "--color-util-white" },
];

/*
  Fonts - Typography
*/
const fonts = [
  { label: "Gibson", value: "'canada-type-gibson', sans-serif" },
  { label: "Mono", value: "'mono', monospace" },
];

/*
  Button - Styles
*/

const buttonStyles = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Tertiary", value: "tertiary" },
];

/*
  Heading - Styles
*/
const headingStyles = [
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "H3", value: "h3" },
  { label: "H4", value: "h4" },
  { label: "H5", value: "h5" },
  { label: "H6", value: "h6" },
];

/*
  Text - Alignments
*/
const textAligments = [
  { label: "Top Right", value: "set--v-align-top set--h-align-right" },
  { label: "Top Center", value: "set--v-align-top set--h-align-center" },
  { label: "Top Left", value: "set--v-align-top set--h-align-left" },
  { label: "Middle Right", value: "set--v-align-middle set--h-align-right" },
  { label: "Middle Center", value: "set--v-align-middle set--h-align-center" },
  { label: "Middle Left", value: "set--v-align-middle set--h-align-left" },
  { label: "Bottom Right", value: "set--v-align-bottom set--h-align-right" },
  { label: "Bottom Center", value: "set--v-align-bottom set--h-align-center" },
  { label: "Bottom Left", value: "set--v-align-bottom set--h-align-left" },
];

/*
  SVG - Icons
*/
const icons = [
  { label: "Chevron Down", value: "chevron-down" },
  { label: "Chevron Left", value: "chevron-left" },
  { label: "Chevron Right", value: "chevron-right" },
  { label: "Chevron Up", value: "chevron-up" },
  { label: "Left Arrow", value: "left-arrow" },
  { label: "Right Arrow", value: "right-arrow" },
  { label: "Account", value: "account" },
  { label: "Cart", value: "cart" },
  { label: "Checkmark", value: "check" },
  { label: "Circle Check", value: "circle-check" },
  { label: "Close", value: "close" },
  { label: "Hamberger", value: "hamberger" },
  { label: "Heart", value: "heart" },
  { label: "Plus", value: "plus" },
  { label: "Minus", value: "minus" },
  { label: "Search", value: "search" },
];

module.exports = {
  uikit: {
    colorsPrimary,
    colorsSecondary,
    colorsTertiary,
    colorsGreyScale,
    colorsUtil,
    colorsSchemaPicker: JSON.stringify(colorsSchemaPicker),
    colorsAll: JSON.stringify(colorsAll),
    fonts: JSON.stringify(fonts),
    icons: JSON.stringify(icons),
    buttonStyles: JSON.stringify(buttonStyles),
    headingStyles: JSON.stringify(headingStyles),
    textAligments: JSON.stringify(textAligments),
  },
};

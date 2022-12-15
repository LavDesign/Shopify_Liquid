# The Stable Shopify Theme

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

This repo contains the Shopify 2.0 compatible theme code for a Shopify Plus storefront.

## Background

### Base Theme

- [Dawn 7.0.1](https://github.com/Shopify/dawn/releases/tag/v7.0.1)

### Tech Stack

- [Liquid](https://shopify.dev/api/liquid) / HTML
- [Tailwind](https://tailwindcss.com/docs) + [SCSS](https://sass-lang.com/documentation)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Vue (3.x)](https://vuejs.org/guide/introduction.html) & [Pinia](https://pinia.vuejs.org/)
- [Webpack](https://webpack.js.org/)
- [Gulp](https://gulpjs.com/) (Icons only)
- [NPM](https://www.npmjs.com/)

### Project Structure

`./`

- [.browserslistrc](./.browserslistrc): Config file for [Browserlist](https://github.com/browserslist/browserslist)
- [.editorconfig](./.editorconfig): Config file for [EditorConfig](https://editorconfig.org/)
- [.eslintrc.js](./.eslintrc.js): Config file for [ESLint](https://eslint.org/docs/user-guide/configuring/configuration-files)
- [.gitignore](./.gitignore): Config file for [gitignore](https://git-scm.com/docs/gitignore)
- [.nvmrc](./.nvmrc): Used to set the NPM version using [NVM](https://github.com/nvm-sh/nvm#nvmrc)
- [.prettierrc](./.prettierrc): Config for [Prettier](https://prettier.io/docs/en/configuration.html)
- [.shopifyignore](./.shopifyignore): Config for [Shopify CLI Ignores](https://shopify.dev/themes/tools/cli#excluding-files-from-shopify-cli)
- [.stylelintrc.js](./.stylelintrc.js): Config for [StyleLint](https://stylelint.io/user-guide/configure/)
- [bedrock.config.js](./bedrock.config.js): Config for [Bedrock Styles](https://the-stable-1.gitbook.io/bedrock-ui/getting-started/installation)
- [ejs-utils.js](./ejs-utils.js): EJS utils, like `render`, used in [webpack.common.js](./webpack.common.js)
- [gulpfile.js](./gulpfile.js): Gulp tasks, used for project icons
- [postcss.config.js](./postcss.config.js): PostCSS config, used in [webpack.common.js](./webpack.common.js)
- [package.json](./package.json): Project metadata & scripts and NPM package dependencies ([ref](https://docs.npmjs.com/cli/v7/configuring-npm/package-json))
- [package-lock.json](./package-lock.json): Lockfile for NPM package dependencies ([ref](https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json))
- [webpack-utils.js](./webpack-utils.js): Webpack utils like `resolveEntries`, used in [webpack.common.js](./webpack.common.js)
- [webpack.common.js](./webpack.common.js): Shared config for [Webpack](https://webpack.js.org/configuration/)
- [webpack.dev.js](./webpack.dev.js): Local development config for [Webpack](https://webpack.js.org/configuration/)
- [webpack.prod.js](./webpack.prod.js): Production config for [Webpack](https://webpack.js.org/configuration/)

`.github/`

GitHub utilities like pull-request templates and actions ([ref](https://stackoverflow.com/a/61301254))

`dist/`

- Built by Webpack and is what, ultimately, gets pushed to Shopify; follows [Shopify Theme Architecture](https://shopify.dev/themes/architecture) and uses [Shopify CLI for Themes](https://shopify.dev/themes/tools/cli)
- This directory is ignored in [.gitignore](./gitignore)

`src/`

Contains all files that get built to the `dist/` directory.

- [theme-base](./src/theme-base): Stores the base Shopify liquid theme boilerplate
  - [/ejs](./src/theme-base/ejs): EJS schema
  - [/entries](./src/theme-base/entries): Webpack entry files
  - [/icons](./src/theme-base/icons): Icon SVG(s), see: [Build / Update Icons](#build--update-icons)
  - [/js](./src/theme-base/js): [Vanilla] Javascript file(s)
  - [/scss](./src/theme-base/scss): Base Theme
  - [/shopify](./src/theme-base/shopify): Shopify theme files
  - [/vue](./src/theme-base/vue): Vue file(s)
- [theme-override](./src/theme-override): Overrides for the base theme
  - _Folders of the same name match the purpose described above_

### Theme Override System

This theme implements a theme-override system that allows developers to inherit and make changes to a theme base without having to directly edit the base files.

Generally, you can assume that a file in the override directory will "win". This system has a few touchpoints, which are listed below:

**Webpack Config → Entry Points**

Entrypoints are resolved between `src/theme-base/entries` and `src/theme-override/entries/`. Entry points with the same path and name in the override directory "win".

See: [webpack.common.js](./webpack.common.js) → `modules.exports.entry`

**Webpack Config → Resolver → RevolverWebpackPlugin**

Relative imports like `../vue/filters/image.js` shouldn't need to consider if the file is in `src/theme-base` or `src/theme-overrides` directories.

The `RevolverWebpackPlugin` added to the Webpack resolver config allows Webpack to resolve relative imports between the theme directories so we can omit them while importing.

_TL;DR_

For example, in `src/theme-override/entries/main.js`:

```javascript
// Don't do this...
import { getSizedImageFromUrl } from "../../theme-base/vue/filters/image.js";

// Do this instead!
import { getSizedImageFromUrl } from "../vue/filters/image.js";
```

See [webpack.common.js](./webpack.common.js) → `modules.exports.resolver.plugins`

**Webpack Config → Plugins → CopyWebpackPlugin**

The CopyWebpackPlugin handles merging files from `src/theme-base/shopify` and `src/theme-override/shopify` into the Webpack `output.path` directory which is usually `./dist`. Files with the same path and name in the override directory "win".

See [webpack.common.js](./webpack.common.js) → `modules.exports.plugins`

**Gulpfile → Build Icons**

Icons live in `src/theme-base/icons` and `src/theme-override/icons`. Icons of the same name will "win".

These files are compiled using Gulp and are injected into the `src/theme-base/icon-store.liquid` which is pushed into `dist` after the Webpack build.

Some notes:

- There should be no reason to override the `icon-store.liquid` so it will always use the one in `src/theme-base/icons`. If you want to override it, copy it into `src/theme-override/icons` and update the [gulpfile.js](./gulpfile.js).

See: [gulpfile.js](./gulpfile.js) → `buildIcons`

See: [webpack.dev.js](./webpack.dev.js) → `module.exports.plugins`

See: [webpack.prod.js](./webpack.prod.js) → `module.exports.plugins`

### Theme Merchandising

"Theme merchandising" refers to files in `/shopify` that contain settings and data that can be modified with Shopify's theme customizer.

- `/shopify/config/settings_data.json`
- `/shopify/config/settings_schema.json`
- `/shopify/templates/**/*.json`
- `/shopify/locales/**/*.json`

**Theme Base**

Theme base versions a baseline set of merchandising to ensure easy project setup. See [.gitignore](./.gitignore).

**Theme Overrides**

Theme override ignores `config/settings_data.json` and `templates/**/*.json` by default. Optionally you can also ignore `config/settings_schema.json` and `locales/**/*.json`. See [.gitignore](./.gitignore).

> See also: [Pulling Merchandising Files](#pulling-theme-merchandising-files)

> See also: [How to Remove a File from Version Control](#how-to-remove-a-file-from-version-control)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Appendix](#appendix-project-setup)
- [License](#license)

## Install

### System Dependencies

Ensure the following is installed on your machine (click the links to find install instructions).

- [NVM](https://github.com/nvm-sh/nvm) (recommended)
  - [Node](https://nodejs.org/en/download/package-manager/)
  - [NPM](https://docs.npmjs.com/about-npm)
- [Shopify CLI (2.x)](https://shopify.dev/themes/tools/cli/cli-2/upgrade-uninstall)
  - If you have Shopify CLI 3 installed, see

### Access

- Access to the storefront via the [BVA Shopify Partner Portal](https://partners.shopify.com/154501/stores) or the [Zehner Shopify Partner Portal](https://partners.shopify.com/489730/stores)
- In some cases staff-level access to the project storefront may be necessary, check with a technical lead.

### Setup

```bash
# Set correct node version.
#   - If not installed try: `nvm install $(cat .nvmrc)`
#     otherwise install manually using nvm install [VERSION].
#   - See nvm --help
#   - See .nvmrc
nvm use

# Install deps from the package.lock.json (and don't regenerate it).
# If package-lock.json is not present run `npm i` instead
#   and commit package-lock.json to version control.
npm ci

# Log into the storefront.
# npm run login:[dev|prod]
# ex.
npm run login:prod

# Clean
# - Optional
# - Only needed if you previously had this project cloned
#   before this README was updated.
npm run clean-merch

# Pull down latest merchandising into the repo:
#   - See: Appendix: Pulling Theme Merchandising Files
npm run pull-merch
```

## Usage

## Local Development

```bash
# Start the Webpack watch and create a Shopify development theme.
npm run start
```

> See: [package.json](./package.json) for all available commands.

### Build / Update Icons

> This task is separate from `webpack` because it cannot be easily replicated there.

This project can build icon SVG files into a single icon store that allows easy inclusion into the build (see [CSS-Tricks: SVG Symbol a Good Choice for Icons](https://css-tricks.com/svg-symbol-good-choice-icons/)).

```bash
# Run the icon build task
npm run gulp:icons

# Run the icon watch task
npm run gulp:icons-watch
```

- To add an icon, add the SVG file to `src/icons/`
- To update the `icon-store.liquid` edit the file in `src/icons`
- See the example below on how to include an icon

**Example Include:**

```html
<svg width="100" height="100">
  <use xlink:href="#cart-empty" />
</svg>
```

### Deploy to Shopify (manual, from local)

```bash
# Deploy to a new Shopify preview theme.
# Name the theme something clear & useful, ex.
#   - [PROJ-123] Fix Header on Mobile (Bob)
#   - [DEV] Testing (Bob)
npm run deploy:new
```

```bash
# Deploy to an existing preview (or live) theme.
#   - Select the theme from the list displayed after running this command.
npm run deploy
```

> See: [package.json](./package.json) for all available commands.

## Contributing

This project uses several tools to ensure code consistency & quality:

- [EditorConfig](https://editorconfig.org/) - Editor formatting rules
- [Prettier](https://prettier.io/docs/en/) – Javascript, CSS, SCSS formatting
- [Prettier VSCode Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Editor on demand formatting
- [ESLint](https://eslint.org/docs/user-guide/getting-started) – Javascript linting (integrated with Prettier)
- [StyleLint](https://stylelint.io/user-guide/get-started) – CSS, SCSS linting (integrated with Prettier)
- [Theme Check](https://shopify.dev/themes/tools/theme-check) – Shopify theme Liquid and JSON linting

### VSCode Setup

_Set the following settings (user or workspace level)_

- Settings → Editor → Default Formatter: `prettier`
- Settings → Editor → Format On Save: `true` (optional, if not set you're responsible for making sure files are formatted)

Install the following extensions to setup formatting & linting in real time (when applicable, these extensions will autoload local config):

- [EditorConfig for VSCode](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Vue](https://marketplace.visualstudio.com/items?itemName=jcbuisson.vue)

## Appendix: Shopify CLI 2.x

As of October 2022, Shopify released a new version of the CLI, 3.x, that has breaking changes. As noted in [System Dependencies](#system-dependencies), this repo requires Shopify CLI 2.x.

If you've installed or upgraded the Shopify CLI after October 2022, you will be on Shopify CLI 3.x. Unfortunately, it is not compatible with this repository (for now).

For now the workaround is to uninstall 3.x and re-install 2.x, see below:

- Uninstall 3.x – If you used `brew` run `brew uninstall shopify-cli`.
- To install 2.x, follow [these install instructions](https://shopify.dev/themes/tools/cli/cli-2/upgrade-uninstall)
- Then run `which shopify2` (note the "2" at the end)
- Take note of the path this command returns
- Then create a symlink to `shopify`: `ln -s $(which shopify2) /path/from/before/shopify`
- For example, `ln -s %(which shopify2) /opt/homebrew/bin/shopify`

You can test everything went OK by running: `shopify help` (you should see the help string)

> NOTE: If uninstalling 3.x is not an option, alternatively you could install 2.x and update the package.json in this repo to use `shopify2` as opposed to `shopify`. You'll need to make sure all developers on the project then install 2.x using the link above so it's available to them.

## Appendix: Misc

### Troubleshooting Shopify CLI

When the Shopify CLI errors, it can be a bit cryptic:

```bash
✗ An unexpected error occurred.
```

You can get more useful error output from the CLI if you set this env. setting in your terminal and running the failing command again:

```bash
export SHOPIFY_CLI_STACKTRACE=1
```

### Pulling Theme Merchandising Files

You can pull the files above into your local project using one or more of the following commands:

**Macro Commands**

```bash
# Pull all merch (templates/*.json, config/settings_data.json, & locales/*.json)
npm run pull-merch

# Pull all merch from your dev theme (templates/*.json, config/settings_data.json, & locales/*.json)
npm run pull-dev-merch

# Clean all merch (templates/*.json, config/settings_data.json, & locales/*.json)
npm run clean-merch
```

**Granular Commands**

```bash
# Pull templates from the selected theme
npm run pull:templates

# Pull templates from your development theme.
#   - This is useful if you've setup some merchandising on your dev theme
npm run pull-dev:templates

# Pull config/settings_data.json
# from the selected theme
npm run pull:config

# Pull config/settings_data.json
# from the your development theme.
#   - This is useful if you've setup some merchandising on your dev theme
npm run pull-dev:config

# Pull locales/*.json from the selected theme.
npm run pull:locales

# Pull locales/*.json from your development theme.
#   - This is useful if you've setup some merchandising on your dev theme
npm run pull-dev:locales

# Remove these files with the following
npm run clean:templates
npm run clean:config
```

### Pulling Other Theme Files

Pulling down other theme files is useful when trying to pull in changes made in Shopify into the repository (for example when an app injects snippets and changes).

> It's best to pull the files down into a clean working directory and then use **git** to inspect changes.

```bash
# Check for a clean working directory
#   - This should output: nothing to commit, working tree clean.
#   - If not, then commit your changes.
git status

# Pull down all theme files from Shopify.
npm run pull-theme

# Check for changes, additions, and deletions.
git status

# Inspect changes to all files.
git diff

# Inspect changes to one file.
git diff path/to/file.json
```

### Troubleshooting Missing Files from Pull Commands

Certain conditions may cause the CLI to miss some files in the remote Shopify theme. So far this has been observed when two template/_.json files shared the same _.json name with an additional \*.liquid extension.

For example, the CLI may not pull down the \*.json version in the following case:

- cart.json
- cart.json.liquid

There isn't an obvious way to get the CLI to pull down the `*.json` file.

**Workarounds**

- Avoid naming files this way (if possible)
- Add the `*.json` file to version control (by adding an explicit unignore to .gitignore) and manually update it regularly (i.e. pulling file contents directly from Shopify and making a commit)
- When deploying to a new theme, go to the storefront and manually duplicate a theme and then deploy to it(as opposed to using `deploy:new`)

### Linting Commands

> See: [package.json](./package.json) for all available commands.

```bash
# Linting
npm run lint:js
npm run lint:css
npm run lint:shopify

# Auto-fix
npm run fix:js
npm run fix:css
npm run fix:shopify
```

### How to Remove a File From Version Control

```bash
git rm --cached [FILE_PATH]

# This will result in an "untracked" file until you update the .gitignore
git commit -m "Removing [FILE_NAME] from repo"
```

Then, add the path in [.gitignore](./.gitignore) file and commit your changes.

## License

UNLICENSED

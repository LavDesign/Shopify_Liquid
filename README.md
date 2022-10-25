# Shopify Bedrock Liquid Mono Repo

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

This "mono" repo holds all packages related to the Bedrock on Liquid reference architecture.

This repo uses [Yarn Workspaces](https://yarnpkg.com/features/workspaces#gatsby-focus-wrapper) and [Lerna](https://lerna.js.org/docs/getting-started) to manage multiple packages related to the Bedrock on Liquid implementation. Check out the links for more information.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Install

### System Dependencies

Ensure the following are installed on your machine (follow the links for install instructions).

- [NVM](https://github.com/nvm-sh/nvm) (recommended)
  - [Node](https://nodejs.org/en/download/package-manager/) (see [.nvmrc](./.nvmrc) for version)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) (Latest)
- [NPX](https://www.npmjs.com/package/npx) (Latest, used to run `lerna`)

## Usage

### Local Development Setup

```bash
# This project requires Yarn workspaces, run this if you haven't already
yarn config set workspaces-experimental true

# Install deps
yarn
```

## Contributing

## Contributing

This project uses several tools to ensure code consistency & quality:

- [EditorConfig](https://editorconfig.org/) - Editor formatting rules
- [Prettier](https://prettier.io/docs/en/) – Javascript, CSS, SCSS formatting
- [Prettier VSCode Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Editor on demand formatting
- [ESLint](https://eslint.org/docs/user-guide/getting-started) – Javascript linting (integrated with Prettier)
- [StyleLint](https://stylelint.io/user-guide/get-started) – CSS, SCSS linting (integrated with Prettier)
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

## License

None © The Stable 2022

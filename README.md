# Shopify Liquid Mono Repo

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

This "mono" repo holds all packages related to The Stable Shopify liquid reference architecture.

This repo uses [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) and [Lerna](https://lerna.js.org/docs/getting-started). Click the links for more information.

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
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) (1.x)
- [NPX](https://www.npmjs.com/package/npx) (Latest, used to run `lerna`)
- [Shopify CLI](https://shopify.dev/themes/tools/cli/install) (3.x)

### Setup

#### Verifying Shopify CLI Version
This repository was built for use with Shopify CLI v3.x.x and is not compatible with earlier versions. To avoid version specific issues with commands in other codebases, this repo uses the `shopify3` command for all Shopify CLI commands.

Configuring the `shopify3` command is different depending on the currently install CLI version on your machine. Check which version your machine is running with `shopify version`

**Shopify CLI versions 2.x**

If your machine is running Shopify CLI v2.x, you can safely install and run Shopify CLI v3.x via Homebrew by specifying the version

```
# Install Shopify CLI v3
brew tap shopify/shopify
brew install shopify-cli@3

# Verify install
shopify3 version

```

**Shopify CLI versions 3.x**

If your machine is already running Shopify CLI v3.x, you still have the option to install using the instructions above. If you'd prefer to use a single installation of the Shopify CLI, you can create a symlink to the existing install using the instructions below.


```
# Make a symlink for 'shopify3' assuming shopify-cli was installed using Homebrew

ln -s $(which shopify) /opt/homebrew/bin/shopify3
```


#### Setup local NPM config, `.npmrc`

```bash
cp .npmrc.example .npmrc
```

- Replace the `<TOKEN>` value in the line `//registry.npmjs.org/:_authToken=<TOKEN>` with your a read-only or publish token issued from the `bvaadmin` NPM account. If you need a token, request it from the tech lead.

#### Install Node Packages

```bash
yarn
```

## Usage

> Make sure you've completed the [Setup](#setup) above.

```
nvm use
cd packages/shopify-liquid-theme
yarn start
```

- See [shopify-liquid-theme/README.md](./packages/shopify-liquid-theme/README.md) for more details.

## Contributing

This project uses several tools to ensure code consistency & quality:

- [EditorConfig](https://editorconfig.org/) - Editor formatting rules
- [Prettier](https://prettier.io/docs/en/) – Javascript, CSS, SCSS formatting
- [Prettier VSCode Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Editor on demand formatting
- [ESLint](https://eslint.org/docs/user-guide/getting-started) – Javascript linting (integrated with Prettier)
- [StyleLint](https://stylelint.io/user-guide/get-started) – CSS, SCSS linting (integrated with Prettier)
- [Theme Check](https://shopify.dev/themes/tools/theme-check) – Shopify theme Liquid and JSON linting

### VSCode Setup

Install the following extensions to setup formatting & linting in real time (when applicable, these extensions will autoload local config):

- [EditorConfig for VSCode](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Vue](https://marketplace.visualstudio.com/items?itemName=jcbuisson.vue)

_Set the following settings (user or workspace level)_

- Settings → Editor → Default Formatter: `prettier`
- Settings → Editor → Format On Save: `true` (optional, if not set you're responsible for making sure files are formatted)
- Settings → Theme Check → Only Single File Checks: `true` (improves performance of the theme check server)

## License

None © The Stable 2022

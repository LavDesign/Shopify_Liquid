# Shpoify Liquid CLI

This package contains the Shopify-liquid command-line which contains commands and utilities for working with the Shopify Liquid theme reference architecture.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Install

### System Dependencies

See the parent [README.md](../../README.md)

### Setup

**Expose to commandline**
```bash
cd ./packages/shpoify-liquid-cli
npm link
```

**Install as sibling dependency**
```bash
# NOTE: From the project root!
yarn workspace @bva/<PACKAGE NAME> add @bva/shpoify-liquid-cli@^<VERSION>

# Example
yarn workspace @bva/foo-bar-baz add @bva/shopify-liquid-cli@^0.0.0
```

## Usage

```bash
shopify-liquid-cli --help
```

## Contributing

See the parent [README.md](../../README.md)

## License

None © The Stable 2022

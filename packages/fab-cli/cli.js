#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();

program.name("fab").version("0.0.0").command("hello", "Say Hello!", {
  executableFile: "commands/hello.js",
});

program.parse(process.argv);

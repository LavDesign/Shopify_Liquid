const { Command } = require("commander");
const program = new Command();

program
  .name("fab hello")
  .argument("<message>", "Your message")
  .option("-j, --json", "Return output as json.", false);

program.parse(process.argv);

function main({ message, opts }) {
  const output = `Hello ${message}`;
  const asJson = opts.json;

  if (asJson) {
    console.log(JSON.stringify({ output }));
  } else {
    console.log(output);
  }
}

const message = program.args[0];
const opts = program.opts();
main({ message, opts });

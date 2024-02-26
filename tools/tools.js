const { program } = require("commander");
const path = require("path");
const { rm, cp, rename } = require("fs/promises");
const { execSync } = require("child_process");

const rootDir = path.dirname(__dirname);

async function prepareLinguiConfig() {
  await rename("./.babelrc", "./nextjs-babel-config");
  await cp("./tools/.babelrc-lingui", "./.babelrc");
}

async function restoreNextjsConfig() {
  await rm("./.babelrc");
  await rename("./nextjs-babel-config", "./.babelrc");
}

async function main() {
  process.chdir(rootDir);

  program.command("lingui-extract").action(async () => {
    try {
      await prepareLinguiConfig();
      execSync("npx lingui extract", { stdio: "inherit" });
    } finally {
      await restoreNextjsConfig();
    }
  });

  program.command("lingui-compile").action(async () => {
    try {
      await prepareLinguiConfig();
      execSync("npx lingui compile", { stdio: "inherit" });
    } finally {
      await restoreNextjsConfig();
    }
  });

  await program.parseAsync();
}

main();

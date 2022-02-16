#!/usr/bin/env node
const program = require("commander");
const api = require("./index.js");

program
  .command("add")
  .description("添加标签")
  .action((...args) => {
    const words = args.slice(0, -1).join(" ");
    api.add(words);
  });
program
  .command("clear")
  .description("清空标签")
  .action(() => {
    api.clear().then(
      () => {
        console.log("清除成功");
      },
      () => {
        console.log("清除失败");
      }
    );
  });
program.parse(process.argv);

if (process.argv.length === 2) {
  api.showAll();
}

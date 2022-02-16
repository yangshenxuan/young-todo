const db = require("./db");
const inquirer = require("inquirer");

module.exports.add = async (title) => {
  //读取之前的
  const list = await db.read(); //db对象，面向接口编程
  //写入现在的
  list.push({ title, done: false });
  //存入数据库
  await db.write(list);
};
module.exports.clear = async () => {
  await db.write([]);
};
function askForAction(list, index) {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "请选择操作",
      choices: [
        { name: "退出", value: "quit" },
        { name: "已完成", value: "markAsDone" },
        { name: "未完成", value: "markAsUndone" },
        { name: "改标题", value: "updateTitle" },
        { name: "删除", value: "remove" },
      ],
    })
    .then((answer2) => {
      switch (answer2.action) {
        case "markAsDone":
          list[index].done = true;
          db.write(list);
          break;
        case "markAsUndone":
          list[index].done = false;
          db.write(list);
          break;
        case "updateTitle":
          inquirer
            .prompt({
              type: "list",
              name: "action",
              message: "请选择操作",
              default: list[index].title,
            })
            .then((answer) => {
              list[index].title = answer.title;
              db.write(list);
            });
          break;
        case "remove":
          list.splice(index, 1);
          db.write(list);
          break;
      }
    });
}
function askForCreateTask(list) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "输入任务标题",
    })
    .then((answer) => {
      list.push({
        title: answer.title,
        done: false,
      });
      db.write(list);
    });
}
function printTasks(list) {
  inquirer
    .prompt({
      type: "list",
      name: "index",
      message: "请选择你想操作的任务",
      choices: [
        { name: "退出", value: "-1" },
        ...list.map((task, index) => {
          return {
            name: `${task.done ? "[x]" : "[_]"} ${index + 1}-${task.title}`,
            value: index.toString(),
          };
        }),
        { name: "+ 创建任务", value: "-2" },
      ],
    })
    .then((answer) => {
      const index = parseInt(answer.index);
      if (index >= 0) {
        askForAction(list, index);
      } else if (index === -2) {
        askForCreateTask(list);
      }
    });
}
module.exports.showAll = async () => {
  const list = await db.read();

  //printTasks
  printTasks(list);
};

const schedule = require("node-schedule");
const eventLint = require("./codeLint");
const path = require("path");
const inquirer = require('inquirer');
const fs = require("fs");
// const projectConfig = require("../ehuodiManagement" + path.resolve(process.cwd(), './abc.json'));
const userProjectConfig = require(process.cwd() + "/abc.json");
var projectConfig = JSON.parse(JSON.stringify(userProjectConfig))
let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 5;
rule.minute = 0;

// let startTime = new Date(Date.now() + 1000);
// let endTime = new Date(startTime.getTime() + 1000);
// let date = new Date(2017, 10, 23, 13, 27, 0);

const startTimeMisson = () => {
  schedule.scheduleJob(
    rule,
    // { start: startTime, end: endTime, rule: "*/1 * * * * *" },
    function () {
      console.log("start......", new Date());
      eventLint(projectConfig);
    }
  )
};
const startChoose = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'way',
        message: '请选择您需要检查的代码?',
        choices: [
          '所有主干内容',
          '在开发的分支（从abc.json中读取）'
        ]
      }
    ])
    .then(answers => {
      switch (answers.way) {
        case '所有主干内容':
          projectConfig.workspace = {}
          files = fs.readdirSync('./');
          files.forEach(function (file, index) {
            var curPath = "./" + file;
            if (fs.statSync(curPath).isDirectory()&&fs.readdirSync(curPath).includes('trunk')) { // recurse  
              projectConfig.workspace[file] = {
                "branch": "trunk",
                "active": true
              }

            }
          });
          chooseTime()
          break;
        case '在开发的分支（从abc.json中读取）':
          chooseTime()
          break;
      }
    });
}

const chooseTime = () => {


  inquirer
    .prompt([
      {
        type: 'list',
        name: 'mode',
        message: '请选择您需要的运行方式?',
        choices: [
          '立即检查',
          '定时任务'
        ]
      }
    ])
    .then(answers => {
      switch (answers.mode) {
        case '立即检查':
          eventLint(projectConfig);
          break;
        case '定时任务':
          startTimeMisson()
          break;
      }
    });
}

startChoose()
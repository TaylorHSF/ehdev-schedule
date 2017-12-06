const schedule = require("node-schedule");
const eventLint = require("./codeLint");
const path = require("path");
// const projectConfig = require("../ehuodiManagement" + path.resolve(process.cwd(), './abc.json'));
const projectConfig = require(process.cwd()+"/abc.json");

let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 5;
rule.minute = 0;

// let startTime = new Date(Date.now() + 1000);
// let endTime = new Date(startTime.getTime() + 1000);
// let date = new Date(2017, 10, 23, 13, 27, 0);
schedule.scheduleJob(
  rule,
  // { start: startTime, end: endTime, rule: "*/1 * * * * *" },
  function() {
    console.log("start......", new Date());
    eventLint(projectConfig);
  }
);
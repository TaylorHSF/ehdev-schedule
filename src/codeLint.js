const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const gulp = require("gulp");
const eslint = require("gulp-eslint");
const pump = require("pump");
const logger = require("gulp-logger");
const gulpif = require('gulp-if');
const runSequence = require("run-sequence");
const eslintFormatter = require("eslint-friendly-formatter");
const sendMail = require("./sendMail");

module.exports = projectConfig => {
  const projectList = Object.keys(projectConfig.workspace);
  let countObj = {
    error: {},
    warning:{}
  }
  let attachments = [];
  let storeIndex = [];
  let emailContent = '';
  console.log(process.cwd())
  projectList.forEach(function(project, index) {
      attachments.push({
        filename: `eslintReport-${project}.html`,
        path: `eslintReport-${project}.html`
      });
      let codeSrc = `${process.cwd()}/${project}/trunk/**/*.js`;
      pump([
        gulp.src(codeSrc),
        logger({
          before: "Starting eslint ...",
          after: "Eslint complete!",
          showChange: true
        }),
        gulpif(
          file => {
            if (path.basename(file.path, ".js").includes(".min")) {
              return false;
            }
            return true;
          },
          eslint({
            configFile: path.join(__dirname, "../.eslintrc")
          })
        ),
        eslint.format(
          "html",
          fs.createWriteStream(`eslintReport-${project}.html`)
        ),
        eslint.result(function(result){
          if(countObj.error[project]==null){
            countObj.error[project] = result.errorCount;
            countObj.warning[project] = result.warningCount;
          }else{
            countObj.error[project] += result.errorCount;
            countObj.warning[project] += result.warningCount;
          }
        }),
        gulp.dest('./dists')
      ],
        function(err) {
          
          storeIndex.push(index);
          if(storeIndex.length===projectList.length){
            function deleteAllCache(path) {  
              var files = [];  
              if(fs.existsSync(path)) {  
                  files = fs.readdirSync(path);  
                  files.forEach(function(file, index) {  
                      var curPath = path + "/" + file;  
                      if(fs.statSync(curPath).isDirectory()) { // recurse  
                        console.log('deleting in '+curPath)
                        deleteAllCache(curPath);  
                      } else { // delete file  
                          console.log('deleting  '+curPath)
                          fs.unlinkSync(curPath);  
                      }  
                  });  
                  fs.rmdirSync(path);  
              }  
            };  
            deleteAllCache(process.cwd()+'/dists')

            for(let key in countObj.error){
              emailContent += `${key}模块中共有<span style='red'>${countObj.error[key]}个错误</span>，${countObj.warning[key]}个警告。请查看eslintReport-${key}.html<br>`;
            }
            console.log('sending report mail please wait...')
            sendMail.send(`${emailContent}<br>请查看附件📎<br><br>这是来自nodemailer的邮件,请勿回复！回复也不搭理！`, attachments);
          }
          console.log(
            chalk.red(
              `ESLintError in project! Please check eslintReport-${project}.html for details! Fix and rebuild!`
            )
          );
        });
  });
  
};

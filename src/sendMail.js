const nodemailer = require("nodemailer");

exports.send = (mailConfig,html, attachments,receiver) => {
  //配置邮件
  if(!mailConfig){
    console.log('找不到邮件配置')
    return
  }
  let transporter = nodemailer.createTransport(mailConfig);
  
  let option = {
    from: '"ehdfe_public"<ehdfe_public@163.com>',
    to: receiver.join(",")/* ,
    bcc: "doublejoke@163.com" */
  };
  option.subject = "EHDFE Eslint Report";
  option.html = html;
  option.attachments = attachments;
  transporter.sendMail(option, function(error, response) {
    if (error) {
      console.log("fail: " + error);
    } else {
      console.log("Mail sent success.");
    }
  });
};

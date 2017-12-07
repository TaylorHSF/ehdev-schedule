const nodemailer = require("nodemailer");

exports.send = (html, attachments,receiver) => {
  //配置邮件
  let transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    secureConnection: true,
    port: 465,
    auth: {
      user: "ehdfe_public@163.com",
      pass: "eslintno1" 
    }
  });
  
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

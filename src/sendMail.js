const nodemailer = require("nodemailer");

exports.send = (html, attachments) => {
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
  let toList = [
    //"15412@etransfar.com",
    // "15621@etransfar.com",
    // "16639@etransfar.com",
    // "12613@etransfar.com",
     "15617@etransfar.com",
    // "17323@etransfar.com",
    // "17356@etransfar.com",
    // "15145@etransfar.com",
    // "12504@etransfar.com",
    // "17196@etransfar.com",
    // "geek_he@126.com"
  ];
  let option = {
    from: '"ehdfe_public"<ehdfe_public@163.com>',
    to: toList.join(",")/* ,
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

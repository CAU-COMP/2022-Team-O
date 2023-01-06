import {sendEmail, sendTemplateEmail} from "./sendEmail.js"
import fs from "fs"

function mailHandler(){
    const bodyContent = fs.readFileSync("./Test2.html", "utf8");
    // bodyContent = "TestBodyContent";
    // params : recipientEmail, bodyContent, mailTitle
    sendEmail("na_sanghyun@naver.com",bodyContent,"MailTitle")
    .then(
        function(data) {
          console.log(data);
        })
    .catch(
          function(err) {
          console.error(err, err.stack);
        }); 
}
mailHandler();

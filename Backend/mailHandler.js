import {sendEmail, sendTemplateEmail} from "./sendEmail.js"
import fs from "fs"

let bodyContent = " ";

function mailHandler(){
    fs.readFile("./Test2.html", "utf8", function (err, data) {
        if (err) throw err;
        bodyContent = data;
    });
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

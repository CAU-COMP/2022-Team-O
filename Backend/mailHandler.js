import {sendEmail, sendTemplateEmail} from "./sendEmail.js"
import fs from "fs"

let bodyContent = " ";

function mailHandler(){
    fs.readFile("./Test.html", function (err, data) {
        if (err) throw err;
        bodyContent = data;
    });
    
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
import {sendEmail, sendTemplateEmail} from "./sendEmail.js"

function mailHandler(){
    const bodyContent = [
        "This is Body Content"
    ];
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
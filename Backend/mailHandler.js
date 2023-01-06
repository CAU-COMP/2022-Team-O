import * as sender from "./sendEmail.js"

function mailHandler(){
    const bodyContent = [
        "This is Body Content"
    ];
    sender.sendEmail("na_sanghyun@naver.com","NaSangHyun","MailTitle")
    .then(
        function(data) {
          console.log(data);
        })
    .catch(
          function(err) {
          console.error(err, err.stack);
        }); // params : recipientEmail, bodyContent, mailTitle
}
mailHandler();
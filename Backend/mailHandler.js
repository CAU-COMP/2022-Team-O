import {sendEmail, sendTemplateEmail} from "./sendEmail.js"
import fs from "fs"

function mailHandler(){
    // 수신자주소, 바디내용, 메일 제목을 받음
    // 바디 내용에는 어느 게시판을 구독했는지에 따라 추가적인 내용이 들어갈 수 있으므로
    // 앞부분 스트링을 bodyContent라는 string에 저장하고,
    // 그 뒷 부분에 추가할 부분을 <a href></a>로 추가하고(join 또는 concat 등등),
    // 제일 뒤에 </body>랑 </html> 등의 태그를 추가한다.
    let bodyContent = fs.readFileSync("./Test2.html", "utf8");
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

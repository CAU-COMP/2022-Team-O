import {sendEmail, sendTemplateEmail} from "./sendEmail.js"


export function mailHandler(recipientName, recipientEmail, data){
    // 수신자주소, 바디내용, 메일 제목을 받음
    // 바디 내용에는 어느 게시판을 구독했는지에 따라 추가적인 내용이 들어갈 수 있으므로
    // 앞부분 스트링을 bodyContent라는 string에 저장하고,
    // 그 뒷 부분에 추가할 부분을 <a href></a>로 추가하고(join 또는 concat 등등),
    // 제일 뒤에 </body>랑 </html> 등의 태그를 추가한다.
    

    // 사용되는 변수: recipientName, majorName, url, title, unsubscribeUrl
    // <a href="${url}">&#128204;${title}<br></a>
    const numberOfMajors = Object.keys(data).length;
    let updatedContent = '';
    let numberOfUpdates = 0; // = 각 학과별 key의 개수 확인

    const unsubscribeUrl = "exampleURL";

    for(let i=0;i<numberOfMajors;i++){ // 각 게시판
      updatedContent = updatedContent.concat(`<h2>${data[i].majorName} 게시판:</h2>`);
      numberOfUpdates = Object.keys(data[i].url).length;
      for(let j=0;j<numberOfUpdates;j++){ // 게시판 별 각 업데이트
        updatedContent = updatedContent.concat(`<p>   &#128204;<a href="${data[i].url[j]}">${data[i].title[j]}<br></a></p>`);
      }
    }
    
    
    let bodyContent = `<!DOCTYPE html><html lang="ko"><title></title><head> <meta charset="UTF-8"></head><body> <h2>${recipientName}님,</h2> <p>${recipientName}님께서 구독하신 게시판의 새 공지&#128204;가 게시되었습니다!</p> ${updatedContent} <br><p>문의사항은 admin@caunotify.me 로 전달해주세요!&#128513;<br><br></p> <p>더 이상 공지를 받고 싶지 않으시다면, <a href="${unsubscribeUrl}">구독 해지</a>를 눌러 해지해주세요!</p> </body></html>`;
    // let bodyContent = fs.readFileSync("./Test.html", "utf8");
    
    
    // bodyContent = "TestBodyContent";
    // params : recipientEmail, bodyContent, mailTitle
    sendEmail(recipientEmail, bodyContent,`${recipientName}님 새 공지가 게시되었습니다`)
    .then(
        function(data,recipientEmail){
          // console.log(data);
          console.log(`Sent successfully to ${recipientEmail}`);
        })
    .catch(
          function(err) {
          console.error(err, err.stack);
        }); 
}

// let testData = [
//   {
//     majorName: "산업보안학과",
//     url:[
//       "this is industSec URL one",
//       "this is industSec URL two"
//     ],
//     title:[
//       "this is industSec title one",
//       "this is industSec title two"
//     ]
//   },
//   {
//     majorName: "소프트웨어학부",
//     url:[
//       "this is software URL one",
//       "this is software URL two"
//     ],
//     title:[
//       "this is software title one",
//       "this is software title two"
//     ]
  
//   }
// ];

// recipientName, recipientEmail, majorName, data, numberOfUpdates
// mailHandler("나상현","na_sanghyun@naver.com",testData);
// console.log(testData);

import {sendEmail, sendTemplateEmail} from "./sendEmail.js"
import { encryptIntToString } from "./encrypter.js"


export function mailHandler(recipientName, recipientEmail, data, id){
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

    const urlHash = encryptIntToString(id);
    const unsubscribeUrl = `caunotify.me/unsubscribe?id=${urlHash}`;

    for(let i=0;i<numberOfMajors;i++){ // 각 게시판
      updatedContent = updatedContent.concat(`<h2>${data[i].majorName} 게시판:</h2>`);
      numberOfUpdates = Object.keys(data[i].url).length;
      for(let j=0;j<numberOfUpdates;j++){ // 게시판 별 각 업데이트
        updatedContent = updatedContent.concat(`<p>   &#128204;<a href="${data[i].url[j]}">${data[i].title[j]}<br></a></p>`);
      }
    }
    
    
    // let bodyContent = `<!DOCTYPE html><html lang="ko"><title></title><head> <meta charset="UTF-8"></head><body> <h2>${recipientName}님,</h2> <p>${recipientName}님께서 구독하신 게시판의 새 공지&#128204;가 게시되었습니다!</p> ${updatedContent} <br><p>문의사항은 admin@caunotify.me 로 전달해주세요!&#128513;<br><br></p> <p>더 이상 공지를 받고 싶지 않으시다면, <a href="${unsubscribeUrl}">구독 해지</a>를 눌러 해지해주세요!</p> </body></html>`;
    let bodyContent = `<html lang="ko"><title>caunotify.me Mail</title><head><meta charset="UTF-8"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet"><style>@import url(https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap);a:visited{color:#4a4a4a;background-color:transparent;text-decoration:none}a:active{color:#ff0;background-color:transparent}</style></head><body><table align="center" width="600" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td style="border-bottom:4px solid #374670"><table align="center" width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><img src="data:image/png;base64,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" width="150" loading="lazy"></td></tr><tr><td height="7" colspan="2"></td></tr></tbody></table></td></tr><tr bgcolor="#FFFFFF"><td style="border-left:4px solid #2155a4;border-right:4px solid #2155a4;padding:20px 20px 15px 20px"><table width="556" align="center" border="0" cellspacing="0" cellpadding="0"><tbody align="center"><tr><td width="555" height="70"><table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size:21px;font-family:'Nanum Gothic',sans-serif;line-height:27px;letter-spacing:-1.5px;color:#666"><tbody><tr><td align="center" width="150" style="padding-bottom:10px"><img src="data:image/png;base64,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" width="80" loading="lazy"></td><td style="padding-right:20px"><strong>${recipientName}님,<br>구독하신 게시판에 새 공지가 게시되었습니다!</strong></td></tr></tbody></table></td></tr><tr><td height="70" style="font-size:13px;font-family:'Nanum Gothic',sans-serif;word-wrap:break-word;letter-spacing:-1px;color:#373737;border:3px solid #373737;padding:25px 35px 35px"><p>${updatedContent}</p></td></tr></tbody></table><table width="556" border="0" align="center" cellspacing="0" cellpadding="0"><tbody><tr><td height="25"></td></tr><tr align="center"><td align="center"><a href="caunotify.me" target="_blank" rel="noreferrer noopener"><img src="data:image/jpeg;base64,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" alt="caunotify.me 바로가기" width="200" align="right" loading="lazy"></a></td></tr><tr><td height="12"></td></tr></tbody></table></td></tr><tr><td bgcolor="#2155a4" style="border-left:4px solid #2155a4;border-right:4px solid #2155a4"><table width="100%" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td align="left" valign="top" style="font-family:'Nanum Gothic',sans-serif;font-size:11px;color:#e6e6e6;line-height:120%;padding:21px 10px 20px 20px" bgcolor="#2155a4">더 이상 공지를 받고 싶지 않으시다면,<strong><a href="${unsubscribeUrl}" target="_blank" style="color:#e6e6e6;text-decoration:none" rel="noreferrer noopener">구독 해지</a></strong>를 눌러 해지해주세요!<br>문의사항은<strong><a href="mailto: admin@caunotify.me" target="_blank" style="color:#e6e6e6;text-decoration:none" rel="noreferrer noopener">admin@caunotify.me</a></strong>로 전달해주세요!&#128513;</td></tr></tbody></table></td></tr></tbody></table></body></html>`;
    // let bodyContent = fs.readFileSync("./Test.html", "utf8");
    
    
    // bodyContent = "TestBodyContent";
    // params : recipientEmail, bodyContent, mailTitle
    sendEmail(recipientEmail, bodyContent,`${recipientName}님 새 공지가 게시되었습니다`)
    .then(
        function(data){
          // console.log(data);
          console.log(`*** Sent successfully to ${recipientEmail}`);
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

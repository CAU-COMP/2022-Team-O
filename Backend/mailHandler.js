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
    
    
    // let bodyContent = `<!DOCTYPE html><html lang="ko"><title></title><head> <meta charset="UTF-8"></head><body> <h2>${recipientName}님,</h2> <p>${recipientName}님께서 구독하신 게시판의 새 공지&#128204;가 게시되었습니다!</p> ${updatedContent} <br><p>문의사항은 admin@caunotify.me 로 전달해주세요!&#128513;<br><br></p> <p>더 이상 공지를 받고 싶지 않으시다면, <a href="${unsubscribeUrl}">구독 해지</a>를 눌러 해지해주세요!</p> </body></html>`;
    let bodyContent = `<html lang="ko"> <title>caunotify.me Mail</title> <head> <meta charset="UTF-8"> <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet"> <style>@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap'); </style> </head> <body> <table align="center" width="800" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td style="border-bottom:4px solid #374670;"> <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td> <img src="data:image/png;base64,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" width="150" loading="lazy"> </td><td align="right" valign="bottom" style="font-size: 11px; font-family: 'Nanum Gothic', sans-serif; color: #575757; line-height:14px; padding:2px 0 0 0; letter-spacing:-1px;"> <p> <strong><a href="http://caunotify.me" target="_blank" style="color:#575757; text-decoration:none; padding:10px" rel="noreferrer noopener" >CAUNOTIFY.ME</a></strong> </p></td></tr><tr> <td height="7" colspan="2"></td></tr></tbody> </table> </td></tr><tr bgcolor="#FFFFFF"> <td style="border-left:4px solid #2155a4; border-right:4px solid #2155a4; padding:20px 20px 15px 20px;"> <table width="556" align="center" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td width="555" height="70"> <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size:21px; font-family: 'Nanum Gothic', sans-serif; line-height:27px; letter-spacing:-1.5px; color:#666666;"> <tbody> <tr> <td style="padding-left:20px"> <strong>${recipientName}님,<br>구독하신 게시판에 새 공지가 게시되었습니다! </strong> </td><td align="left" width="150"> <img src="http://file1.jobkorea.co.kr/mailing/2014/mailing_bg.jpg" width="147" loading="lazy"> </td></tr></tbody> </table> </td></tr><tr> <td height="70" style="font-size: 13px; font-family: 'Nanum Gothic', sans-serif; word-wrap: break-word; letter-spacing:-1px; color:#373737; border:3px solid #373737; padding:25px 35px 35px"> <p> ${updatedContent}</p></td></tr></tbody> </table> <table width="556" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td height="25"></td></tr><tr> <td align="center"> <a href="http://www.jobkorea.co.kr" target="_blank" rel="noreferrer noopener"> <img src="http://file1.jobkorea.co.kr/mailing/2014/mailing_btn.jpg" alt="caunotify.me 바로가기" border="0" loading="lazy"> </a> </td></tr><tr> <td height="12"></td></tr></tbody> </table> </td></tr><tr> <td bgcolor="#2155a4" style="border-left:4px solid #2155a4; border-right:4px solid #2155a4;"> <table width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="left" valign="top" style="font-family: 'Nanum Gothic', sans-serif; font-size:11px; color:#e6e6e6; line-height:120%; padding:21px 10px 20px 20px;" bgcolor="#2155a4"> 더 이상 공지를 받고 싶지 않으시다면, <strong> <a href="${unsubscribeUrl}" target="_blank" style="color:#e6e6e6; text-decoration:none;" rel="noreferrer noopener"> 구독 해지 </a> </strong> 를 눌러 해지해주세요!<br>문의사항은 <strong> <a href="mailto: admin@caunotify.me" target="_blank" style="color:#e6e6e6; text-decoration:none;" rel="noreferrer noopener"> admin@caunotify.me </a> </strong> 로 전달해주세요!&#128513;<br>Sent by: caunotify.me </td></tr></tbody> </table> </td></tr></tbody> </table> </body></html>`;
    // let bodyContent = fs.readFileSync("./Test.html", "utf8");
    
    
    // bodyContent = "TestBodyContent";
    // params : recipientEmail, bodyContent, mailTitle
    sendEmail(recipientEmail, bodyContent,`${recipientName}님 새 공지가 게시되었습니다`)
    .then(
        function(data){
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

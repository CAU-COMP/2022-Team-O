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
    let bodyContent = `<html lang="ko"> <title>caunotify.me Mail</title> <head> <meta charset="UTF-8"> <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet"> <style>@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap'); a:visited{color: #4a4a4a; background-color: transparent; text-decoration: none;}a:active{color: yellow; background-color: transparent;}</style> </head> <body> <table align="center" width="600" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td style="border-bottom:4px solid #374670;"> <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody> <tr> <td> <img src="https://caunotify.s3.ap-northeast-1.amazonaws.com/logo_smaller.png" width="150" loading="lazy"> </td></tr><tr> <td height="7" colspan="2"></td></tr></tbody> </table> </td></tr><tr bgcolor="#FFFFFF"> <td style="border-left:4px solid #2155a4; border-right:4px solid #2155a4; padding:20px 20px 15px 20px;"> <table width="556" align="center" border="0" cellspacing="0" cellpadding="0"> <tbody align="center"> <tr> <td width="555" height="70"> <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size:21px; font-family: 'Nanum Gothic', sans-serif; line-height:27px; letter-spacing:-1.5px; color:#666666;"> <tbody> <tr> <td align="center" width="150" style="padding-bottom:10px"> <img src="https://caunotify.s3.ap-northeast-1.amazonaws.com/mail_smaller.png" width="80" loading="lazy"> </td><td style="padding-right:20px"> <strong>${recipientName}님, <br>새 공지가 도착했습니다! </strong> </td></tr></tbody> </table> </td></tr><tr> <td height="70" align="left" style="font-size: 13px; font-family: 'Nanum Gothic', sans-serif; word-wrap: break-word; letter-spacing:-1px; color:#373737; border:3px solid #373737; padding:25px 35px 35px"> <p> ${updatedContent}</p></td></tr></tbody> </table> <table width="556" border="0" align="center" cellspacing="0" cellpadding="0"> <tbody> <tr> <td height="25"></td></tr><tr align="center"> <td align="center"> <a href="http://caunotify.me" target="_blank" rel="noreferrer noopener"> <img src="https://caunotify.s3.ap-northeast-1.amazonaws.com/button_smaller.jpg" alt="caunotify.me 바로가기" width="200" align="right" loading="lazy"> </a> </td></tr><tr> <td height="12"></td></tr></tbody> </table> </td></tr><tr> <td bgcolor="#2155a4" style="border-left:4px solid #2155a4; border-right:4px solid #2155a4;"> <table width="100%" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td align="left" valign="top" style="font-family: 'Nanum Gothic', sans-serif; font-size:11px; color:#e6e6e6; line-height:120%; padding:21px 10px 20px 20px;" bgcolor="#2155a4"> 더 이상 공지를 받고 싶지 않으시다면, <strong> <a href="${unsubscribeUrl}" target="_blank" style="color:#e6e6e6; text-decoration:none;" rel="noreferrer noopener"> 구독 해지 </a> </strong> 를 눌러 해지해주세요! <br>문의사항은 <strong> <a href="mailto: admin@caunotify.me" target="_blank" style="color:#e6e6e6; text-decoration:none;" rel="noreferrer noopener"> admin@caunotify.me </a> </strong> 로 전달해주세요!&#128513;</td></tr></tbody> </table> </td></tr></tbody> </table> </body></html>`;
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

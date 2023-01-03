import http from "http";
import express from "express";
import bodyParser from "body-parser";
import crawlIndustSec from "./url_scraper_indust_sec.js";
import crawlSoftware from "./url_scraper_software.js";
import crawlCAUnotice from "./url_scraper_cauNotice.js";
import fs from "fs";

const PORT = 8080; // 아마존 EC2 업로드 시에는 HTTP용으로 80번으로 바꿀 예정

const app = express();
const server = http.createServer(app);

const refreshTimeInMinutes = 10; // 10분에 한번씩 refresh() 실행

// function refresh(){}를 작성하면 main.js 코드 완성
// refresh 함수에서는
// 크롤러 실행 -> 기존 목록과 대조 -> 변화 있으면 sendNotif(), 없으면 행동하지 않음 -> 다음 크롤러 실행.
        
const res_IndustSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
const res_Software = await crawlSoftware("url");
const res_CAUnotice = await crawlCAUnotice("url");
// console.log(res_IndustSec.title);

// 기존에 저장된 URL이나 title을 저장하는 배열은 항상 초기화될 수 있으므로 let 으로 선언해야함

function compareTwoArrays(originalArray,newArray,len){ // 실제 사용시 len은 newArray.length로 대체
    let found = 0;
    for(let i = 0; i < len; i++){
        for(let j = 0; j < len; j++){
            if(originalArray[i] == newArray[j]){
                found++;
                // console.log(`${originalArray[i]} and ${newArray[j]} are the same`);
            }
        }
    }
    // 사실 새 공지라 해도 시간 순서대로 sort 되어 있을 것이기 때문에 이렇게 전수조사를 할 필요는 없는데,
    // 코드의 간결함을 위해 일단은 이렇게 유지할 것.
    return len - found; // 변경된 값의 개수
} // 정상 작동 확인

// console.log(compareTwoArrays(arrayA,res_IndustSec.url,res_IndustSec.url.length));
// let arrayA = [1,2,3,4,5,6,7,8,9,10,11,12,13];
// arrayA = [...res_IndustSec.url];
// // 배열 복사 => 필요부분만 concat, push하면 더 효율적이겠지만,
// // 코드의 간결성을 위해서 전체를 복사함.
// console.log(arrayA);

// if(compareTwoArrays(originalArray,newArray,newArray.length) != 0){
//     console.log("there was a change");
// }
// else console.log("no changes");

// 유저별 구독 정보 저장
let userDataBase = [];
let lastIdNum = 1; // 유저 DB에 사람이 추가될때마다 +1, ID를 지속적으로 부여
userDataBase.push({
    name: "dummy",
    industSec: "true",
    software: "true",
    CAUnotice: "true",
    id: 0, // 이건 프런트에서 보내지 않아도 됨
});
// console.log(userDataBase);        

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/newuser', (req, res) => { // 정상작동 확인함
    const requestBody = req.body;
    if(requestBody.name != undefined){
        if(requestBody.industSec != "true" && requestBody.industSec != "false") return res.end("wrong industSec"); // undefined 인 경우도 잡아냄
        if(requestBody.software != "true" && requestBody.software != "false") return res.end("wrong software");
        if(requestBody.CAUnotice != "true" && requestBody.CAUnotice != "false") return res.end("wrong CAUnotice");
        // console.log(`<Received>\n\tName:${requestBody.name}\n\tindustSec:${requestBody.industSec}\n\tsoftware:${requestBody.software}\n\tCAUnotice:${requestBody.CAUnotice}`);
        requestBody.id = lastIdNum; // key값 추가
        lastIdNum++; // 다음 사용자를 위해 증감
        userDataBase.push(requestBody); // DB array에 저장
        console.log(userDataBase);
        return res.end("HTTP 200 OK"); // 정상 작동 응답
    } else {
        console.log(`Bad Request`);
        return res.end("HTTP 400 Bad Request");
    }

    // res.send(requestBody);
    console.log(req.body);
    
}); // 이런식으로
// 프런트에 요청: https://kasterra.github.io/handle-POST-data-in-express/

server.listen(PORT, function(){ 
    console.log(`Server is running at port ${PORT}`);
});

setInterval(() => console.log("refreshed"), refreshTimeInMinutes*60*1000);
// console.log("refreshed") 가 아니라, refresh() 를 실행시켜야 함.
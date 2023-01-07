import http from "http";
import express from "express";
import bodyParser from "body-parser";
import { mailHandler } from "./mailHandler.js"
import fs from "fs"
import moment from "moment"

const PORT = 80; // 아마존 EC2 업로드 시에는 HTTP용으로 80번으로 바꿀 예정

const app = express();
const server = http.createServer(app);

const refreshTimeInMinutes = 10; // 10분에 한번씩 refresh() 실행

// console.log(res_IndustSec.url);

// 기존에 저장된 URL이나 title을 저장하는 배열은 항상 초기화될 수 있으므로 let 으로 선언해야함

// 유저별 구독 정보 저장
let lastIdNum = fs.readFileSync("./Backend/userDB_log/lastIdNum.txt","utf8");; // 유저 DB에 사람이 추가될때마다 +1, ID를 지속적으로 부여
let userDBjsonFile = fs.readFileSync("./Backend/userDB_log/userDB.json","utf8");
let userDBparsed = JSON.parse(userDBjsonFile,"utf8");
let userDataBase = [];

console.log(`num: ${lastIdNum}`);
console.log(userDBparsed);

for(let i=0; i <= lastIdNum; i++){ // lastIdNum+1 로 바꾸기만 하면 for문이 10번을 돌아가는 버그 걸림
    console.log(i);
    // userDataBase.push(userDBparsed);
    // console.log(userDataBase)
    // console.log(userDBparsed)
}
fs.writeFileSync("./Backend/userDB_log/userDB_temp.json", JSON.stringify(userDataBase), "utf8");

// userDataBase.push({
//     name: "dummy",
//     industSec: "true",
//     software: "true",
//     CAUnotice: "true",
//     integEngineering: "true",
//     Korean: "true",
//     id: 0 // 이건 프런트에서 보내지 않아도 됨
// });


// console.log(userDataBase);        

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function(req, res) {
    // url이 http://a.com/topic?id=1&name=siwa 일때
    res.send(req.query.id+','+req.query.name); // 1,siwa 출력
});

app.post('/newuser', (req, res) => { // 정상작동 확인함
    res.header("Access-Control-Allow-Origin", "*");
    const requestBody = req.body;
    if(requestBody.name != undefined){
        console.log(requestBody);
        if(requestBody.industSec != "true" && requestBody.industSec != "false") return res.end("wrong industSec"); // undefined 인 경우도 잡아냄
        if(requestBody.software != "true" && requestBody.software != "false") return res.end("wrong software");
        if(requestBody.CAUnotice != "true" && requestBody.CAUnotice != "false") return res.end("wrong CAUnotice");
        if(requestBody.integEngineering != "true" && requestBody.integEngineering != "false") return res.end("wrong integEngineering");
        if(requestBody.Korean != "true" && requestBody.Korean != "false") return res.end("wrong Korean");
        // console.log(`<Received>\n\tName:${requestBody.name}\n\tindustSec:${requestBody.industSec}\n\tsoftware:${requestBody.software}\n\tCAUnotice:${requestBody.CAUnotice}`);
        requestBody.id = lastIdNum; // key값 추가
        lastIdNum++; // 다음 사용자를 위해 증감
        fs.writeFileSync(`./userDB_log/lastIdNum.txt`, lastIdNum, "utf8");
        userDataBase.push(requestBody); // DB array에 저장
        console.log(userDataBase);
        fs.writeFileSync(`./userDB_log/userDB_${moment().format("yy/mm/dd hh:mm:ss")}.json`, JSON.stringify(output), "utf8");
        fs.writeFileSync(`./userDB_log/userDB.json`, JSON.stringify(userDataBase), "utf8");
        return res.end("HTTP 200 OK"); // 정상 작동 응답
    } else {
        console.log(`Bad Request`);
        return res.end("HTTP 400 Bad Request");
    }

    // res.send(requestBody);
    // console.log(req.body);
    
}); // 이런식으로
// 프런트에 요청: https://kasterra.github.io/handle-POST-data-in-express/

server.listen(PORT, function(){ 
    console.log(`Server is running at port ${PORT}`);
});

// setInterval(() => console.log("refreshed"), refreshTimeInMinutes*60*1000);
// console.log("refreshed") 가 아니라, refresh() 를 실행시켜야 함.
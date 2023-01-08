// 새 게시판 추가시:
// main.js 에서 post요청 기대값에 추가
// refresh.js 에서 추가
// 프런트에 알림

import http from "http";
import express from "express";
import bodyParser from "body-parser";
import fs from "fs"
import { refresh } from "./refresh.js"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// const tempDirname = path.dirname(__filename);
// const __dirname = path.join(tempDirname, '..');
const __dirname = path.dirname(__filename);
console.log(`Directory is ${__dirname}`);

const PORT = 80; // 아마존 EC2 업로드 시에는 HTTP용으로 80번으로 바꿀 예정

const app = express();
const server = http.createServer(app);

const refreshTimeInMinutes = 30; // 30분에 한번씩 refresh() 실행

// console.log(res_IndustSec.url);

// 기존에 저장된 URL이나 title을 저장하는 배열은 항상 초기화될 수 있으므로 let 으로 선언해야함

// 유저별 구독 정보 저장
let nextIdNum = parseInt(fs.readFileSync(path.join(__dirname, 'userDB_log', 'nextIdNum.txt'),"utf8")); // 유저 DB에 사람이 추가될때마다 +1, ID를 지속적으로 부여
let userDBjsonFile = fs.readFileSync(path.join(__dirname, 'userDB_log', 'userDB.json'),"utf8");
let userDataBase = JSON.parse(userDBjsonFile,"utf8");

// let userDataBase = [];

// for(let i=0; i <= nextIdNum; i++){ // nextIdNum+1 로 바꾸기만 하면 for문이 10번을 돌아가는 버그 걸림
//     userDataBase.push(userDBparsed);
//     // console.log(userDataBase)
//     console.log(`${i}th`)
//     console.log(userDataBase)
// }
// fs.writeFileSync("./userDB_log/userDB_temp.json", JSON.stringify(userDataBase), "utf8");


// userDB 백업하는 코드 필요함

// console.log(userDataBase);        

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Frontend', 'public')));
app.use('/public', express.static(path.join(__dirname, 'Frontend', 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'Frontend', 'main.html'));
});
app.get('/main.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'Frontend', 'main.html'));
});
app.get('/about.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'Frontend', 'about.html'));
});
app.get('/join.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'Frontend', 'join.html'));
});
app.get('/success.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'Frontend', 'success.html'));
});
app.get('/fail.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'Frontend', 'fail.html'));
});

app.post('/posttest', (req, res) => { // 정상작동 확인함
    res.header("Access-Control-Allow-Origin", "*");
    let requestBody = req.body;
    console.log(requestBody);
    return res.end("recieved");
});

app.post('/newuser', (req, res) => { // 정상작동 확인함
    res.header("Access-Control-Allow-Origin", "*");
    let requestBody = req.body;
    if(requestBody.name != undefined){
        console.log(requestBody);
        if(requestBody.email.includes("@") == false) return res.end("wrong email");;
        if(requestBody.industSec != "true" && requestBody.industSec != "false") return res.end("wrong industSec"); // undefined 인 경우도 잡아냄
        if(requestBody.software != "true" && requestBody.software != "false") return res.end("wrong software");
        if(requestBody.CAUnotice != "true" && requestBody.CAUnotice != "false") return res.end("wrong CAUnotice");
        if(requestBody.integEngineering != "true" && requestBody.integEngineering != "false") return res.end("wrong integEngineering");
        if(requestBody.korean != "true" && requestBody.korean != "false") return res.end("wrong korean");
        if(requestBody.mechEngineering != "true" && requestBody.mechEngineering != "false") return res.end("wrong mechEngineering");
        if(requestBody.psychology != "true" && requestBody.psychology != "false") return res.end("wrong psychology");
        if(requestBody.business != "true" && requestBody.business != "false") return res.end("wrong business");
        if(requestBody.elecEngineering != "true" && requestBody.elecEngineering != "false") return res.end("wrong elecEngineering");
        if(requestBody.english != "true" && requestBody.english != "false") return res.end("wrong english");
        if(requestBody.enerEngineering != "true" && requestBody.enerEngineering != "false") return res.end("wrong enerEngineering");
        // console.log(`<Received>\n\tName:${requestBody.name}\n\tindustSec:${requestBody.industSec}\n\tsoftware:${requestBody.software}\n\tCAUnotice:${requestBody.CAUnotice}`);
        requestBody.id = nextIdNum; // key값 추가
        nextIdNum++; // 다음 사용자를 위해 증감

        // 가끔 id가 string으로 저장되는 오류가 있어서 코드 추가

        fs.writeFileSync(path.join(__dirname, 'Frontend', 'nextIdNum.txt'), nextIdNum.toString(), "utf8");
        userDataBase.push(requestBody); // DB array에 저장
        // console.log(userDataBase);
        fs.writeFileSync(path.join(__dirname, 'Frontend', 'userDB.json'), JSON.stringify(userDataBase), { encoding: "utf8", flag: "w" });
        return res.end("HTTP 200 OK"); // 정상 작동 응답
    } else {
        console.log(`Bad Request`);
        return res.end("HTTP 400 Bad Request");
    }

    // res.send(requestBody);
    // console.log(req.body);
    
}); // 이런식으로
// 프런트에 요청: https://kasterra.github.io/handle-POST-data-in-express/

app.post('/refresh', (req, res) => {
    refresh(nextIdNum);
    return res.end("Refreshed")
});

server.listen(PORT, function(){ 
    console.log(`Server is running at port ${PORT}`);
});

setInterval(() => refresh(nextIdNum), refreshTimeInMinutes*60*1000);
// console.log("refreshed") 가 아니라, refresh() 를 실행시켜야 함.

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
import { decryptStringToInt } from "./encrypter.js"
import moment from 'moment';

function updateDB(){
    fs.writeFileSync(path.join(__dirname, 'userDB_log', 'userDB.json'), JSON.stringify(userDataBase,null,4), { encoding: "utf8", flag: "w" });
    fs.writeFileSync(`${__dirname}/userDB_log/log_${moment().format('YYMMDD_HH:mm:ss')}.json`, JSON.stringify(userDataBase,null,4), { encoding: "utf8", flag: "a" });
    console.log("***DB updated");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const tempDirname = path.dirname(__filename);
// const __dirname = path.join(tempDirname, '..');
// console.log(`Directory is ${__dirname}`);

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
// fs.writeFileSync("./userDB_log/userDB_temp.json", JSON.stringify(userDataBase,null,4), "utf8");


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
app.get('/unsubscribe', function(req, res) { // 구독해지 요청
    const idNum = decryptStringToInt(req.query.id);
    if(idNum != "" && idNum > 0 && idNum < nextIdNum){
        userDataBase[idNum].subStatus = "false";
        updateDB();
        return res.send(`${userDataBase[idNum].name}님의 구독이 성공적으로 해지되었습니다. 이용해주셔서 감사합니다.`);
    }
    else{
        res.send(`이용자를 찾을 수 없습니다.`);
    }
});


// app.post('/posttest', (req, res) => { // 정상작동 확인함
//     res.header("Access-Control-Allow-Origin", "*");
//     let requestBody = req.body;
//     console.log(requestBody);
//     if(requestBody.name != undefined){
//         // console.log(requestBody);
//         if(requestBody.email.includes("@") == false) return res.sendFile(path.join(__dirname, 'Frontend', 'fail.html'));
//         if(requestBody.industSec != "true") requestBody.industSec = "false"; // undefined 인 경우도 잡아냄
//         if(requestBody.software != "true") requestBody.software = "false";
//         if(requestBody.CAUnotice != "true") requestBody.CAUnotice = "false";
//         if(requestBody.integEngineering != "true") requestBody.integEngineering = "false";
//         if(requestBody.korean != "true") requestBody.korean = "false";
//         if(requestBody.mechEngineering != "true") requestBody.mechEngineering = "false";
//         if(requestBody.psychology != "true") requestBody.psychology = "false";
//         if(requestBody.business != "true") requestBody.business = "false";
//         if(requestBody.elecEngineering != "true") requestBody.elecEngineering = "false";
//         if(requestBody.english != "true") requestBody.english = "false";
//         if(requestBody.enerEngineering != "true") requestBody.enerEngineering = "false";
//         // console.log(`<Received>\n\tName:${requestBody.name}\n\tindustSec:${requestBody.industSec}\n\tsoftware:${requestBody.software}\n\tCAUnotice:${requestBody.CAUnotice}`);
//         requestBody.id = nextIdNum; // key값 추가
//         nextIdNum++; // 다음 사용자를 위해 증감

//         console.log(requestBody);

//         // res.end("HTTP 200 OK"); // 정상 작동 응답
//         return res.sendFile(path.join(__dirname, 'Frontend', 'success.html'));
//     } else {
//         console.log(`Bad Request`);
//         return res.sendFile(path.join(__dirname, 'Frontend', 'fail.html'));
//     }
//     // return res.sendFile(path.join(__dirname, 'Frontend', 'success.html'));
// });

app.post('/newuser', (req, res) => { // 정상작동 확인함
    let requestBody = req.body;
    if(requestBody.name != undefined){
        // console.log(requestBody);
        if(requestBody.email.includes("@") == false) return res.sendFile(path.join(__dirname, 'Frontend', 'fail.html'));
        if(requestBody.industSec != "true") requestBody.industSec = "false"; // undefined 인 경우도 잡아냄
        if(requestBody.software != "true") requestBody.software = "false";
        if(requestBody.CAUnotice != "true") requestBody.CAUnotice = "false";
        if(requestBody.integEngineering != "true") requestBody.integEngineering = "false";
        if(requestBody.korean != "true") requestBody.korean = "false";
        if(requestBody.mechEngineering != "true") requestBody.mechEngineering = "false";
        if(requestBody.psychology != "true") requestBody.psychology = "false";
        if(requestBody.business != "true") requestBody.business = "false";
        if(requestBody.elecEngineering != "true") requestBody.elecEngineering = "false";
        if(requestBody.english != "true") requestBody.english = "false";
        if(requestBody.enerEngineering != "true") requestBody.enerEngineering = "false";
        // console.log(`<Received>\n\tName:${requestBody.name}\n\tindustSec:${requestBody.industSec}\n\tsoftware:${requestBody.software}\n\tCAUnotice:${requestBody.CAUnotice}`);
        requestBody.id = nextIdNum; // key값 추가
        requestBody.subStatus = "true"; 
        nextIdNum++; // 다음 사용자를 위해 증감

        console.log(requestBody);

        // 가끔 id가 string으로 저장되는 오류가 있어서 코드 추가

        fs.writeFileSync(path.join(__dirname, 'userDB_log', 'nextIdNum.txt'), nextIdNum.toString(), "utf8");
        userDataBase.push(requestBody); // DB array에 저장
        // console.log(userDataBase);
        updateDB();
        return res.sendFile(path.join(__dirname, 'Frontend', 'success.html'));
    } else {
        return res.sendFile(path.join(__dirname, 'Frontend', 'fail.html'));
    }

    // res.send(requestBody);
    // console.log(req.body);
    
}); // 이런식으로
// 프런트에 요청: https://kasterra.github.io/handle-POST-data-in-express/

app.post('/refresh', (req, res) => {
    refresh(nextIdNum);
    return res.end("Refreshed")
});
app.post('/currentuserDB', (req, res) => {
    console.log("** Current UserDB Sent")
    console.log(`nextIdNum : ${nextIdNum}`);
    updateDB();
    return res.end(JSON.stringify(userDataBase,null,4));
});
app.post('/delLastUser', (req, res) => {
    console.log("** Deleted last user");
    nextIdNum--;
    console.log(`nextIdNum : ${nextIdNum}`);
    userDataBase.pop();
    updateDB();
    return res.end(JSON.stringify(userDataBase,null,4));
});

server.listen(PORT, function(){ 
    console.log(`Server is running at port ${PORT}`);
});
setInterval(() => {refresh(nextIdNum); console.log("refreshed on interval")}, refreshTimeInMinutes*60*1000);
// console.log("refreshed") 가 아니라, refresh() 를 실행시켜야 함.

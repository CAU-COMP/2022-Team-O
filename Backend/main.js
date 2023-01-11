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

function updateUserDB(src){
    fs.writeFileSync(path.join(__dirname, 'userDB_log', 'userDB.json'), JSON.stringify(userDataBase,null,4), { encoding: "utf8", flag: "w" });
    fs.writeFileSync(`${__dirname}/userDB_log/log_${moment().format('YYMMDD_HH:mm:ss')}.json`, JSON.stringify(userDataBase,null,4), { encoding: "utf8", flag: "a" });
    console.log(`***UserDB updated by ${src}`);
}
function updateBounceDB(){
    fs.writeFileSync(path.join(__dirname, 'mailDB') + '/bounceDB.json', JSON.stringify(bounceDB,null,4), { encoding: "utf8", flag: "w" });
    console.log(`***BounceDB updated`);
}
function updateComplaintDB(){
    fs.writeFileSync(path.join(__dirname, 'mailDB') + '/complaintDB.json', JSON.stringify(complaintDB,null,4), { encoding: "utf8", flag: "w" });
    console.log(`***ComplaintDB updated`);
}
function findUserByEmail(mailAddress){
    for(let i=0;i<nextIdNum;i++){
        if(userDataBase[i].email == mailAddress) return i;
    }
    return -1;
}

// __dirname 생성
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 서버 기본 세팅
const PORT = 80;
const app = express();
const server = http.createServer(app);
const refreshTimeInMinutes = 30; // 30분에 한번씩 refresh() 실행


// 유저별 구독 정보 저장
let nextIdNum = parseInt(fs.readFileSync(path.join(__dirname, 'userDB_log', 'nextIdNum.txt'),"utf8")); // 유저 DB에 사람이 추가될때마다 +1, ID를 지속적으로 부여
let userDBjsonFile = fs.readFileSync(path.join(__dirname, 'userDB_log', 'userDB.json'),"utf8");
let bounceDBjsonFile = fs.readFileSync(path.join(__dirname, 'mailDB', 'bounceDB.json'),"utf8");
let complaintDBjsonFile = fs.readFileSync(path.join(__dirname, 'mailDB', 'complaintDB.json'),"utf8");


// *** DB 읽어오기 ***
let userDataBase = JSON.parse(userDBjsonFile,"utf8");
let bounceDB = JSON.parse(bounceDBjsonFile,"utf8");
let complaintDB = JSON.parse(complaintDBjsonFile,"utf8");



// ***************************************************** 이 밑으로는 서버( express.js ) 코드 *****************************************************


app.use(function(req, res, next) {
    if (req.get('x-amz-sns-message-type')) { // 아마존 헤더이면 json이라 예측할 것
        req.headers['content-type'] = 'application/json';
    }
    next();
});

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
        if(userDataBase[idNum].subStatus == "false"){
            return res.send(`이미 해지된 구독입니다. 새로 구독하시려면 홈페이지를 이용해주세요.`);
        }
        else{
            userDataBase[idNum].subStatus = "false";
            updateUserDB("unsubscribe request already false");
            return res.send(`${userDataBase[idNum].name}님의 구독이 성공적으로 해지되었습니다. 이용해주셔서 감사합니다.`);
        }
    }
    else{
        res.send(`이용자를 찾을 수 없습니다.`);
    }
});

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
        updateUserDB("newuser");
        return res.sendFile(path.join(__dirname, 'Frontend', 'success.html')); 
    } else {
        return res.sendFile(path.join(__dirname, 'Frontend', 'fail.html'));
    }

    // res.send(requestBody);
    // console.log(req.body);
    
});



// refresh, currentuserDB, delLastUser 이렇게 3가지는 보안 위협이 될 수 있으므로 배포 단계에서 제거할 코드
// ======================================================================
app.post('/refresh', (req, res) => {
    refresh(nextIdNum);
    return res.end("Refreshed")
});
app.post('/currentuserDB', (req, res) => {
    console.log("** Current UserDB Sent")
    console.log(`nextIdNum : ${nextIdNum}`);
    return res.end(JSON.stringify(userDataBase,null,4));
});
app.post('/delLastUser', (req, res) => {
    console.log("** Deleted last user");
    nextIdNum--;
    console.log(`nextIdNum : ${nextIdNum}`);
    userDataBase.pop();
    updateUserDB("delLastUser");
    return res.end(JSON.stringify(userDataBase,null,4));
});
// ======================================================================


// Mail Error Handling
app.post('/complainthandling', (req, res) => {
    const requestBody = req.body;
    if(requestBody.notificationType == "AmazonSnsSubscriptionSucceeded") return res.status(200).send("OK");
    if(requestBody.notificationType == "Bounce"){
        // 여기서 필요한 정보는: bounce한 사람 주소인데, 로그는 전체를 남겨두자
        bounceDB.push(requestBody);
        updateBounceDB();
        const userIdNum = findUserByEmail(requestBody.mail.destination.toString());
        if(userIdNum == -1) return res.status(404).send("Not Found"); // bounce 요청이 왔는데 우리 DB에서는 못찾은 상황. 발생 가능성 매우 드묾.
        else{
            userDataBase[userIdNum].subStatus = "false";
            return res.status(200).send("OK");
        }
    }
});
app.post('/bouncehandling', (req, res) => {
    const requestBody = req.body;
    if(requestBody.notificationType == "AmazonSnsSubscriptionSucceeded") return res.status(200).send("OK");
    if(requestBody.notificationType == "Bounce"){
        // 여기서 필요한 정보는: bounce한 사람 주소인데, 로그는 전체를 남겨두자
        bounceDB.push(requestBody);
        updateBounceDB();
        const userIdNum = findUserByEmail(requestBody.mail.destination.toString());
        if(userIdNum == -1) return res.status(404).send("Not Found"); // bounce 요청이 왔는데 우리 DB에서는 못찾은 상황. 발생 가능성 매우 드묾.
        else{
            userDataBase[userIdNum].subStatus = "false";
            return res.status(200).send("OK");
        }
    }
});




server.listen(PORT, function(){ 
    console.log(`Server is running at port ${PORT}`);
});

setInterval(() => {refresh(nextIdNum); console.log("*** interval reached")}, refreshTimeInMinutes*60*1000);
// console.log("refreshed") 가 아니라, refresh() 를 실행시켜야 함.
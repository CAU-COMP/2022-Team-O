import http from "http";
import express from "express";
import bodyParser from "body-parser";
import crawlIndustSec from "./url_scraper_indust_sec.js";
import crawlSoftware from "./url_scraper_software.js";

const PORT = 8080; // 아마존 EC2 업로드 시에는 HTTP용으로 80번으로 바꿀 예정

const app = express();
const server = http.createServer(app);
        
const res_IndustSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
const res_Software = await crawlSoftware("url");


// 유저별 구독 정보 저장
let userDataBase = [];
userDataBase.push({
    name: 'dummy',
    industSec: 'true',
    software: 'false'
});
// console.log(userDataBase);        

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/newuser', (req, res) => {
    const requestBody = req.body;
    res.send(requestBody);
    console.log(req.body);
    
}); // 이런식으로
// 프런트에 요청: https://kasterra.github.io/handle-POST-data-in-express/

// server.listen(PORT, function(){ 
//     console.log(`Server is running at port ${PORT}`);
// });
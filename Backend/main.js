import http from "http";
import express from "express"; 

const app = express();
const server = http.createServer(app);

const PORT = 8080; // 아마존 EC2 업로드 시에는 HTTP용으로 80번으로 바꿀 예정

// const server = http.createServer(function(request,response){ 
//     response.writeHead(200,{'Content-Type':'text/html'});
//     response.end('Hello node.js!!');
// }); // HTTP모듈로 만든 서버

// 요청을 수행하는 방법은
// app.get('요청한주소', function (req, res) {
//   res.send('res내용');
// }); // 이런식으로

server.listen(PORT, function(){ 
    console.log(`Server is running at port ${PORT}`);
});
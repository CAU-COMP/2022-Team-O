import fetch from "node-fetch";
// const fetch = require('node-fetch');
import cheerio from "cheerio";
// const cheerio = require('cheerio');

// package.json 에서 type을 module로 설정해 es6 module scope를 따름

const crawlMath = async({ url }) =>{
    url = "https://math.cau.ac.kr/notice/notice.php";
    let url_list = [];
    let title_list = [];
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body, { decodeEntities: false }) // 읽어들인 html을 조작 가능하게끔

    // let all = $('*');
    // let res = all.filter((index, element) => { 
    //     return $(element)
    //     // let table = $(element).attr('class') === 'listTable';
    //     // return table;
    // });
    
    let items = $('*').get();

    items.forEach(element => {
        if (element.attribs.href != undefined && element.attribs.href.startsWith("/notice/notice.php?keyfield=&keyword=&page=1&board_table=notice_student&work=view&No=")){
            // console.log(element.children);
            url_list.push(`https://math.cau.ac.kr/${element.attribs.href}`);
            const title = $(element).text().trim();
            title_list.push(title);
            // console.log(`${element.attribs}`);
        }
        // console.log(element.attribs);
    });
     //console.log(url_list);
     //console.log(title_list);
    
    return {
        url: url_list,
        title: title_list
    }
};

 //crawlMath({
   //  url: "https://math.cau.ac.kr/notice/notice.php",
 //}); // 테스트용

export default crawlMath

// 비동기식이기 때문에 url_list의 console.log는 crawl 함수 내에서 이루어져야함.
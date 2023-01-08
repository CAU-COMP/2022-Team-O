import fetch from "node-fetch";
// const fetch = require('node-fetch');
import cheerio from "cheerio";
// const cheerio = require('cheerio');

// package.json 에서 type을 module로 설정해 es6 module scope를 따름

const crawlBusiness = async({ url }) =>{
    url = "https://biz.cau.ac.kr/2016/sub06/sub06_01_list.php";
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
        if (element.attribs.href != undefined && element.attribs.href.startsWith("/2016/sub06/sub06_01_view.php?bbsIdx=")){
        
            url_list.push(`https://biz.cau.ac.kr${element.attribs.href}`);
            const title = $(element).text().trim();
            title_list.push(title);
            // console.log(`${element.attribs}`);
        }
        // console.log(element.attribs);
    });
   //  console.log(url_list);
   // console.log(title_list);
    
    return {
        url: url_list,
        title: title_list
    }
};

 //crawlBusiness({
 //    url: "https://biz.cau.ac.kr/2016/sub06/sub06_01_list.php",
 //}); // 테스트용

export default crawlBusiness

// 비동기식이기 때문에 url_list의 console.log는 crawl 함수 내에서 이루어져야함.
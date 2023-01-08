import axios from "axios";
// const fetch = require('node-fetch');
import cheerio from "cheerio";
// const cheerio = require('cheerio');
import iconv from "iconv-lite";

// package.json 에서 type을 module로 설정해 es6 module scope를 따름

const crawlIndustSec = async({ url }) =>{
    url = "http://security.cau.ac.kr/board.htm?bbsid=notice";
    let url_list = [];
    let title_list = [];
    const response = await axios({
        url: url, 
        method: "GET", 
        responseType: "arraybuffer"
      });
    const body = await response.data;
    const responseData = iconv.decode(body,'EUC-KR');
    const $ = cheerio.load(responseData, { decodeEntities: false }) // 읽어들인 html을 조작 가능하게끔

    // let all = $('*');
    // let res = all.filter((index, element) => { 
    //     return $(element)
    //     // let table = $(element).attr('class') === 'listTable';
    //     // return table;
    // });
    
    let items = $('*').get();

    items.forEach(element => {
        if (element.attribs.href != undefined && element.attribs.href.startsWith("?bbsid=notice&ctg_cd=&page")){
            // console.log(element);
            url_list.push(`http://security.cau.ac.kr/board.htm${element.attribs.href}`);
            const title = $(element).text().trim();
            // console.log(title);
            // const encoded_title = iconv.decode(title,'euc-kr');
            // let encoded_title = temp;
            // title_list.push(encoded_title);
            title_list.push(title);
            // console.log(`${element.attribs.href}`);
        }
        // console.log(element.attribs);
    });
    // console.log(url_list);
    // console.log(title_list);
    return {
        url: url_list,
        title: title_list
    }
};

// crawlIndustSec({
//     url: "http://security.cau.ac.kr/board.htm?bbsid=notice",
// }); // 테스트용

export default crawlIndustSec

// 비동기식이기 때문에 url_list의 console.log는 crawl 함수 내에서 이루어져야함.
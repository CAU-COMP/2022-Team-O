import fetch from "node-fetch";
// const fetch = require('node-fetch');
import cheerio from "cheerio";
// const cheerio = require('cheerio');
import fs from "fs";
import puppeteer from "puppeteer";

// package.json 에서 type을 module로 설정해 es6 module scope를 따름

const crawlKorean = async({ url }) =>{
    url = "https://caukorean.cau.ac.kr/cm/cm_1.php?p_idx=";
    let url_list = [];
    let title_list = [];

    async function ssr(url) {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); // 1
        await page.goto(url, {waitUntil: 'networkidle0'});
        const html = await page.content(); // serialized HTML of page DOM.
        await browser.close();
        return html;
    }


    // const response = await fetch(url);
    const body = await ssr(url);
    const $ = cheerio.load(body, { decodeEntities: false }) // 읽어들인 html을 조작 가능하게끔
    
    // let all = $('*');
    // let res = all.filter((index, element) => { 
    //     return $(element)
    //     // let table = $(element).attr('class') === 'listTable';
    //     // return table;
    // });
    
    // let items = $('*').get();
    let items = $('*').get();
    

    items.forEach(element => {
        /*
        // let data = JSON.stringify(element.attribs);
        let data = JSON.stringify(element.attribs);
        // fs.writeFileSync('mydata.json', data, 'utf8');
        fs.appendFileSync('mydata.json', `${data}\n`);
        */
    //    let data = JSON.stringify(element.attribs);
    //    fs.writeFileSync('pup.json', "  ", 'utf8');
    //    fs.appendFileSync('pup.json', `${data}\n`);
        if(element.attribs.href != undefined){
            if(element.attribs.href.startsWith("javascript:view")){ // 24 29
                // console.log(element.attribs.href);
                const trimmedLink = element.attribs.href.slice(17,20);
                url_list.push(`https://caukorean.cau.ac.kr/cm/cm_1.php?p_idx=${trimmedLink}&s_scroll=&s_key=&p_page=&code=&PageId=&p_mode=view`);
                const title = $(element).text().trim();
                title_list.push(title);
            }
        }
    });
    // console.log(url_list);
    // console.log(title_list);
    
    return {
        url: url_list,
        title: title_list
    }
};

// crawlKorean({
//     url: "url",
// }); // 테스트용

export default crawlKorean

// 비동기식이기 때문에 url_list의 console.log는 crawl 함수 내에서 이루어져야함.
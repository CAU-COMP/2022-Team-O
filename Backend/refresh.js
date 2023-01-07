import fs from "fs";
import crawlIndustSec from "./url_scraper_indust_sec.js";
import crawlSoftware from "./url_scraper_software.js";
import crawlCAUnotice from "./url_scraper_cauNotice.js";
import crawlIntegEngineering from "./url_scraper_integ_engineering.js";
import crawlKorean from "./url_scraper_korean.js";
import { compareTwoArrays } from "./compare.js"
import { mailHandler } from "./mailHandler.js";

// refresh 함수에서는
// 크롤러 실행 -> 기존 목록과 대조 -> 변화 있으면 sendMail() 후 원래 목록 대체, 없으면 행동하지 않음 -> 다음 크롤러 실행.
export async function refresh(){
    const new_industSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
    const new_software = await crawlSoftware("url");
    const new_CAUnotice = await crawlCAUnotice("url");
    const new_integEngineering = await crawlIntegEngineering("url");
    const new_korean = await crawlKorean("url");
    let industSecUpdates;
    let softwareUpdates;
    let CAUnoticeUpdates;
    let integEngineeringUpdates;
    let koreanUpdates;

    fs.readFile("./Backend/compare_list/industSec.json", function read(err, rawData) {
        if (err) {throw err;}
        const oldContent = JSON.parse(rawData);
        industSecUpdates = compareTwoArrays(new_industSec.url, oldContent.url);
    });
    fs.readFile("./Backend/compare_list/software.json", function read(err, rawData) {
        if (err) {throw err;}
        const oldContent = JSON.parse(rawData);
        softwareUpdates = compareTwoArrays(new_software.url, oldContent.url);
    });
    fs.readFile("./Backend/compare_list/CAUnotice.json", function read(err, rawData) {
        if (err) {throw err;}
        const oldContent = JSON.parse(rawData);
        CAUnoticeUpdates = compareTwoArrays(new_CAUnotice.url, oldContent.url);
    });
    fs.readFile("./Backend/compare_list/integEngineering.json", function read(err, rawData) {
        if (err) {throw err;}
        const oldContent = JSON.parse(rawData);
        integEngineeringUpdates = compareTwoArrays(new_integEngineering.url, oldContent.url);
    });
    fs.readFile("./Backend/compare_list/korean.json", function read(err, rawData) {
        if (err) {throw err;}
        const oldContent = JSON.parse(rawData);
        koreanUpdates = compareTwoArrays(new_korean.url, oldContent.url);
    });
    // <Dummy>:
    // fs.readFile("./Backend/compare_list/asdfasdf.json", function read(err, rawData) {
    //     if (err) {throw err;}
    //     const oldContent = JSON.parse(rawData);
    //     asdfasdfUpdates = compareTwoArrays(new_asdfasdf.url, oldContent.url);
    // });
}
// 기존 목록의 파일들(json)을 만들고,
// 기존 목록에서 긁어온 목록과 지금의 목록을 대조하고,
// 결과값 리턴

async function updateFiles(){
    const new_industSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
    fs.writeFile("./Backend/compare_list/industSec.json", JSON.stringify(new_industSec), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("industSec.json written successfully\n");
    });

    const new_software = await crawlSoftware("url");
    fs.writeFile("./Backend/compare_list/software.json", JSON.stringify(new_software), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("software.json written successfully\n");
    });
    const new_CAUnotice = await crawlCAUnotice("url");
    fs.writeFile("./Backend/compare_list/CAUnotice.json", JSON.stringify(new_CAUnotice), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("CAUnotice.json written successfully\n");
    });

    const new_integEngineering = await crawlIntegEngineering("url");
    fs.writeFile("./Backend/compare_list/integEngineering.json", JSON.stringify(new_integEngineering), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("integEngineering.json written successfully\n");
    });

    const new_korean = await crawlKorean("url");
    fs.writeFile("./Backend/compare_list/korean.json", JSON.stringify(new_korean), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("korean.json written successfully\n");
    });
}
// updateFiles();

// const new_industSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
// fs.writeFileSync("industSec.json", JSON.stringify(new_industSec), "utf8");
// console.log(new_industSec);
// console.log(JSON.stringify(new_industSec));
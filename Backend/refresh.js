import fs from "fs";
import { compareTwoArrays } from "./compare.js"
import { mailHandler } from "./mailHandler.js";
import path from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';
import KRname from "./name_en2kr.js"

import crawlIndustSec from "./crawlers/url_scraper_indust_sec.js";
import crawlSoftware from "./crawlers/url_scraper_software.js";
import crawlCAUnotice from "./crawlers/url_scraper_cauNotice.js";
import crawlIntegEngineering from "./crawlers/url_scraper_integ_engineering.js";
import crawlKorean from "./crawlers/url_scraper_korean.js";
import crawlMechEngineering from "./crawlers/url_scraper_mech_engineering.js";
import crawlPsychology from "./crawlers/url_scraper_psychology.js";
import crawlBusiness from "./crawlers/url_scraper_business.js";
import crawlElecEngineering from "./crawlers/url_scraper_elec_engineering.js";
import crawlEnglish from "./crawlers/url_scraper_English.js";
import crawlEnerEngineering from "./crawlers/url_scraper_ener_engineering.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// refresh 함수에서는
// 크롤러 실행 -> 기존 목록과 대조 -> 변화 있으면 sendMail() 후 원래 목록 대체, 없으면 행동하지 않음 -> 다음 크롤러 실행.
export async function refresh(nextIdNum){
    // *********************************
    // *** 1. 크롤러로부터 데이터 로드 ***
    // *********************************
    const new_industSec = await crawlIndustSec("url");
    console.log("industSec loaded");
    const new_software = await crawlSoftware("url");
    console.log("software loaded");
    const new_CAUnotice = await crawlCAUnotice("url");
    console.log("CAUnotice loaded");
    const new_integEngineering = await crawlIntegEngineering("url");
    console.log("integEngineering loaded");
    const new_korean = await crawlKorean("url");
    console.log("korean loaded");
    const new_mechEngineering = await crawlMechEngineering("url");
    console.log("mechEngineering loaded");
    const new_psychology = await crawlPsychology("url");
    console.log("psychology loaded");
    const new_business = await crawlBusiness("url");
    console.log("business loaded");
    const new_elecEngineering = await crawlElecEngineering("url");
    console.log("elecEngineering loaded");
    const new_english = await crawlEnglish("url");
    console.log("english loaded");
    const new_enerEngineering = await crawlEnerEngineering("url");
    console.log("enerEngineering loaded");
    
    
    // *****************************************************************
    // *** 2. 기존 목록을 읽어 현재 데이터와 비교한 후, 변경 개수를 저장 ***
    // *****************************************************************
    let storeDifferences = [];
    function readFileAndCompareWithOriginal(majorName,dataObject){
        const rawData = fs.readFileSync(`./compare_list/${majorName}.json`,"utf8");
        const oldContent = JSON.parse(rawData);
        console.log(`${majorName}:`);
        console.log(oldContent);
        return compareTwoArrays(dataObject.url, oldContent.url);
    }
    storeDifferences.industSec = readFileAndCompareWithOriginal("industSec",new_industSec);
    storeDifferences.software = readFileAndCompareWithOriginal("software",new_software);
    storeDifferences.CAUnotice = readFileAndCompareWithOriginal("CAUnotice",new_CAUnotice);
    storeDifferences.integEngineering = readFileAndCompareWithOriginal("integEngineering",new_integEngineering);
    storeDifferences.korean = readFileAndCompareWithOriginal("korean",new_korean);
    storeDifferences.mechEngineering = readFileAndCompareWithOriginal("mechEngineering",new_mechEngineering);
    storeDifferences.psychology = readFileAndCompareWithOriginal("psychology",new_psychology);
    storeDifferences.business = readFileAndCompareWithOriginal("business",new_business);
    storeDifferences.elecEngineering = readFileAndCompareWithOriginal("elecEngineering",new_elecEngineering);
    storeDifferences.english = readFileAndCompareWithOriginal("english",new_english);
    storeDifferences.enerEngineering = readFileAndCompareWithOriginal("enerEngineering",new_enerEngineering);
    // storeDiffences.${majorName} = [ 추가된 공지 위치, 추가된 공지 위치 2 ];
    
    // ****************************************************
    // *** 3. 변경 개수를 기반으로 실제 추가된 내용을 저장 ***
    // ****************************************************
    let updatedContentStorage = [];
    function addURLsAndTitlesToStorage(majorName,dataObject,storeDiff){
        const numberOfDifferences = storeDiff.length;
        if(numberOfDifferences == 0) return;
        let tempUrls = [];
        let tempTitles = [];
        // 예를 들어 n개의 공지([0]~[n-1]) 중 0번 공지랑 3번 공지가 바뀌었다:
        // [0]: 0, [1]: 3
        // 접근: storeDiff[]
        for(let i=0;i<numberOfDifferences;i++){
            tempUrls.push(dataObject.url[storeDiff[i]]);
            tempTitles.push(dataObject.title[storeDiff[i]]);
        }
        // console.log(tempUrls);
        // console.log(tempTitles);
        updatedContentStorage[majorName] = {
            majorName: KRname(majorName),
            url: tempUrls,
            title: tempTitles
        };
    }
    addURLsAndTitlesToStorage("industSec",new_industSec,storeDifferences.industSec);
    addURLsAndTitlesToStorage("software",new_software,storeDifferences.software);
    addURLsAndTitlesToStorage("CAUnotice",new_CAUnotice,storeDifferences.CAUnotice);
    addURLsAndTitlesToStorage("integEngineering",new_integEngineering,storeDifferences.integEngineering);
    addURLsAndTitlesToStorage("korean",new_korean,storeDifferences.korean);
    addURLsAndTitlesToStorage("mechEngineering",new_mechEngineering,storeDifferences.mechEngineering);
    addURLsAndTitlesToStorage("psychology",new_psychology,storeDifferences.psychology);
    addURLsAndTitlesToStorage("business",new_business,storeDifferences.business);
    addURLsAndTitlesToStorage("elecEngineering",new_elecEngineering,storeDifferences.elecEngineering);
    addURLsAndTitlesToStorage("english",new_english,storeDifferences.english);
    addURLsAndTitlesToStorage("enerEngineering",new_enerEngineering,storeDifferences.enerEngineering);
    

    // ********************************************************************
    // *** 4. 각 유저의 구독정보 확인 후 해당되는 게시글을 추가해 메일 전송 ***
    // ********************************************************************
    let dataToSend = [];
    let sendOrNot = 0;
    const userDataBase = JSON.parse(fs.readFileSync("./userDB_log/userDB.json","utf8"),"utf8");
    for(let i=0;i<nextIdNum;i++){
        // console.log(userDataBase[i]);
        if(userDataBase[i].industSec == "true" && updatedContentStorage.industSec != undefined) {dataToSend.push(updatedContentStorage.industSec); sendOrNot++;}
        if(userDataBase[i].software == "true" && updatedContentStorage.software != undefined) {dataToSend.push(updatedContentStorage.software); sendOrNot++;}
        if(userDataBase[i].CAUnotice == "true" && updatedContentStorage.CAUnotice != undefined) {dataToSend.push(updatedContentStorage.CAUnotice); sendOrNot++;}
        if(userDataBase[i].integEngineering == "true" && updatedContentStorage.integEngineering != undefined) {dataToSend.push(updatedContentStorage.integEngineering); sendOrNot++;}
        if(userDataBase[i].korean == "true" && updatedContentStorage.korean != undefined) {dataToSend.push(updatedContentStorage.korean); sendOrNot++;}
        if(userDataBase[i].mechEngineering == "true" && updatedContentStorage.mechEngineering != undefined) {dataToSend.push(updatedContentStorage.mechEngineering); sendOrNot++;}
        if(userDataBase[i].psychology == "true" && updatedContentStorage.psychology != undefined) {dataToSend.push(updatedContentStorage.psychology); sendOrNot++;}
        if(userDataBase[i].business == "true" && updatedContentStorage.business != undefined) {dataToSend.push(updatedContentStorage.business); sendOrNot++;}
        if(userDataBase[i].elecEngineering == "true" && updatedContentStorage.elecEngineering != undefined) {dataToSend.push(updatedContentStorage.elecEngineering); sendOrNot++;}
        if(userDataBase[i].english == "true" && updatedContentStorage.english != undefined) {dataToSend.push(updatedContentStorage.english); sendOrNot++;}
        if(userDataBase[i].enerEngineering == "true" && updatedContentStorage.enerEngineering != undefined) {dataToSend.push(updatedContentStorage.enerEngineering); sendOrNot++;}
        if(sendOrNot != 0){
            console.log(`dataToSend[${moment().format('YYYYMMDD, h:mm:ss a')}]:`);
            console.log(dataToSend);
            mailHandler(userDataBase[i].name, userDataBase[i].email, dataToSend);
            sendOrNot = 0;
            dataToSend = [];
        }
    }
    // ********************************************
    // *** 5. 변경 사항이 있었던 게시판들은 초기화 ***
    // ********************************************
    if(storeDifferences.industSec != undefined && storeDifferences.industSec != 0){
        let industSecObject = new_industSec.url;
        industSecObject = industSecObject.push(new_industSec.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'industSec.json'), JSON.stringify(industSecObject), (err) => {
                if(err){console.log(err);}
                else {console.log("industSec updated successfully");}});
        }
    if(storeDifferences.software != undefined && storeDifferences.software != 0){
        let softwareObject = new_software.url;
        softwareObject = softwareObject.push(new_software.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'software.json'), JSON.stringify(softwareObject), (err) => {
                if(err){console.log(err);}
                else {console.log("software updated successfully");}});
        }
    if(storeDifferences.CAUnotice != undefined && storeDifferences.CAUnotice != 0){
        let CAUnoticeObject = new_CAUnotice.url;
        CAUnoticeObject = CAUnoticeObject.push(new_CAUnotice.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'CAUnotice.json'), JSON.stringify(CAUnoticeObject), (err) => {
                if(err){console.log(err);}
                else {console.log("CAUnotice updated successfully");}});
        }
    if(storeDifferences.integEngineering != undefined && storeDifferences.integEngineering != 0){
        let integEngineeringObject = new_integEngineering.url;
        integEngineeringObject = integEngineeringObject.push(new_integEngineering.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'integEngineering.json'), JSON.stringify(integEngineeringObject), (err) => {
                if(err){console.log(err);}
                else {console.log("integEngineering updated successfully");}});
        }
    if(storeDifferences.korean != undefined && storeDifferences.korean != 0){
        let koreanObject = new_korean.url;
        koreanObject = koreanObject.push(new_korean.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'korean.json'), JSON.stringify(koreanObject), (err) => {
                if(err){console.log(err);}
                else {console.log("korean updated successfully");}});
        }
    if(storeDifferences.mechEngineering != undefined && storeDifferences.mechEngineering != 0){
        let mechEngineeringObject = new_mechEngineering.url;
        mechEngineeringObject = mechEngineeringObject.push(new_mechEngineering.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'mechEngineering.json'), JSON.stringify(mechEngineeringObject), (err) => {
                if(err){console.log(err);}
                else {console.log("mechEngineering updated successfully");}});
        }
    if(storeDifferences.psychology != undefined && storeDifferences.psychology != 0){
        let psychologyObject = new_psychology.url;
        psychologyObject = psychologyObject.push(new_psychology.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'psychology.json'), JSON.stringify(psychologyObject), (err) => {
                if(err){console.log(err);}
                else {console.log("psychology updated successfully");}});
        }
    if(storeDifferences.business != undefined && storeDifferences.business != 0){
        let businessObject = new_business.url;
        businessObject = businessObject.push(new_business.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'business.json'), JSON.stringify(businessObject), (err) => {
                if(err){console.log(err);}
                else {console.log("business updated successfully");}});
        }
    if(storeDifferences.elecEngineering != undefined && storeDifferences.elecEngineering != 0){
        let elecEngineeringObject = new_elecEngineering.url;
        elecEngineeringObject = elecEngineeringObject.push(new_elecEngineering.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'elecEngineering.json'), JSON.stringify(elecEngineeringObject), (err) => {
                if(err){console.log(err);}
                else {console.log("elecEngineering updated successfully");}});
        }
    if(storeDifferences.english != undefined && storeDifferences.english != 0){
        let englishObject = new_english.url;
        englishObject = englishObject.push(new_english.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'english.json'), JSON.stringify(englishObject), (err) => {
                if(err){console.log(err);}
                else {console.log("english updated successfully");}});
        }
    if(storeDifferences.enerEngineering != undefined && storeDifferences.enerEngineering != 0){
        let enerEngineeringObject = new_enerEngineering.url;
        enerEngineeringObject = enerEngineeringObject.push(new_enerEngineering.title);
        fs.writeFile(path.join(__dirname, 'compare_list', 'enerEngineering.json'), JSON.stringify(enerEngineeringObject), (err) => {
                if(err){console.log(err);}
                else {console.log("enerEngineering updated successfully");}});
        }
}
// refresh(1);


// **** 추가할 코드 생성기 ****
// const major = [
//     "mechEngineering",
//     "psychology",
//     "business",
//     "elecEngineering",
//     "english",
//     "enerEngineering"
// ];

// for(let i=0;i<6;i++){ // enerEngineering => 대소문자주의
//     addURLsAndTitlesToStorage("${major[i]}",new_${major[i]},storeDifferences.${major[i]});
// }
// for(let i=0;i<6;i++){ // enerEngineering => 대소문자주의
//     console.log(`if(userDataBase[i].${major[i]} == "true" && updatedContentStorage.${major[i]} != undefined) dataToSend.push(updatedContentStorage.${major[i]});`);
// }


// 기존 목록의 파일들(json)을 만들고,
// 기존 목록에서 긁어온 목록과 지금의 목록을 대조하고,
// 결과값 리턴

async function updateFiles(){
    const new_industSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
    fs.writeFile("./compare_list/industSec.json", JSON.stringify(new_industSec), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("industSec.json written successfully\n");
    });

    const new_software = await crawlSoftware("url");
    fs.writeFile("./compare_list/software.json", JSON.stringify(new_software), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("software.json written successfully\n");
    });
    const new_CAUnotice = await crawlCAUnotice("url");
    fs.writeFile("./compare_list/CAUnotice.json", JSON.stringify(new_CAUnotice), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("CAUnotice.json written successfully\n");
    });

    const new_integEngineering = await crawlIntegEngineering("url");
    fs.writeFile("./compare_list/integEngineering.json", JSON.stringify(new_integEngineering), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("integEngineering.json written successfully\n");
    });

    const new_korean = await crawlKorean("url");
    fs.writeFile("./compare_list/korean.json", JSON.stringify(new_korean), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("korean.json written successfully\n");
    });

    const new_mechEngineering = await crawlMechEngineering("url");
    fs.writeFile("./compare_list/mechEngineering.json", JSON.stringify(new_mechEngineering), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("mechEngineering.json written successfully\n");
    });

    const new_psychology = await crawlPsychology("url");
    fs.writeFile("./compare_list/psychology.json", JSON.stringify(new_psychology), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("psychology.json written successfully\n");
    });

    const new_business = await crawlBusiness("url");
    fs.writeFile("./compare_list/business.json", JSON.stringify(new_business), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("business.json written successfully\n");
    });

    const new_elecEngineering = await crawlElecEngineering("url");
    fs.writeFile("./compare_list/elecEngineering.json", JSON.stringify(new_elecEngineering), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("elecEngineering.json written successfully\n");
    });

    const new_english = await crawlEnglish("url");
    fs.writeFile("./compare_list/english.json", JSON.stringify(new_english), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("english.json written successfully\n");
    });
    
    const new_enerEngineering = await crawlEnerEngineering("url");
    fs.writeFile("./compare_list/enerEngineering.json", JSON.stringify(new_enerEngineering), "utf8", (err) => {
        if(err) console.log(err);
        else console.log("enerEngineering.json written successfully\n");
    });
}
// updateFiles();

// const new_industSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
// fs.writeFileSync("industSec.json", JSON.stringify(new_industSec), "utf8");
// console.log(new_industSec);
// console.log(JSON.stringify(new_industSec));
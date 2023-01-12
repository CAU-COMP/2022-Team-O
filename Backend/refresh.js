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
import crawlUrbanPlanRealEstate from "./crawlers/url_scraper_urban.js";
import crawlNursing from "./crawlers/url_scraper_nursing.js";
import crawlPolitics from "./crawlers/url_scraper_poli_science.js";
import crawlPhysicalEd from "./crawlers/url_scraper_phys_education.js";
import crawlEducation from "./crawlers/url_scraper_education.js";
import crawlEarlyChildhoodEd from "./crawlers/url_scraper_child_education.js";
import crawlEnglishEd from "./crawlers/url_scraper_eng_education.js";
import crawlChem from "./crawlers/url_scraper_chemistry.js";
import crawlLifeScience from "./crawlers/url_scraper_life_science.js";
import crawlJapanese from "./crawlers/url_scraper_japanese.js";
import crawlChinese from "./crawlers/url_scraper_chinese.js";
import crawlMath from "./crawlers/url_scraper_math.js";
import crawlAi from "./crawlers/url_scraper_ai.js";
import crawlChemEngineering from "./crawlers/url_scraper_chem_engineering.js";
import crawlLogistics from "./crawlers/url_scraper_logistics.js";
import crawlEcon from "./crawlers/url_scraper_economics.js";
import crawlPhysics from "./crawlers/url_scraper_physics.js";
import crawlLibInfoScience from "./crawlers/url_scraper_libr_info_science.js";
import crawlMediaComm from "./crawlers/url_scraper_media_communication.js";
import crawlSociology from "./crawlers/url_scraper_sociology.js";
import crawlSocialWelfare from "./crawlers/url_scraper_soci_welfare.js";

let ON = "false";
// ON = "true";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// refresh 함수에서는
// 크롤러 실행 -> 기존 목록과 대조 -> 변화 있으면 sendMail() 후 원래 목록 대체, 없으면 행동하지 않음 -> 다음 크롤러 실행.
export async function refresh(nextIdNum){

    console.log("*** Refreshing Started ***")

    // *********************************
    // *** 1. 크롤러로부터 데이터 로드 ***
    // *********************************
    console.time("fully loaded in ");
    
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
    const new_urbanPlanRealEstate = await crawlUrbanPlanRealEstate("url");
    console.log("urbanPlanRealEstate loaded");
    const new_nursing = await crawlNursing("url");
    console.log("nursing loaded");
    const new_politics = await crawlPolitics("url");
    console.log("politics loaded");
    const new_physicalEd = await crawlPhysicalEd("url");
    console.log("physicalEd loaded");
    const new_education = await crawlEducation("url");
    console.log("education loaded");
    const new_earlyChildhoodEd = await crawlEarlyChildhoodEd("url");
    console.log("earlyChildhoodEd loaded");
    const new_englishEd = await crawlEnglishEd("url");
    console.log("englishEd loaded");
    const new_chem = await crawlChem("url");
    console.log("chem loaded");
    const new_lifeScience = await crawlLifeScience("url");
    console.log("lifeScience loaded");
    const new_japanese = await crawlJapanese("url");
    console.log("japanese loaded");
    const new_chinese = await crawlChinese("url");
    console.log("chinese loaded");
    const new_math = await crawlMath("url");
    console.log("math loaded");
    const new_ai = await crawlAi("url");
    console.log("ai loaded");
    const new_chemEngineering = await crawlChemEngineering("url");
    console.log("chemEngineering loaded");
    const new_logistics = await crawlLogistics("url");
    console.log("logistics loaded");
    const new_econ = await crawlEcon("url");
    console.log("econ loaded");
    const new_physics = await crawlPhysics("url");
    console.log("physics loaded");
    const new_libInfoScience = await crawlLibInfoScience("url");
    console.log("libInfoScience loaded");
    const new_mediaComm = await crawlMediaComm("url");
    console.log("mediaComm loaded");
    const new_sociology = await crawlSociology("url");
    console.log("sociology loaded");
    const new_socialWelfare = await crawlSocialWelfare("url");
    console.log("socialWelfare loaded");

    console.timeEnd("fully loaded in ");
    
    // *****************************************************************
    // *** 2. 기존 목록을 읽어 현재 데이터와 비교한 후, 변경 개수를 저장 ***
    // *****************************************************************
    let storeDifferences = [];
    function readFileAndCompareWithOriginal(majorName,dataObject){
        const rawData = fs.readFileSync(path.join(__dirname, 'compare_list', `${majorName}.json`),"utf8")
        const oldContent = JSON.parse(rawData);
        // console.log(`${majorName}:`);
        // console.log(oldContent);
        return compareTwoArrays(dataObject.url, oldContent.url);
    }
    storeDifferences.industSec =        readFileAndCompareWithOriginal("industSec",new_industSec);
    storeDifferences.software =         readFileAndCompareWithOriginal("software",new_software);
    storeDifferences.CAUnotice =        readFileAndCompareWithOriginal("CAUnotice",new_CAUnotice);
    storeDifferences.integEngineering = readFileAndCompareWithOriginal("integEngineering",new_integEngineering);
    storeDifferences.korean =           readFileAndCompareWithOriginal("korean",new_korean);
    storeDifferences.mechEngineering =  readFileAndCompareWithOriginal("mechEngineering",new_mechEngineering);
    storeDifferences.psychology =       readFileAndCompareWithOriginal("psychology",new_psychology);
    storeDifferences.business =         readFileAndCompareWithOriginal("business",new_business);
    storeDifferences.elecEngineering =  readFileAndCompareWithOriginal("elecEngineering",new_elecEngineering);
    storeDifferences.english =          readFileAndCompareWithOriginal("english",new_english);
    storeDifferences.enerEngineering =  readFileAndCompareWithOriginal("enerEngineering",new_enerEngineering);
    storeDifferences.urbanPlanRealEstate = readFileAndCompareWithOriginal("urbanPlanRealEstate", new_urbanPlanRealEstate);
    storeDifferences.nursing = readFileAndCompareWithOriginal("nursing", new_nursing);
    storeDifferences.politics = readFileAndCompareWithOriginal("politics", new_politics);
    storeDifferences.physicalEd = readFileAndCompareWithOriginal("physicalEd", new_physicalEd);
    storeDifferences.education = readFileAndCompareWithOriginal("education", new_education);
    storeDifferences.earlyChildhoodEd = readFileAndCompareWithOriginal("earlyChildhoodEd", new_earlyChildhoodEd);
    storeDifferences.englishEd = readFileAndCompareWithOriginal("englishEd", new_englishEd);
    storeDifferences.chem = readFileAndCompareWithOriginal("chem", new_chem);
    storeDifferences.lifeScience = readFileAndCompareWithOriginal("lifeScience", new_lifeScience);
    storeDifferences.japanese = readFileAndCompareWithOriginal("japanese", new_japanese);
    storeDifferences.chinese = readFileAndCompareWithOriginal("chinese", new_chinese);
    storeDifferences.math = readFileAndCompareWithOriginal("math", new_math);
    storeDifferences.ai = readFileAndCompareWithOriginal("ai", new_ai);
    storeDifferences.chemEngineering = readFileAndCompareWithOriginal("chemEngineering", new_chemEngineering);
    storeDifferences.logistics = readFileAndCompareWithOriginal("logistics", new_logistics);
    storeDifferences.econ = readFileAndCompareWithOriginal("econ", new_econ);
    storeDifferences.physics = readFileAndCompareWithOriginal("physics", new_physics);
    storeDifferences.libInfoScience = readFileAndCompareWithOriginal("libInfoScience", new_libInfoScience);
    storeDifferences.mediaComm = readFileAndCompareWithOriginal("mediaComm", new_mediaComm);
    storeDifferences.sociology = readFileAndCompareWithOriginal("sociology", new_sociology);
    storeDifferences.socialWelfare = readFileAndCompareWithOriginal("socialWelfare", new_socialWelfare);
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
        // **************************
        // *** 3.5. 중복 내용 삭제 ***
        // **************************
        // 일부 게시판들에서 공지와 일반게시글로 동시에 업로드 되는 공지는 크롤링이 두 번 되는 문제가 발생하므로
        // url 내의 공지들을 서로 체크하여 중복되는 공지가 있다면 삭제한다
        let duplicates = [];
        for(let i=0;i<numberOfDifferences;i++){
            for(let j=i+1;j<numberOfDifferences;j++){
                if(tempUrls[i] == tempUrls[j]){
                    duplicates.push(j);
                }
            }
        }
        const count = duplicates.length; // 중복 개수
        for(let i=count-1;i>=0;i--){ // 앞부분부터 자르면 뒤의 원소들이 당겨지므로 뒤부터 자름
            tempUrls.splice(duplicates[i],1);
            tempTitles.splice(duplicates[i],1);
            console.log(`dup updatedContentStorage.${majorName}.${duplicates[i]} deleted`);
        }

        // 결과 저장
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
    addURLsAndTitlesToStorage("urbanPlanRealEstate", new_urbanPlanRealEstate, storeDifferences.urbanPlanRealEstate);
    addURLsAndTitlesToStorage("nursing", new_nursing, storeDifferences.nursing);
    addURLsAndTitlesToStorage("politics", new_politics, storeDifferences.politics);
    addURLsAndTitlesToStorage("physicalEd", new_physicalEd, storeDifferences.physicalEd);
    addURLsAndTitlesToStorage("education", new_education, storeDifferences.education);
    addURLsAndTitlesToStorage("earlyChildhoodEd", new_earlyChildhoodEd, storeDifferences.earlyChildhoodEd);
    addURLsAndTitlesToStorage("englishEd", new_englishEd, storeDifferences.englishEd);
    addURLsAndTitlesToStorage("chem", new_chem, storeDifferences.chem);
    addURLsAndTitlesToStorage("lifeScience", new_lifeScience, storeDifferences.lifeScience);
    addURLsAndTitlesToStorage("japanese", new_japanese, storeDifferences.japanese);
    addURLsAndTitlesToStorage("chinese", new_chinese, storeDifferences.chinese);
    addURLsAndTitlesToStorage("math", new_math, storeDifferences.math);
    addURLsAndTitlesToStorage("ai", new_ai, storeDifferences.ai);
    addURLsAndTitlesToStorage("chemEngineering", new_chemEngineering, storeDifferences.chemEngineering);
    addURLsAndTitlesToStorage("logistics", new_logistics, storeDifferences.logistics);
    addURLsAndTitlesToStorage("econ", new_econ, storeDifferences.econ);
    addURLsAndTitlesToStorage("physics", new_physics, storeDifferences.physics);
    addURLsAndTitlesToStorage("libInfoScience", new_libInfoScience, storeDifferences.libInfoScience);
    addURLsAndTitlesToStorage("mediaComm", new_mediaComm, storeDifferences.mediaComm);
    addURLsAndTitlesToStorage("sociology", new_sociology, storeDifferences.sociology);
    addURLsAndTitlesToStorage("socialWelfare", new_socialWelfare, storeDifferences.socialWelfare);
    
    
    if(updatedContentStorage.length == 0) console.log("*** No Updates!");


    // ********************************************************************
    // *** 4. 각 유저의 구독정보 확인 후 해당되는 게시글을 추가해 메일 전송 ***
    // ********************************************************************

    // 메일에서 받는 게시판의 순서를 바꾸려면 여기서 바꾸면 됨
    let dataToSend = [];
    let sendOrNot = 0;
    const userDataBase = JSON.parse(fs.readFileSync("./userDB_log/userDB.json","utf8"),"utf8");
    for(let i=0;i<nextIdNum;i++){
        if(userDataBase[i].subStatus == "false") continue;
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
        if(userDataBase[i].urbanPlanRealEstate == "true" && updatedContentStorage.urbanPlanRealEstate != undefined) {dataToSend.push(updatedContentStorage.urbanPlanRealEstate); sendOrNot++;}
        if(userDataBase[i].nursing == "true" && updatedContentStorage.nursing != undefined) {dataToSend.push(updatedContentStorage.nursing); sendOrNot++;}
        if(userDataBase[i].politics == "true" && updatedContentStorage.politics != undefined) {dataToSend.push(updatedContentStorage.politics); sendOrNot++;}
        if(userDataBase[i].physicalEd == "true" && updatedContentStorage.physicalEd != undefined) {dataToSend.push(updatedContentStorage.physicalEd); sendOrNot++;}
        if(userDataBase[i].education == "true" && updatedContentStorage.education != undefined) {dataToSend.push(updatedContentStorage.education); sendOrNot++;}
        if(userDataBase[i].earlyChildhoodEd == "true" && updatedContentStorage.earlyChildhoodEd != undefined) {dataToSend.push(updatedContentStorage.earlyChildhoodEd); sendOrNot++;}
        if(userDataBase[i].englishEd == "true" && updatedContentStorage.englishEd != undefined) {dataToSend.push(updatedContentStorage.englishEd); sendOrNot++;}
        if(userDataBase[i].chem == "true" && updatedContentStorage.chem != undefined) {dataToSend.push(updatedContentStorage.chem); sendOrNot++;}
        if(userDataBase[i].lifeScience == "true" && updatedContentStorage.lifeScience != undefined) {dataToSend.push(updatedContentStorage.lifeScience); sendOrNot++;}
        if(userDataBase[i].japanese == "true" && updatedContentStorage.japanese != undefined) {dataToSend.push(updatedContentStorage.japanese); sendOrNot++;}
        if(userDataBase[i].chinese == "true" && updatedContentStorage.chinese != undefined) {dataToSend.push(updatedContentStorage.chinese); sendOrNot++;}
        if(userDataBase[i].math == "true" && updatedContentStorage.math != undefined) {dataToSend.push(updatedContentStorage.math); sendOrNot++;}
        if(userDataBase[i].ai == "true" && updatedContentStorage.ai != undefined) {dataToSend.push(updatedContentStorage.ai); sendOrNot++;}
        if(userDataBase[i].chemEngineering == "true" && updatedContentStorage.chemEngineering != undefined) {dataToSend.push(updatedContentStorage.chemEngineering); sendOrNot++;}
        if(userDataBase[i].logistics == "true" && updatedContentStorage.logistics != undefined) {dataToSend.push(updatedContentStorage.logistics); sendOrNot++;}
        if(userDataBase[i].econ == "true" && updatedContentStorage.econ != undefined) {dataToSend.push(updatedContentStorage.econ); sendOrNot++;}
        if(userDataBase[i].physics == "true" && updatedContentStorage.physics != undefined) {dataToSend.push(updatedContentStorage.physics); sendOrNot++;}
        if(userDataBase[i].libInfoScience == "true" && updatedContentStorage.libInfoScience != undefined) {dataToSend.push(updatedContentStorage.libInfoScience); sendOrNot++;}
        if(userDataBase[i].mediaComm == "true" && updatedContentStorage.mediaComm != undefined) {dataToSend.push(updatedContentStorage.mediaComm); sendOrNot++;}
        if(userDataBase[i].sociology == "true" && updatedContentStorage.sociology != undefined) {dataToSend.push(updatedContentStorage.sociology); sendOrNot++;}
        if(userDataBase[i].socialWelfare == "true" && updatedContentStorage.socialWelfare != undefined) {dataToSend.push(updatedContentStorage.socialWelfare); sendOrNot++;}

        if(sendOrNot != 0){
            // console.log(`dataToSend[${moment().format('YYYYMMDD, h:mm:ss a')}]:`);
            // console.log(dataToSend);
            // mailHandler(userDataBase[i].name, userDataBase[i].email, dataToSend, i);
            sendOrNot = 0;
            dataToSend = [];
        }
    }

    // console.log("storeDifferences.CAUnotice: " + storeDifferences.CAUnotice);
    // console.log("storeDifferences.mechEngineering: " + storeDifferences.mechEngineering);
    // updatedContentStorage.CAUnotice
    // console.log(updatedContentStorage.CAUnotice);

    // ********************************************
    // *** 5. 변경 사항이 있었던 게시판들은 초기화 ***
    // ********************************************
    if (storeDifferences.industSec.length != 0) {
        let industSecObject = {
            url: new_industSec.url,
            title: new_industSec.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'industSec.json'), JSON.stringify(industSecObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("industSec updated successfully"); }
        });
    }
    if (storeDifferences.software.length != 0) {
        let softwareObject = {
            url: new_software.url,
            title: new_software.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'software.json'), JSON.stringify(softwareObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("software updated successfully"); }
        });
    }
    if (storeDifferences.CAUnotice.length != 0) {
        let CAUnoticeObject = {
            url: new_CAUnotice.url,
            title: new_CAUnotice.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'CAUnotice.json'), JSON.stringify(CAUnoticeObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("CAUnotice updated successfully"); }
        });
    }
    if (storeDifferences.integEngineering.length != 0) {
        let integEngineeringObject = {
            url: new_integEngineering.url,
            title: new_integEngineering.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'integEngineering.json'), JSON.stringify(integEngineeringObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("integEngineering updated successfully"); }
        });
    }
    if (storeDifferences.korean.length != 0) {
        let koreanObject = {
            url: new_korean.url,
            title: new_korean.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'korean.json'), JSON.stringify(koreanObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("korean updated successfully"); }
        });
    }
    if (storeDifferences.mechEngineering.length != 0) {
        let mechEngineeringObject = {
            url: new_mechEngineering.url,
            title: new_mechEngineering.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'mechEngineering.json'), JSON.stringify(mechEngineeringObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("mechEngineering updated successfully"); }
        });
    }
    if (storeDifferences.psychology.length != 0) {
        let psychologyObject = {
            url: new_psychology.url,
            title: new_psychology.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'psychology.json'), JSON.stringify(psychologyObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("psychology updated successfully"); }
        });
    }
    if (storeDifferences.business.length != 0) {
        let businessObject = {
            url: new_business.url,
            title: new_business.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'business.json'), JSON.stringify(businessObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("business updated successfully"); }
        });
    }
    if (storeDifferences.elecEngineering.length != 0) {
        let elecEngineeringObject = {
            url: new_elecEngineering.url,
            title: new_elecEngineering.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'elecEngineering.json'), JSON.stringify(elecEngineeringObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("elecEngineering updated successfully"); }
        });
    }
    if (storeDifferences.english.length != 0) {
        let englishObject = {
            url: new_english.url,
            title: new_english.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'english.json'), JSON.stringify(englishObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("english updated successfully"); }
        });
    }
    if (storeDifferences.enerEngineering.length != 0) {
        let enerEngineeringObject = {
            url: new_enerEngineering.url,
            title: new_enerEngineering.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'enerEngineering.json'), JSON.stringify(enerEngineeringObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("enerEngineering updated successfully"); }
        });
    }
    if (storeDifferences.urbanPlanRealEstate.length != 0) {
        let urbanPlanRealEstateObject = {
            url: new_urbanPlanRealEstate.url,
            title: new_urbanPlanRealEstate.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'urbanPlanRealEstate.json'), JSON.stringify(urbanPlanRealEstateObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("urbanPlanRealEstate updated successfully"); }
        });
    }
    if (storeDifferences.nursing.length != 0) {
        let nursingObject = {
            url: new_nursing.url,
            title: new_nursing.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'nursing.json'), JSON.stringify(nursingObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("nursing updated successfully"); }
        });
    }
    if (storeDifferences.politics.length != 0) {
        let politicsObject = {
            url: new_politics.url,
            title: new_politics.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'politics.json'), JSON.stringify(politicsObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("politics updated successfully"); }
        });
    }
    if (storeDifferences.physicalEd.length != 0) {
        let physicalEdObject = {
            url: new_physicalEd.url,
            title: new_physicalEd.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'physicalEd.json'), JSON.stringify(physicalEdObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("physicalEd updated successfully"); }
        });
    }
    if (storeDifferences.education.length != 0) {
        let educationObject = {
            url: new_education.url,
            title: new_education.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'education.json'), JSON.stringify(educationObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("education updated successfully"); }
        });
    }
    if (storeDifferences.earlyChildhoodEd.length != 0) {
        let earlyChildhoodEdObject = {
            url: new_earlyChildhoodEd.url,
            title: new_earlyChildhoodEd.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'earlyChildhoodEd.json'), JSON.stringify(earlyChildhoodEdObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("earlyChildhoodEd updated successfully"); }
        });
    }
    if (storeDifferences.englishEd.length != 0) {
        let englishEdObject = {
            url: new_englishEd.url,
            title: new_englishEd.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'englishEd.json'), JSON.stringify(englishEdObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("englishEd updated successfully"); }
        });
    }
    if (storeDifferences.chem.length != 0) {
        let chemObject = {
            url: new_chem.url,
            title: new_chem.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'chem.json'), JSON.stringify(chemObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("chem updated successfully"); }
        });
    }
    if (storeDifferences.lifeScience.length != 0) {
        let lifeScienceObject = {
            url: new_lifeScience.url,
            title: new_lifeScience.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'lifeScience.json'), JSON.stringify(lifeScienceObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("lifeScience updated successfully"); }
        });
    }
    if (storeDifferences.japanese.length != 0) {
        let japaneseObject = {
            url: new_japanese.url,
            title: new_japanese.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'japanese.json'), JSON.stringify(japaneseObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("japanese updated successfully"); }
        });
    }
    if (storeDifferences.chinese.length != 0) {
        let chineseObject = {
            url: new_chinese.url,
            title: new_chinese.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'chinese.json'), JSON.stringify(chineseObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("chinese updated successfully"); }
        });
    }
    if (storeDifferences.math.length != 0) {
        let mathObject = {
            url: new_math.url,
            title: new_math.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'math.json'), JSON.stringify(mathObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("math updated successfully"); }
        });
    }
    if (storeDifferences.ai.length != 0) {
        let aiObject = {
            url: new_ai.url,
            title: new_ai.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'ai.json'), JSON.stringify(aiObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("ai updated successfully"); }
        });
    }
    if (storeDifferences.chemEngineering.length != 0) {
        let chemEngineeringObject = {
            url: new_chemEngineering.url,
            title: new_chemEngineering.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'chemEngineering.json'), JSON.stringify(chemEngineeringObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("chemEngineering updated successfully"); }
        });
    }
    if (storeDifferences.logistics.length != 0) {
        let logisticsObject = {
            url: new_logistics.url,
            title: new_logistics.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'logistics.json'), JSON.stringify(logisticsObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("logistics updated successfully"); }
        });
    }
    if (storeDifferences.econ.length != 0) {
        let econObject = {
            url: new_econ.url,
            title: new_econ.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'econ.json'), JSON.stringify(econObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("econ updated successfully"); }
        });
    }
    if (storeDifferences.physics.length != 0) {
        let physicsObject = {
            url: new_physics.url,
            title: new_physics.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'physics.json'), JSON.stringify(physicsObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("physics updated successfully"); }
        });
    }
    if (storeDifferences.libInfoScience.length != 0) {
        let libInfoScienceObject = {
            url: new_libInfoScience.url,
            title: new_libInfoScience.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'libInfoScience.json'), JSON.stringify(libInfoScienceObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("libInfoScience updated successfully"); }
        });
    }
    if (storeDifferences.mediaComm.length != 0) {
        let mediaCommObject = {
            url: new_mediaComm.url,
            title: new_mediaComm.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'mediaComm.json'), JSON.stringify(mediaCommObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("mediaComm updated successfully"); }
        });
    }
    if (storeDifferences.sociology.length != 0) {
        let sociologyObject = {
            url: new_sociology.url,
            title: new_sociology.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'sociology.json'), JSON.stringify(sociologyObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("sociology updated successfully"); }
        });
    }
    if (storeDifferences.socialWelfare.length != 0) {
        let socialWelfareObject = {
            url: new_socialWelfare.url,
            title: new_socialWelfare.title
        };
        fs.writeFile(path.join(__dirname, 'compare_list', 'socialWelfare.json'), JSON.stringify(socialWelfareObject, null, 4), (err) => {
            if (err) { console.log(err); } else { console.log("socialWelfare updated successfully"); }
        });
    }

}
if(ON == "true") refresh(1);


// 기존 목록의 파일들(json)을 만들고,
// 기존 목록에서 긁어온 목록과 지금의 목록을 대조하고,
// 결과값 리턴

export async function updateFiles(){
    const new_industSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
    fs.writeFile("./compare_list/industSec.json", JSON.stringify(new_industSec, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("industSec.json written successfully\n");
    });
    const new_software = await crawlSoftware("url");
    fs.writeFile("./compare_list/software.json", JSON.stringify(new_software, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("software.json written successfully\n");
    });
    const new_CAUnotice = await crawlCAUnotice("url");
    fs.writeFile("./compare_list/CAUnotice.json", JSON.stringify(new_CAUnotice, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("CAUnotice.json written successfully\n");
    });
    const new_integEngineering = await crawlIntegEngineering("url");
    fs.writeFile("./compare_list/integEngineering.json", JSON.stringify(new_integEngineering, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("integEngineering.json written successfully\n");
    });
    const new_korean = await crawlKorean("url");
    fs.writeFile("./compare_list/korean.json", JSON.stringify(new_korean, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("korean.json written successfully\n");
    });
    const new_mechEngineering = await crawlMechEngineering("url");
    fs.writeFile("./compare_list/mechEngineering.json", JSON.stringify(new_mechEngineering, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("mechEngineering.json written successfully\n");
    });
    const new_psychology = await crawlPsychology("url");
    fs.writeFile("./compare_list/psychology.json", JSON.stringify(new_psychology, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("psychology.json written successfully\n");
    });
    const new_business = await crawlBusiness("url");
    fs.writeFile("./compare_list/business.json", JSON.stringify(new_business, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("business.json written successfully\n");
    });
    const new_elecEngineering = await crawlElecEngineering("url");
    fs.writeFile("./compare_list/elecEngineering.json", JSON.stringify(new_elecEngineering, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("elecEngineering.json written successfully\n");
    });
    const new_english = await crawlEnglish("url");
    fs.writeFile("./compare_list/english.json", JSON.stringify(new_english, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("english.json written successfully\n");
    });
    const new_enerEngineering = await crawlEnerEngineering("url");
    fs.writeFile("./compare_list/enerEngineering.json", JSON.stringify(new_enerEngineering, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("enerEngineering.json written successfully\n");
    });
    const new_urbanPlanRealEstate = await crawlUrbanPlanRealEstate("url");
    fs.writeFile("./compare_list/urbanPlanRealEstate.json", JSON.stringify(new_urbanPlanRealEstate, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("urbanPlanRealEstate.json written successfully");
    });

    const new_nursing = await crawlNursing("url");
    fs.writeFile("./compare_list/nursing.json", JSON.stringify(new_nursing, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("nursing.json written successfully");
    });

    const new_politics = await crawlPolitics("url");
    fs.writeFile("./compare_list/politics.json", JSON.stringify(new_politics, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("politics.json written successfully");
    });

    const new_physicalEd = await crawlPhysicalEd("url");
    fs.writeFile("./compare_list/physicalEd.json", JSON.stringify(new_physicalEd, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("physicalEd.json written successfully");
    });

    const new_education = await crawlEducation("url");
    fs.writeFile("./compare_list/education.json", JSON.stringify(new_education, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("education.json written successfully");
    });

    const new_earlyChildhoodEd = await crawlEarlyChildhoodEd("url");
    fs.writeFile("./compare_list/earlyChildhoodEd.json", JSON.stringify(new_earlyChildhoodEd, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("earlyChildhoodEd.json written successfully");
    });

    const new_englishEd = await crawlEnglishEd("url");
    fs.writeFile("./compare_list/englishEd.json", JSON.stringify(new_englishEd, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("englishEd.json written successfully");
    });

    const new_chem = await crawlChem("url");
    fs.writeFile("./compare_list/chem.json", JSON.stringify(new_chem, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("chem.json written successfully");
    });

    const new_lifeScience = await crawlLifeScience("url");
    fs.writeFile("./compare_list/lifeScience.json", JSON.stringify(new_lifeScience, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("lifeScience.json written successfully");
    });

    const new_japanese = await crawlJapanese("url");
    fs.writeFile("./compare_list/japanese.json", JSON.stringify(new_japanese, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("japanese.json written successfully");
    });

    const new_chinese = await crawlChinese("url");
    fs.writeFile("./compare_list/chinese.json", JSON.stringify(new_chinese, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("chinese.json written successfully");
    });

    const new_math = await crawlMath("url");
    fs.writeFile("./compare_list/math.json", JSON.stringify(new_math, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("math.json written successfully");
    });

    const new_ai = await crawlAi("url");
    fs.writeFile("./compare_list/ai.json", JSON.stringify(new_ai, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("ai.json written successfully");
    });

    const new_chemEngineering = await crawlChemEngineering("url");
    fs.writeFile("./compare_list/chemEngineering.json", JSON.stringify(new_chemEngineering, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("chemEngineering.json written successfully");
    });

    const new_logistics = await crawlLogistics("url");
    fs.writeFile("./compare_list/logistics.json", JSON.stringify(new_logistics, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("logistics.json written successfully");
    });

    const new_econ = await crawlEcon("url");
    fs.writeFile("./compare_list/econ.json", JSON.stringify(new_econ, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("econ.json written successfully");
    });

    const new_physics = await crawlPhysics("url");
    fs.writeFile("./compare_list/physics.json", JSON.stringify(new_physics, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("physics.json written successfully");
    });

    const new_libInfoScience = await crawlLibInfoScience("url");
    fs.writeFile("./compare_list/libInfoScience.json", JSON.stringify(new_libInfoScience, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("libInfoScience.json written successfully");
    });

    const new_mediaComm = await crawlMediaComm("url");
    fs.writeFile("./compare_list/mediaComm.json", JSON.stringify(new_mediaComm, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("mediaComm.json written successfully");
    });

    const new_sociology = await crawlSociology("url");
    fs.writeFile("./compare_list/sociology.json", JSON.stringify(new_sociology, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("sociology.json written successfully");
    });

    const new_socialWelfare = await crawlSocialWelfare("url");
    fs.writeFile("./compare_list/socialWelfare.json", JSON.stringify(new_socialWelfare, null, 4), "utf8", (err) => {
        if (err) console.log(err);
        else console.log("socialWelfare.json written successfully");
    });
}
// updateFiles();

// const new_industSec = await crawlIndustSec("url"); // 이 반환값에 .title 또는 .url을 이용해 값에 접근할 수 있음
// fs.writeFileSync("industSec.json", JSON.stringify(new_industSec), "utf8");
// console.log(new_industSec);
// console.log(JSON.stringify(new_industSec));
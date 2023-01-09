import fs from "fs";
import { compareTwoArrays } from "./compare.js"
import path from 'path';
import { fileURLToPath } from 'url';
import crawlEnglish from "./crawlers/url_scraper_English.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const new_english = await crawlEnglish("url");
console.log("english loaded");
let storeDifferences = [];
function readFileAndCompareWithOriginal(majorName,dataObject){
    const rawData = fs.readFileSync(path.join(__dirname, 'compare_list', `${majorName}.json`),"utf8")
    const oldContent = JSON.parse(rawData);
    // console.log(`${majorName}:`);
    // console.log(oldContent);
    return compareTwoArrays(dataObject.url, oldContent.url);
}

storeDifferences.english = readFileAndCompareWithOriginal("english",new_english);
console.log(storeDifferences.english[0]);

if(storeDifferences.english != undefined && storeDifferences.english != 0){
    let englishObject = {
        url: new_english.url,
        title: new_english.title
    };
    // englishObject = englishObject.push(new_english.url);
    // console.log(`before : ${englishObject}`);
    // englishObject = englishObject.push(new_english.title);
    // console.log(`after : ${englishObject}`);
    console.log(englishObject);
    // fs.writeFile(path.join(__dirname, 'compare_list', 'english.json'), JSON.stringify(englishObject), (err) => {
    //     if(err){console.log(err);}
    //     else {console.log("english updated successfully");}});
}
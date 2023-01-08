// AUTO GENERATOR
const Major = [];
const major = [
    "industSec",
    "software",
    "CAUnotice",
    "integEngineering",
    "korean",
    "mechEngineering",
    "psychology",
    "business",
    "elecEngineering",
    "english",
    "enerEngineering"
];
const len = major.length;
for(let i=0;i<len;i++){
    Major[i] = major[i].charAt(0).toUpperCase() + major[i].slice(1);
}

for(let i=0;i<len;i++){
    console.log(`if(storeDifferences.${major[i]} != undefined && storeDifferences.${major[i]} != 0){
    let ${major[i]}Object = new_${major[i]}.url;
    ${major[i]}Object = ${major[i]}Object.push(new_${major[i]}.title);
    fs.writeFile(path.join(__dirname, 'compare_list', '${major[i]}.json'), JSON.stringify(${major[i]}Object), (err) => {
            if(err){console.log(err);}
            else {console.log("File updated successfully");}});
    }`);
}
// for(let i=0;i<len;i++){
//     console.log(`if(storeDifferences.${major[i]} != undefined && storeDifferences.${major[i]} != 0){
//     let ${major[i]}Object = new_${major[i]}.url;
//     ${major[i]}Object = ${major[i]}Object.push(new_${major[i]}.title);
//     fs.writeFile(path.join(__dirname, 'compare_list', '${major[i]}.json'), JSON.stringify(${major[i]}Object), (err) => {
//             if(err){console.log(err);}
//             else {console.log("File updated successfully");}});
//     }`);
// }
// for(let i=0;i<len;i++){
//     console.log(`if(requestBody.${major[i]} != "true" && requestBody.${major[i]} != "false") return res.end("wrong ${major[i]}");`
//     );
// }
// for(let i=0;i<len;i++){
//     console.log(`const new_${major[i]} = await crawl${Major[i]}("url");
//     fs.writeFile("./compare_list/${major[i]}.json", JSON.stringify(new_${major[i]}), "utf8", (err) => {
//         if(err) console.log(err);
//         else console.log("${major[i]}.json written successfully\\n");
//     });`
//     );
// }
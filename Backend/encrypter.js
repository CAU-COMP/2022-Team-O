import { ShortCrypt } from "short-crypt";

const key = "caunotify";
// const input = "this is a secret message"

export function encryptIntToString(data){
    const sc = new ShortCrypt(key);
    const str = data.toString();
    return sc.encryptToURLComponent(str);
}

export function decryptStringToInt(data){
    const sc = new ShortCrypt(key);
    // console.log(`data : ${data}`);
    const dec = sc.decryptURLComponent(data);
    // console.log(`dec : ${dec}`);
    const len = dec.length;
    let result = "";
    for(let i=0;i<len;i++){
        result += String.fromCharCode(dec[i]);
    }
    return result;
}
// 과정: 입력값 -> 배열화 -> 루프(각각의 문자 ascii값 더함)

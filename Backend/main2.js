import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
/*while(1){
    let len = __dirname.length;
    let lastChar = len-1;
    if(__dirname[lastChar] != "\\"){
        __dirname = __dirname.slice(0,lastChar);
    }
    else{
        __dirname = __dirname.slice(0,lastChar);
        break;
    }
}*/
console.log(__dirname);



export function compareTwoArrays(newArray, originalArray){ // 실제 사용시 len은 newArray.length로 대체
    let found = 0;
    let diff = [];
    const len = newArray.length;
    for(let i = 0; i < len; i++){
        for(let j = 0; j < len; j++){
            if(newArray[i] == originalArray[j]){
                found=1;
                break;
                // console.log(`${originalArray[i]} and ${newArray[j]} are the same`);
            }
        }
        if(found == 1) found = 0;
        else if(found == 0){
            diff.push(i);
        }
    }
    // 사실 새 공지라 해도 시간 순서대로 sort 되어 있을 것이기 때문에 이렇게 전수조사를 할 필요는 없는데,
    // 코드의 간결함을 위해 일단은 이렇게 유지할 것.
    return diff; // 변경된 값의 개수 // new 기준의 번호임
} // 정상 작동 확인
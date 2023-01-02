let originalArray = ['a','b','c','d','e'];
let newArray = ['c','d','e','f','g'];
const len = newArray.length;
let found = 0;

for(let i = 0; i < len; i++){
    for(let j = 0; j < len; j++){
        if(originalArray[i] == newArray[j]){
            found++;
            console.log(`${originalArray[i]} and ${newArray[j]} are the same`);
        }
    }
}
// 사실 새 공지라 해도 시간 순서대로 sort 되어 있을 것이기 때문에 이렇게 전수조사를 할 필요는 없는데,
// 코드의 간결함을 위해 일단은 이렇게 유지할 것.

console.log(`number of new notices: ${len - found}`); // 같은 개수
found = 0; // 다음 시행을 위해 초기화



// 해당 반복문은 새 공지 리스트 중에서, 이전 공지 리스트에 없었던 것을 추리는 방법이므로
// 기존에 있었다가 사라진 공지는 발견할 수 없음.
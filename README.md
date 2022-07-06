# node-excel-stream-sample
- 챗봇 백오피스의 이용내역 통계 데이터를 엑셀로 내려받는 기능 개선
- 운영기간이 길어짐에 따라 데이터량이 늘어 엑셀 다운로드시 Out of Memory 발생
- 이를 회피하기 위해 node-excel-stream 모듈을 사용하여 기능 개선

## 1. node-excel-stream 모듈 사용

```
const { ExcelWriter } = require("node-excel-stream");
const writer = new ExcelWriter({
    sheets: [{
        name: 'Test Sheet',
        key: 'test_sheet',
        headers: [{
            name: 'number',
            key: 'no'
        }, {
            name: 'date',
            key: 'regDateTime',
            default: 0
        },
        ...
    }]
});
```

## 2. 로그 데이터를 10000건씩 나누어 가져와 ExcelWriter 객체에 add
```
while (hits && hits.hits.length) {
    allRecords = [...hits.hits]
    ...
    await addData.write(writer, allRecords); // cell에 데이터 저장
    temp_Arr = await esService.scroll('1m', search_result._scroll_id); // 로그 데이터를 DB에서 10000건씩 가져온다.
    hits = temp_Arr.hits;
}

-- addData.js
write : async (writer, inputs) => {
    await inputs.map((input) => {
      input = input._source;
      writer.addData('test_sheet', input);
    });
}

```

## 3. 파일로 쓰기 
```
const writeStream = fs.createWriteStream('...path');
let stream = await writer.save(); // 객채에 데이터를 저장하게되면 stream을 반환한다.
stream.pipe(writeStream); // path에 파일 write.
```

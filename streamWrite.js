const esService = require('./elasticsearch.service');
const addData = require('./addData');
const fs = require("fs");
const { ExcelWriter } = require("node-excel-stream");
const writeStream = fs.createWriteStream('/Users/ihong-gyu/Downloads/data.xlsx');
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
        }, {
            name: 'msg',
            key: 'message',
            default : ''
        }]
    }]
});

let streamWrite = async () => {
    let queryObj = {
        index : 'eminwon_2018',
        type  : 'doc',
        body  : {
            "size"    : 10000,
            "query"   : {
                "bool" : {
                    "must" : [{
                        "match_all" : {}
                    }]
                }
            }
        }
    }

    let allRecords = [];
    let search_result = await esService.search(queryObj.index, queryObj.type, queryObj.body, '1m');
    let hits = search_result.hits;
    let temp_Arr = [];

    let len = 0;
    while (hits && hits.hits.length) {
        allRecords = [...hits.hits]
        console.log(`Set binzo ,,, ${len} of ${hits.total}`)
        len += allRecords.length;

        await addData.write(writer, allRecords);
        temp_Arr = await esService.scroll('1m', search_result._scroll_id);
        hits = temp_Arr.hits;
    }

    let stream = await writer.save();
    stream.pipe(writeStream);
}

streamWrite();

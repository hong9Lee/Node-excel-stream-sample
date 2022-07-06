module.exports = {
    write : async (writer, inputs) => {
        await inputs.map((input) => {
            input = input._source;
            writer.addData('test_sheet', input);
        });
    }
}

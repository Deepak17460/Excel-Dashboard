const xlsx = require('xlsx');

function excelToJson(filePath, file) {
    
    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    return jsonData;
}

module.exports = excelToJson
const xlsx = require("xlsx");

function excelToJson(filePath, file) {
  const workbook = xlsx.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(worksheet, {
    raw: false, // Ensure raw values are processed with formatting
    defval: "", 
    cellDates: true, // Enable date parsing
  });

  return jsonData;
}

function jsonToExcel(filePath, data) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const newWorksheet = xlsx.utils.json_to_sheet(data);
  workbook.Sheets[sheetName] = newWorksheet;
  xlsx.writeFile(workbook, filePath);
}

module.exports = { excelToJson, jsonToExcel };

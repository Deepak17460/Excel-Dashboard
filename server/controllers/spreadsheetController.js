const path = require("path");
const excelToJson = require("../utils/excelToJson");
const getFiles = require("../services/getAllFiles.service");

const getFileDetails = async (req, res) => {
  const file = "../public/temp/" + req.query.fname;

  const _path = path.join(__dirname, file);
  const jsonData = excelToJson(_path, file);
  res.json(jsonData);
};

const getAllFileNames = async (req, res) => {
  const ans = await getFiles();
  res.json(ans);
};

module.exports = { getFileDetails, getAllFileNames };

const path = require("path");
const { excelToJson, jsonToExcel } = require("../utils/excelToJson");
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

const editFileDetails = async (req, res) => {
  const file = "../public/temp/" + req.query.fname;

  const _path = path.join(__dirname, file);
  const jsonData = excelToJson(_path, file);
  if (jsonData.length > 0) {
    jsonData[0].Name = "Wireless Earphones";
  }
  jsonToExcel(_path, jsonData);
  res.send("Edit success!")
};

module.exports = { getFileDetails, getAllFileNames, editFileDetails };

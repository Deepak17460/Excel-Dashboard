const path = require("path");
const { excelToJson, jsonToExcel } = require("../utils/excelToJson");
// const getFiles = require("../services/getAllFiles.service");
const { UserToFiles } = require("../models");
const fs = require("fs");
const createError = require("../utils/errors");

const getFileDetails = async (req, res, next) => {
  try {
    const recordId = req.params.id;
    const filename = (await UserToFiles.findByPk(recordId)).filename;
    // TODO save stack trace
    // if (!fileRecord) return next(createError(404, "File not found"));
    const file = "../public/temp/" + filename;

    const _path = path.join(__dirname, file);
    const jsonData = excelToJson(_path, file);
    res.json(jsonData);
  } catch (error) {
    next(error);
  }
};

const getAllFileNames = async (req, res) => {
  const userId = req.user.id;
  const ans = await UserToFiles.findAll({ where: { userId } });
  res.json(ans);
};

const uploadFile = async (req, res, next) => {
  try {
    await UserToFiles.create({
      userId: req.user.id,
      filename: req.file.filename,
    });
    res
      .status(201)
      .json("File: " + req.file.filename + " uploaded successfuly!");
  } catch (error) {
    next(error);
  }
};

const editFileDetails = async (req, res) => {
  const recordId = req.params.id;
  const filename = (await UserToFiles.findByPk(recordId)).filename;
  
  const file = "../public/temp/" + filename;

  const _path = path.join(__dirname, file);
  const jsonData = req.body.data;
  // const jsonData = excelToJson(_path, file);
  // if (jsonData.length > 0) {
  //   jsonData[0].Name = "Wireless Earphones";
  // }
  jsonToExcel(_path, jsonData);
  res.send("Edit success!");
};

const deleteFile = async (req, res) => {
  try {
    const recordId = req.params.id;
    const fileName = (await UserToFiles.findByPk(recordId)).filename;

    if (!fileName) {
      return res.status(400).send("File name is required");
    }

    const filePath = path.join(__dirname, "../public/temp/", fileName);
    await UserToFiles.destroy({ where: { id:recordId } });

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).send("Error deleting file");
        }
        res.send("File deleted successfully");
      });
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getFileDetails,
  getAllFileNames,
  uploadFile,
  editFileDetails,
  deleteFile,
};

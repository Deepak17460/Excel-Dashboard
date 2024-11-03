const path = require("path");
const {
  excelToJson,
  jsonToExcel,
  jsonToExcelCreate,
} = require("../utils/excelToJson");
// const getFiles = require("../services/getAllFiles.service");
const { UserToFiles } = require("../models");
const fs = require("fs");
const createError = require("../utils/errors");
const formatDate = require("../utils/dateFormat");

const getFileDetails = async (req, res, next) => {
  try {
    const recordId = req.params.id;
    const fileRecord = await UserToFiles.findByPk(recordId);

    if (!fileRecord) return next(createError(404, "File not found"));

    const filename = fileRecord.filename;
    const userId = fileRecord.userId;
    console.log(req.user.id, userId);
    if (req.user.id !== userId)
      return next(createError(403, "You don't have the required permission"));

    const file = "../public/temp/" + filename;

    const _path = path.join(__dirname, file);
    const jsonData = excelToJson(_path, file);
    res.status(200).json(jsonData);
  } catch (error) {
    next(error);
  }
};

const getAllFileNames = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ans = await UserToFiles.findAll({ where: { userId } });
    res.json(ans);
  } catch (error) {
    next(error);
  }
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

const editFileDetails = async (req, res, next) => {
  try {
    const recordId = req.params.id;
    const fileRecord = await UserToFiles.findByPk(recordId);

    if (!fileRecord) return next(createError(404, "File not found"));
    const filename = fileRecord.filename;

    const file = "../public/temp/" + filename;

    const _path = path.join(__dirname, file);
    const jsonData = req.body.data;

    jsonToExcel(_path, jsonData);
    res.send("Edit success!");
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const recordId = req.params.id;
    const fileRecord = await UserToFiles.findByPk(recordId);

    if (!fileRecord) return next(createError(404, "File not found"));
    const fileName = fileRecord.filename;

    if (!fileName) {
      return res.status(400).send("File name is required");
    }

    const filePath = path.join(__dirname, "../public/temp/", fileName);
    await UserToFiles.destroy({ where: { id: recordId } });

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
    next(error);
  }
};

const convertToJson = async (req, res, next) => {
  try {
    const recordId = req.params.id;
    const fileRecord = await UserToFiles.findByPk(recordId);

    if (!fileRecord) return next(createError(404, "File not found"));
    const filename = fileRecord.filename;

    const _path = path.join(__dirname, "../public/temp/" + filename);

    res.status(200).json(excelToJson(_path, ""));
  } catch (error) {
    next(error);
  }
};

const createExcelFile = async (req, res, next) => {
  try {
    const obj = req.body.data;
    const fileName =
      formatDate(new Date()) + "_" + obj.filename + "." + obj.filetype;
    const file = "../public/temp/" + fileName;
    // console.log(obj.filename, obj.filedata);
    const _path = path.join(__dirname, file);
    jsonToExcelCreate(_path, obj.filedata);
    await UserToFiles.create({
      userId: req.user.id,
      filename: fileName,
    });
    res.send("Created success!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFileDetails,
  getAllFileNames,
  uploadFile,
  editFileDetails,
  deleteFile,
  convertToJson,
  createExcelFile,
};

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

    const transformedData = ans.map((file) => ({
      ...file.dataValues,
      filename: file.dataValues.filename.slice(21),
    }));

    res.json(transformedData);
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

    console.log("Yes edit workin");
    const file = "../public/temp/" + filename;

    const _path = path.join(__dirname, file);
    const jsonData = req.body.data;

    jsonToExcel(_path, jsonData);
    _time = new Date();
    fileRecord.updatedAt = _time;
    fileRecord.changed("updatedAt", true);
    await fileRecord.save();

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

const updateFileName = async (req, res, next) => {
  try {
    const { id } = req.params; // Record ID to update
    const { filename, filetype } = req.body; // New file name from the request
    const newFileName =
      formatDate(new Date()) + "_" + filename + "." + filetype;

    if (!newFileName) {
      return res.status(400).json({ error: "New file name is required." });
    }

    // Find the record in the database
    const fileRecord = await UserToFiles.findByPk(id);

    if (!fileRecord) {
      return res.status(404).json({ error: "File record not found." });
    }

    const oldFileName = fileRecord.filename;
    const oldFilePath = path.join(__dirname, "../public/temp/", oldFileName);
    const newFilePath = path.join(__dirname, "../public/temp/", newFileName);

    // Rename the file on the server
    if (fs.existsSync(oldFilePath)) {
      fs.renameSync(oldFilePath, newFilePath);
    } else {
      return res
        .status(404)
        .json({ error: `File "${oldFileName}" not found on the server.` });
    }

    // Update the record in the database
    fileRecord.filename = newFileName;
    _time = new Date();
    fileRecord.updatedAt = _time;
    fileRecord.changed("updatedAt", true);
    await fileRecord.save();

    res.json({ message: "File name updated successfully." });
  } catch (error) {
    next(error); // Pass error to the error handler
  }
};

const downloadFile = async (req, res, next) => {
  console.log("download file controller");
  console.log(req.params);
  const recordId = req.params.id;
  const fileRecord = await UserToFiles.findByPk(recordId);

  if (!fileRecord) return next(createError(404, "File not found"));

  const filename = fileRecord.filename;
  const userId = fileRecord.userId;

  if (req.user.id !== userId)
    return next(createError(403, "You don't have the required permission"));
  console.log(__dirname);
  const _path = path.join(__dirname, "../public/temp/", filename);
  console.log(_path);
  // Validate if file exists
  res.status(200).download(_path, filename);
};

const getMatchingFileNames = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const searchKey = req.query.key;
    const ans = await UserToFiles.findAll({ where: { userId } });

    const transformedData = ans
      .filter((file) => file.dataValues.filename.includes(searchKey))
      .map((file) => ({
        id: file.dataValues.id,
        filename: file.dataValues.filename.slice(21),
      }));

    res.json(transformedData);
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
  updateFileName,
  downloadFile,
  getMatchingFileNames,
};

const express = require("express");
const router = express.Router();
const upload = require("../services/fileUpload.service");
const {
  getFileDetails,
  getAllFileNames,
  editFileDetails,
  deleteFile,
  uploadFile,
  convertToJson,
} = require("../controllers/spreadsheetController");
const { verifyUser } = require("../utils/verifyToken");

router.get("/", verifyUser, getAllFileNames);

router.get("/:id", verifyUser, getFileDetails);

router.post("/", verifyUser, upload.single("file"), uploadFile);

router.put("/:id", verifyUser, editFileDetails);

router.delete("/:id",verifyUser, deleteFile);

module.exports = router;

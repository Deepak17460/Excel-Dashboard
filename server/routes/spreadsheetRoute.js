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
  createExcelFile,
  updateFileName,
  downloadFile,
  getMatchingFileNames,
} = require("../controllers/spreadsheetController");
const { verifyUser } = require("../utils/verifyToken");

router.get("/", verifyUser, getAllFileNames);
router.post("/", verifyUser, upload.single("file"), uploadFile);

router.get("/:id", verifyUser, getFileDetails);
router.put("/:id", verifyUser, editFileDetails);
router.delete("/:id",verifyUser, deleteFile);

router.put('/:id/update-name', verifyUser, updateFileName);

router.get('/download/:id', verifyUser, downloadFile);

router.post('/create-file', verifyUser, createExcelFile);

module.exports = router;

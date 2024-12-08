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
} = require("../controllers/spreadsheetController");
const { verifyUser } = require("../utils/verifyToken");

router.get("/", verifyUser, getAllFileNames);

router.get("/:id", verifyUser, getFileDetails);
// router.get("/:id", getFileDetails);
router.get('/download/:id', verifyUser, downloadFile);
router.post("/", verifyUser, upload.single("file"), uploadFile);
router.post('/create-file', verifyUser, createExcelFile);
router.put("/:id", verifyUser, editFileDetails);
router.put('/:id/update-name', updateFileName);
router.delete("/:id",verifyUser, deleteFile);

module.exports = router;

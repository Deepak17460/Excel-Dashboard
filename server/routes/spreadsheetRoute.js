const express = require("express");
const router = express.Router();
const upload = require("../services/fileUpload.service");
const {
  getFileDetails,
  getAllFileNames,
  editFileDetails,
  deleteFile,
} = require("../controllers/spreadsheetController");

router.get("/", getAllFileNames);

router.get("/:id", getFileDetails);

router.post("/", upload.single("file"), (req, res) => {
  res.send("File uploaded" + req.file.filename);
});

router.put("/:id", editFileDetails);

router.delete("/:id", deleteFile);

module.exports = router;

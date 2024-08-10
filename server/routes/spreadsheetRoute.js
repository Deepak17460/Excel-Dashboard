const express = require("express");
const router = express.Router();
const upload = require("../services/fileUpload.service");
const {
  getFileDetails,
  getAllFileNames,
  editFileDetails,
} = require("../controllers/spreadsheetController");

router.get("/", getAllFileNames);

router.get("/:id", getFileDetails);

router.post("/", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});

router.put("/:id", editFileDetails);

router.delete("/:id", (req, res) => {});

module.exports = router;

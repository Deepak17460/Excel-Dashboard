const express = require("express");
const router = express.Router();
const upload = require("../services/fileUpload.service");
const {
  getFileDetails,
  getAllFileNames,
} = require("../controllers/spreadsheetController");

router.get("/", getAllFileNames);

router.get("/:id", getFileDetails);

router.post("/", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

module.exports = router;

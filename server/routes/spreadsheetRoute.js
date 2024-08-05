const express = require("express");
const router = express.Router();
const upload = require("../services/fileUpload.service");

router.get("/filename", (req, res) => {});

router.get("/", (req, res) => {});

router.post("/", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

module.exports = router;

const express = require("express");
const router = express.Router();
const { verifyUser } = require("../utils/verifyToken");
const { getMatchingFileNames } = require("../controllers/spreadsheetController");

router.get("/search", verifyUser, getMatchingFileNames);

module.exports = router;

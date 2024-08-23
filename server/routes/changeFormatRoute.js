const express = require("express");
const { convertToJson } = require("../controllers/spreadsheetController");
const { verifyUser } = require("../utils/verifyToken");
const router = express.Router();

router.get("/:id", verifyUser, convertToJson);

module.exports = router;
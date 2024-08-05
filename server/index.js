const express = require("express");
const cors = require("cors");
const spreadsheetRoute = require('./routes/spreadsheetRoute');
require("dotenv").config();
const fileValidator = require("./middlewares/fileValidation");

//Initilize dir to upload file


const app = express();

//Global middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use("/api/spreadsheet", spreadsheetRoute);

app.use(fileValidator);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server running on port " + port);
});

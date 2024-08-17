const express = require("express");
const cors = require("cors");
const spreadsheetRoute = require('./routes/spreadsheetRoute');
const userRoute = require('./routes/userRoute');
require("dotenv").config();
const fileValidator = require("./middlewares/fileValidation");
const dirInit = require("./utils/dirInit");

//Initilize dir to upload file

dirInit();
const app = express();

//Global middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use("/api/users", userRoute);
app.use("/api/spreadsheet", spreadsheetRoute);


// Multer file validation middleware
app.use(fileValidator);

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log("Server running on port " + port);
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const spreadsheetRoute = require("./routes/spreadsheetRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const utilRoute = require("./routes/utilRoute");
const changeFormatRoute = require("./routes/changeFormatRoute");
require("dotenv").config();
const fileValidator = require("./middlewares/fileValidation");
const dirInit = require("./utils/dirInit");

//Initilize dir to upload file

dirInit();
const app = express();

//Global middlewares
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use("/api/users", userRoute);
app.use("/api/spreadsheet", spreadsheetRoute);
app.use("/api", authRoute);
app.use("/api/format", changeFormatRoute);
app.use("/api/util", utilRoute);

//Global Error Handler
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMsg = err.message || "Something went wrong";
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: err.stack,
  });
});

// Multer file validation middleware
app.use(fileValidator);

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log("Server running on port " + port);
});

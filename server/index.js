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

// Initialize directory to upload files
dirInit();

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://99.81.128.143:8000", // For local development
  "http://172.27.0.1:8000", // Frontend container in Docker
  "http://172.27.0.1:80", // Production domain
  "http://99.81.128.143:8082"
];

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Global middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/spreadsheet", spreadsheetRoute);
app.use("/api", authRoute);
app.use("/api/format", changeFormatRoute);
app.use("/api/util", utilRoute);

// Multer file validation middleware
app.use(fileValidator);

// Global error handler
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

// Set the port and host
const port = process.env.SERVER_PORT || 8082;
const host = "0.0.0.0"; // Listen on all network interfaces

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});

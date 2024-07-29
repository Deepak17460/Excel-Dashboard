const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Global middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server running on port " + port);
});

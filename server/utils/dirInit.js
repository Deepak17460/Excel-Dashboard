const fs = require("fs");
const path = require('path');

const dir = path.resolve(__dirname, '../public/temp');
console.log(dir);
const dirInit = () => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = dirInit

const fs = require("fs");
const path = require("path");

const folderPath = path.resolve(__dirname, "../public/temp");

const getFiles = () => {

  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        return reject("Error reading directory: " + err);
      }

      // Filter out directories and only get file names
      let fileNames = files.filter((file) => {
        return fs.statSync(path.join(folderPath, file)).isFile();
      });
      fileNames = fileNames.map((file) => {
        return file.slice(file.lastIndexOf("_") + 1, -5);
      });
      resolve(fileNames);
    });
  });
};

module.exports = getFiles;

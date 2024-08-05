const fs = require("fs");

const dirInit = () => {
  const dir = "./public/temp";
  try{
    fs.existsSync(dir)
  }
  catch(e){
    fs.mkdirSync(dir);
  }
//   if (!) {
//   }
};

module.exports = dirInit

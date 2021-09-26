const fs = require('fs');
const path = require('path');

function organizeFn(dirPath) {
  let destPath;
  if (dirPath === undefined) {
    destPath = process.cwd();
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
      destPath = path.join(dirPath, 'organized_files');
      if (fs.existsSync(destPath) === false) {
        fs.mkdirSync(destPath);
      }
    } else {
      console.log('Kindly enter the correct path');
      return;
    }
  }
  organizeHelper(dirPath, destPath);
}

function organizeHelper(src, dest) {
  let childNames = fs.readdirSync(src);
  //   console.log(childNames);
  for (let i = 0; i < childNames.length; i++) {
    let childAddress = path.join(src, childNames[i]);
    let isFile = fs.lstatSync(childAddress).isFile();
    if (isFile) {
      //   console.log(childNames[i]);
      let category = getCategory(childNames[i]);
      //   console.log(category);
      sendFiles(childAddress, dest, category);
    }
  }
}

function getCategory(name) {
  let ext = path.extname(name);
  //   console.log(ext);
  ext = ext.slice(1);
  for (let type in types) {
    let currentTypeArray = types[type];
    for (let i = 0; i < currentTypeArray.length; i++) {
      if (ext === currentTypeArray[i]) {
        return type;
      }
    }
  }
  return 'others';
}

function sendFiles(srcFilePath, dest, category) {
  let categoryPath = path.join(dest, category);
  if (fs.existsSync(categoryPath) === false) {
    fs.mkdirSync(categoryPath);
  }
  let fileName = path.basename(srcFilePath);
  let destFilePath = path.join(categoryPath, fileName);
  fs.copyFileSync(srcFilePath, destFilePath);
  //   fs.unlinkSync(srcFilePath); // removes original file
  console.log(fileName, ' copied to ', category);
}

module.exports = {
  organizeKey: organizeFn,
};

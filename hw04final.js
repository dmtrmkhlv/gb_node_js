const fs = require("fs");
const {
    Transform
} = require('stream');
const colors = require("colors/safe");
const path = require("path");
const readline = require("readline");
const inquirer = require("inquirer");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

let startDir = "";
let currentPath = "";
let strToFind = "89.123.1.41"

const findStr = (str, filterStr) => {
    let arrOfStr = str.toString().split("\n");
    return arrOfStr.filter(function (s) {
        return s.match(filterStr);
    }).join("\n");
}

const createStream = (filterStr, readStream) => {
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            let transformedChunk = findStr(chunk, filterStr);
            callback(null, transformedChunk);
        }
    });
    readStream.pipe(transformStream).pipe(process.stdout);
}

const checkIsFile = (dirInput) => {

    const list = fs.readdirSync(dirInput);

    inquirer
        .prompt([{
            name: "fileName",
            type: "list",
            message: colors.green("Выберите файл:"),
            choices: list,
        }])
        .then((answer) => {
            const filePath = path.join(startDir, path.join(currentPath, answer.fileName));
            currentPath = path.join(currentPath, answer.fileName);
            if (isFile(filePath)) {
                const readStream = new fs.ReadStream(filePath, 'utf8');
                createStream(strToFind, readStream);
            } else {
                checkIsFile(filePath);
            }
        });
}

rl.question(colors.green("Напишите директорию: "), function (inputedPath) {
    startDir = inputedPath;
    checkIsFile(inputedPath);
});
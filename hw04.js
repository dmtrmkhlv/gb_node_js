const fs = require("fs");
const {Transform} = require('stream');
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

const findStr = (str, filterStr) => {
    let arrOfStr = str.toString().split("\n");
    return arrOfStr.filter(function (s) {
        return s.match(filterStr);
    }).join("\n");
}

const createStream = (readStream, filterStr) => {
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const transformedChunk = findStr(chunk, filterStr);
            callback(null, transformedChunk);
        }
    });
    readStream.pipe(transformStream).pipe(process.stdout);
}

const checkIsFile = (dirInput) => {
    console.log(dirInput);
    // const list = fs.readdirSync(dirInput).map((arg) => {
    //     if (isFile(arg)) {
    //         return arg;
    //     } else {
    //         return arg;
    //     }
    // });

    const list = fs.readdirSync(dirInput).filter(isFile);

    inquirer
        .prompt([{
            name: "fileName",
            type: "list",
            message: "Выберите файл:",
            choices: list,
        }])
        .then((answer) => {
            if (isFile(answer.fileName)) {
                console.log("is file");
                const readStream = new fs.ReadStream(answer.fileName, 'utf8');
                createStream(readStream, "89.123.1.41");
                rl.close();
            } else {
                const filePath = path.join("./", answer.fileName);
                // checkIsFile(filePath);
                console.log(filePath);
                // checkIsFile(answer.fileName);
                // console.log("is dir");
            }
        });
}

rl.question(colors.red("Напишите директорию: "), function (inputedPath) {
    checkIsFile(inputedPath);
});
rl.on("close", function () {
    process.exit(0);
});
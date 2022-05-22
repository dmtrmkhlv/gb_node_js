const fs = require("fs");
const colors = require("colors/safe");
const yargs = require("yargs");
const path = require("path");

const options = yargs
    .usage("Usage: -p <path>")
    .option("p", {
        alias: "path",
        describe: "Path to file",
        type: "string",
        demandOption: true
    })
    .argv;

const filePath = path.join(__dirname, options.path);

fs.readFile(filePath, 'utf8', (err, data) => {
    console.log(colors.cyan(data));
});
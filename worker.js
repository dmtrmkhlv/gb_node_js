const {workerData, parentPort} = require('worker_threads');
const fs = require('fs');
const {Transform} = require('stream');

const findStr = (str, filterStr) => {
    let arrOfStr = str.toString().split("\n");
    return arrOfStr.filter(function (s) {
        return s.match(filterStr);
    }).join("\n");
}

const createLogFile = (fileName, data) => {
    const writeStream = fs.createWriteStream(`./${fileName}_requests.log`, {
        flags: 'a',
        encoding: 'utf8'
    });
    writeStream.write(data);
    writeStream.end(() => {
        parentPort.postMessage({
            result: `'File writing with ip:${workerData} finished`
        });
    });
    
}

const readStream = new fs.ReadStream('./access.log', 'utf8');

const createStream = (ip)=>{
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const transformedChunk = findStr(chunk, ip);
            callback(null, transformedChunk);
            createLogFile(ip, transformedChunk);
        }
    });
    readStream.pipe(transformStream).pipe(process.stdout);
}

createStream(workerData);
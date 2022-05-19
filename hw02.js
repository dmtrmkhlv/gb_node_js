// 1 5 6 2 3 4 

const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

const getDate = (payload) => {
    let date;
    if (payload) {
        let payloadArr = payload.split("-");
        date = new Date(payloadArr[3], payloadArr[2] - 1, payloadArr[1], payloadArr[0]);
    } else {
        date = new Date();
    }
    return date;
}

const checkDate = (payload) => {
    let date = getDate();
    let payloadDate = getDate(payload);
    if (payloadDate - date > 0) {
        return true;
    } else if (payloadDate - date == 0) {
        return false;
    }
}

class Handler {
    static start(payload) {
        let date = getDate();
        let payloadDate = getDate(payload);
        let diff = payloadDate - date;
        let year = Math.floor(diff / 31536000000);
        diff = diff - year * 31536000000;
        let day = Math.floor(diff / 86400000);
        diff = diff - day * 86400000;
        let hour = Math.floor(diff / 3600000);
        diff = diff - hour * 3600000;
        let min = Math.floor(diff / 60000);
        diff = diff - min * 60000;
        let sec = Math.floor(diff / 1000);
        console.log(`Осталось ${sec} сек., ${min} мин., ${hour} час., ${day} дн., ${year} г.`);
    }
    static stop() {
        console.log('Таймер завершен');
    }
}

eventEmitter.on("start", Handler.start);
eventEmitter.on("stop", Handler.stop);

let i = 2
setInterval(() => {
    do {
        if (process.argv[i] == undefined) {
            i = 2;
        }
        if (checkDate(process.argv[i])) {
            eventEmitter.emit("start", process.argv[i]);
        } else {
            eventEmitter.emit("stop", process.argv[i]);
        }
        i++;
    } while (process.argv[i]);
    console.log("\n");
}, 1000);
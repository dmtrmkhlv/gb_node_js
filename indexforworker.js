const {Worker} = require('worker_threads')
const ips = ["89.123.1.41", "34.48.240.111"];

function start(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {
            workerData
        });
        worker.on('message', resolve);
        worker.on('error', reject);
    })
}
ips.forEach(ip => {
    start(ip)
        .then(result => console.log(result))
        .catch(err => console.error(err));
});
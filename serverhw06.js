const http = require('http');
const fs = require('fs');
const path = require('path');
const io = require('socket.io');
const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');
        readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
    } else if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
            response.writeHead(200, {
                'Content-Type': 'json'
            });
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});

const socket = io(app);
let clientCount = 0;
socket.on('connection', function (socket) {
    console.log('New connection', socket.id);
    clientCount++;
    socket.on('CLIENT_MSG', (data) => {
        socket.broadcast.emit('NEW_CONN_EVENT', {
            login: data.login,
            msg: data.msg
        });
        socket.emit('SERVER_MSG', {
            login: data.login,
            msg: data.msg
        });
    });
    socket.on('disconnect', function () {
        clientCount--;
        socket.broadcast.emit('CLIENT_COUNT', {
            count: clientCount
        })
        socket.broadcast.emit('SERVER_MSG', {
            msg: "CLIENT DISCONNECT"
        });
    });
    socket.on('reconnect', function () {
        socket.broadcast.emit('SERVER_MSG', {
            msg: "CLIENT RECONNECT"
        });
    });
});

socket.on('connect', function (socket) {
    socket.on('NEW_CLIENT_CONNECT', (data) => {
        socket.broadcast.emit('NEW_CONN_EVENT', {
            login: data.login,
            msg: data.msg
        });
        socket.broadcast.emit('CLIENT_COUNT', {
            count: clientCount
        });
        socket.emit('CLIENT_COUNT', {
            count: clientCount
        });
    });
});

app.listen(3000, 'localhost');
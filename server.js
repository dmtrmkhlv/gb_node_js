const http = require('http');
const fs = require('fs');
const path = require('path');

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

http.createServer((request, response) => {
    let filePath = path.join(__dirname, request.url);

    if (request.method === 'GET' && fs.existsSync(filePath)) {

        if (isFile(filePath) && request.url != "/index.html") {
            readStream = fs.createReadStream(filePath);
            if (["txt", "log", "html"].indexOf(filePath.split('.').pop()) + 1) {
                response.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                });
            }
            if (["ico", "jpg"].indexOf(filePath.split('.').pop()) + 1) {
                response.writeHead(200, {
                    'Content-Type': 'image/jpeg'
                });
            }
            readStream.pipe(response);
        } else {
            if (request.url == "/index.html") {
                filePath = filePath.split("\\").slice(0, -1).join("\\");
            }

            const list = fs.readdirSync(filePath);
            fs.readFile('./index.html', (err, data) => {
                let newList = "<ul>";
                const historyUrl = (i, requestUrlArr) => {
                    let historyUrlString = "";
                    if (i == 0) {
                        return "/";
                    }
                    for (let a = 1; a <= i; a++) {
                        historyUrlString += "/" + requestUrlArr[a];
                    }
                    return historyUrlString;
                }

                const breadcrumbs = () => {
                    let requestUrlArr = request.url.split("/");
                    requestUrlArr.pop();
                    return requestUrlArr.map((url, i, arr) => {
                        return `<a href="${historyUrl(i, arr)}">..${url}/</a>`
                    }).join("");
                }

                newList += `<li style="list-style-type: none;">${breadcrumbs()}</li>`;
                list.forEach(el => {
                    let newEl = el;
                    let newRequestUrl = request.url.replace("index.html", "");
                    if (!isFile(path.join(filePath, el))) {
                        newEl = el + "/";
                    }
                    if (newRequestUrl == "/") {
                        newList += `<li><a href="${newRequestUrl + el}">${newEl}</a></li>`;
                    } else {
                        newList += `<li><a href="${newRequestUrl + "/" + el}">${newEl}</a></li>`;
                    }
                });
                newList += "</ul>";

                let newHTML = data.toString().replace("{{data}}", newList).replace("{{h2}}", `<h2>${request.url.split("/").pop()}</h2>`);
                
                response.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                });

                response.end(newHTML);
            });
        }

    } else {
        response.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8'
        });

        response.end("Страница не найдена");
    }
}).listen(3000, 'localhost');
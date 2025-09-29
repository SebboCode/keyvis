const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    // Bestimme den Pfad zur angeforderten Datei
    let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

    // Bestimme den Content-Type
    let extname = path.extname(filePath);
    let contentType = "text/html";
    switch (extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
            contentType = "image/jpg";
            break;
        case ".gif":
            contentType = "image/gif";
            break;
    }

    // Lese die Datei
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == "ENOENT") {
                // Seite nicht gefunden
                fs.readFile(path.join(__dirname, "404.html"), (err, content) => {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(content, "utf-8");
                });
            } else {
                // Serverfehler
                res.writeHead(500);
                res.end(`Serverfehler: ${err.code}`);
            }
        } else {
            // Erfolgreich
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});

// Definiere den Port, auf dem der Server lauschen soll
const port = 3000;
server.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});

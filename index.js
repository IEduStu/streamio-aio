const path = require("path");
const child_process = require("child_process");
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");

const INDEX_CACHE = 7200;
const ASSETS_CACHE = 2629744;
const AIO_HTTP_PORT = 8080;
const SERVER_PORT = 11470;

const webBuildPath = "/stremio-web";
const indexPath = path.join(webBuildPath, "index.html");

const app = express();

app.get("/", cookieParser(), (req, res) => {
    res.set("cache-control", `public, max-age: ${INDEX_CACHE}`);

    if (req.cookies["stremio-server-set"] != "true") {
        res.cookie("stremio-server-set", "true");

        const currentUrl = new URL(req.originalUrl, "http://localhost");
        if (!currentUrl.searchParams.has("streamingServerUrl")) {
            const newUrl = new URL(currentUrl.href);
            newUrl.searchParams.set("streamingServerUrl", currentUrl.origin);

            res.redirect(newUrl.href.slice(newUrl.origin.length));
            return;
        }
    }

    res.sendFile(indexPath);
});

app.use(
    express.static(webBuildPath, {
        setHeaders(res, path) {
            if (path === indexPath)
                res.set("cache-control", `public, max-age: ${INDEX_CACHE}`);
            else
                res.set("cache-control", `public, max-age: ${ASSETS_CACHE}`);
        }
    })
);

const serverProcess = child_process.spawn("node", ["/stremio/server.js"], {
    stdio: "inherit",
    cwd: "/stremio"
});
serverProcess.on("exit", (code) => {
    console.error(`Server process exited with code: ${code}`);
    process.exit(code);
});
if (serverProcess.exitCode != null) {
    console.error(`Server process exited with code: ${serverProcess.exitCode}`);
    process.exit(serverProcess.exitCode);
}

app.use((req, res) => {
    const request = http.request({
        host: "127.0.0.1",
        port: SERVER_PORT,
        path: req.originalUrl,
        method: req.method,
        headers: req.headers
    }, (reqRes) => {
        res.writeHead(reqRes.statusCode, reqRes.headers);
        reqRes.pipe(res, {
            end: true
        });

        reqRes.on("error", (err) => {
            console.error("Request response error:", err);

            res
                .status(500)
                .write(err.message)
                .end();
        });
    });

    request.on("error", (err) => {
        console.error("Request error:", err);

        res
            .status(500)
            .write(err.message)
            .end();
    });

    req.pipe(request, {
        end: true
    });

    req.on("close", () => {
        if (!request.closed)
            request.destroy();
    });
});

app.all("*", (req, res) => {
    res.status(404).send("<h1>Page not found</h1>");
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
});

app.listen(AIO_HTTP_PORT, () => {
    console.info(`AIO server listening on port: ${AIO_HTTP_PORT}`)
});

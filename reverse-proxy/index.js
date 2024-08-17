const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const qs = require("qs");
const https = require("https");
const fileSystem = require("fs");
const aFileHandler = require("fs").promises;
const Blob = require("buffer").Blob;
const httpProxy = require('http-proxy');

// -----CONFIG!------
process.chdir(__dirname);
require("dotenv").config();
const portNumber = process.env.PORT_NUMBER;
const backendAddr = process.env.BACKEND_ADDR;
const baseEndPoint = process.env.BASE_END_POINT;
const isBasicAuth = process.env.IS_BASIC_AUTH === "true";
const isHTTPS = process.env.HTTPS === "true";
const certFilePath = process.env.SSL_CRT_FILE;
const keyFilePath = process.env.SSL_KEY_FILE;
// ------------------

const app = express();
app.use(
  cors({
    origin: "*"
  })
);
const apiProxy = httpProxy.createProxyServer();
const baseServerEndPoint = `${backendAddr}${baseEndPoint}`;

function getFullTime()
{
  const date = new Date();
  return (
    String("00" + date.getHours()).slice(-2) +
    ":" +
    String("00" + date.getMinutes()).slice(-2) +
    ":" +
    String("00" + date.getSeconds()).slice(-2)
  );
}

app.get("/", function (req, res)
{
  console.log(`GET | ${getFullTime()} | ${req.path}`);
  res.send(
    `<body style="margin: 0;">
    <div
    id="rootDiv"
    style="background: #36383F;
    display: flex;
    align-items: center;
    justify-content:
    center; width: 100%;
    height: 100%;
    font-size: 3em;
    color: white;"
    >Reverse proxy working...</div>
    <script>setInterval(() => {
      const rootDiv = document.querySelector("#rootDiv");
      switch(rootDiv.textContent) {
        case "Reverse proxy working":
          rootDiv.textContent = "Reverse proxy working.";
          break;
        case "Reverse proxy working.":
          rootDiv.textContent = "Reverse proxy working..";
          break;
        case "Reverse proxy working..":
          rootDiv.textContent = "Reverse proxy working...";
          break;
        case "Reverse proxy working...":
          rootDiv.textContent = "Reverse proxy working";
          break;
      }
    }, 500)</script>
    </body>`
  );
});

app.all(":endpoint([\\/\\w\\.-\\?\\=]*)", function (req, res) {
  const endpoint = `${baseServerEndPoint}${req.params.endpoint}`;
  console.log(`${req.method} | ${getFullTime()} | ${endpoint}`);

  apiProxy.web(req, res, {target: `${baseServerEndPoint}`});
});

if (isHTTPS)
{
  const serverOptions = {
    key: String(fileSystem.readFileSync(keyFilePath)),
    cert: String(fileSystem.readFileSync(certFilePath))
  };
  // Provide the private and public key to the server by reading each
  // file's content with the readFileSync() method.
  const httpsServer = https.createServer(serverOptions, app);
  httpsServer.listen(portNumber, function () {
    console.log("HTTPS Listening to port:" + portNumber);
  });
}
else
{
  console.log("HTTP Listening to port:" + portNumber);
  app.listen(portNumber);
}

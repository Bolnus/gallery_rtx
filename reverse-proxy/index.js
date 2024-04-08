const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const qs = require("qs");
const https = require("https");
const fileSystem = require("fs");
const aFileHandler  = require("fs").promises;
const Blob = require('buffer').Blob;

// -----CONFIG!------
process.chdir(__dirname);
require("dotenv").config();
const portNumber = process.env.PORT_NUMBER;
const backendAddr = process.env.BACKEND_ADDR;
//const baseEndPoint = "/crm_users/hs/work_orders";
const baseEndPoint = process.env.BASE_END_POINT;
const isBasicAuth = process.env.IS_BASIC_AUTH==="true";
const isHTTPS = process.env.HTTPS==="true";
const certFilePath = process.env.SSL_CRT_FILE;
const keyFilePath = process.env.SSL_KEY_FILE;
// ------------------

const jsonParser = bodyParser.json();
const app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors({
    origin: '*'
}));

let axiosClient = axios.create({
    baseURL: backendAddr
});


function getFullTime()
{
    let date = new Date();
    return String("00" + date.getHours()).slice(-2) + ':' + String("00" + date.getMinutes()).slice(-2) + ':' + String("00" + date.getSeconds()).slice(-2);
}

function getHTTPConfig(req)
{
    let params = {};
    for(const [field,value] of Object.entries(req.query))
    {
        params[field] = value;
    }

    let acceptBasedHeader;
    if (req.headers?.["accept"].includes("application/json"))
        acceptBasedHeader = {};
    else
        acceptBasedHeader = {  responseType: "stream" }

    if(req.headers.hasOwnProperty("authorization")&&!isBasicAuth)
    {
        // console.log(req.headers.authorization)
        return {
            // params: params,
            ...acceptBasedHeader,
            headers: {
                
                Authorization: req.headers.authorization
            }
        }
    }
    else if(isBasicAuth)
    {
        return {
            ...acceptBasedHeader,
            // params: params
            auth: {
                username: "Лазарев Сергей", //unescape(encodeURIComponent("Лазарев Сергей"))
                password: ""
            }
        }
    }
    return acceptBasedHeader;
}

function handleError(error,res)
{
    if(error.hasOwnProperty("response"))
    {
        if(error.response?.data && error.response?.headers?.["content-type"].includes("application/json"))
        {
            console.log(`Error | ${getFullTime()} | ${error.response.statusText} (${error.response.status})`);
            return res.status(error.response.status).json(error.response.data);
        }
        else if(error.response?.statusText)
        {
            console.log(`Error | ${getFullTime()} | ${error.response.statusText} (${error.response.status})`);
            return res.status(error.response.status).json({ statusText: error.response.statusText });
        }
        else
        {
            console.log("Error | " + getFullTime() + " | " + error.response.status);
            return res.sendStatus(error.response.status);
        }
    }
    else
    {
        console.log("Error | " + getFullTime() + " | " + error.code);
        return res.sendStatus(500);
    }
}

function getQueryString(req)
{
    if(Object.keys(req.query).length !== 0)
    {
        //console.log('?'+qs.stringify(req.query,{ format : 'RFC3986' }))
        return '?'+qs.stringify(req.query,{ format : 'RFC3986' });
    }
    else
    {
        //console.log("Empty qs");
        return "";
    }
}

app.get('/',function(req,res)
{
    console.log("GET | " + getFullTime() + " | " + req.path);
    res.send("<div style='background: #36383F; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 3em; color: white;'>Reverse proxy working...</div>");
});

app.get(":endpoint([\\/\\w\\.-\\?\\=]*)",async function(req,res)
{
    let endpoint = backendAddr+baseEndPoint+req.params.endpoint;
    console.log("GET | " + getFullTime() + " | " + endpoint);

    const httpConfig = getHTTPConfig(req);
    const queryParams = getQueryString(req);

    try
    {
        const backendResponse = await axiosClient.get(baseEndPoint+req.params.endpoint+queryParams,httpConfig);
        
        if (backendResponse?.headers?.["content-type"].includes("application/json"))
            res.json(backendResponse.data);
        else
        {
            
            // res.set(backendResponse.headers);
            // res.setHeader("content-disposition", backendResponse.headers["content-disposition"]);
            res.setHeader("Content-Type", backendResponse?.headers?.["content-type"]);
            backendResponse.data.pipe(res);
            // res.send(Buffer.from(backendResponse.data, 'binary'));
        }
    }
    catch(error)
    {
        return handleError(error,res);
    }
});

function writeBase64DecodedFile(base64str, fileName)
{
    const fileContents = base64str.split(";base64,").pop();
    // const bitmap = Buffer.alloc(base64str, 'base64')
    return aFileHandler.writeFile(`${__dirname}/photo/${fileName}`, fileContents, {encoding: 'base64'});
}

app.post(":endpoint(*/photo)",async function(req,res)
{
    let endpoint = backendAddr+baseEndPoint+req.params.endpoint;
    console.log("POST1 | " + getFullTime() + " | " + endpoint);

    try
    {
        await writeBase64DecodedFile(req.body?.params?.Data, req.body?.params?.Name);
        res.sendStatus(200);
    }
    catch(error)
    {
        return handleError(error,res);
    }
});

app.post(":endpoint([\\/\\w\\.-\\?\\=]*)",async function(req,res)
{
    let endpoint = backendAddr+baseEndPoint+req.params.endpoint;
    console.log("POST | " + getFullTime() + " | " + endpoint);

    const httpConfig = getHTTPConfig(req);
    const queryParams = getQueryString(req);

    try
    {
        const backendResponse = await axiosClient.post(baseEndPoint+req.params.endpoint+queryParams,req.body,httpConfig);
        //console.log(backendResponse.body);
        res.json(backendResponse.data);
    }
    catch(error)
    {
        return handleError(error,res);
    }
});

if(isHTTPS)
{
    const serverOptions = {
        key: String(fileSystem.readFileSync(keyFilePath)),
        cert: String(fileSystem.readFileSync(certFilePath))
    };
    // Provide the private and public key to the server by reading each
    // file's content with the readFileSync() method.
    const httpsServer = https.createServer(serverOptions,app);
    httpsServer.listen(portNumber, function()
    {
        console.log("HTTPS Listening to port:"+portNumber);
    });
}
else
{
    console.log("HTTP Listening to port:"+portNumber);
    app.listen(portNumber);
}


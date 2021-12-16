const encryption     = require("./encryption");
const http           = require("http");
const fs             = require("fs");
const requests       = require("./requests");
const km             = require("./keyManager");
 
const cors           = require("cors")
const express        = require("express");
const res            = require("express/lib/response");
const { response }   = require("express");
const app            = express();

const outPort        = 8080; 
const inPort         = 5000;
const baseURL        = "https://blockchain.prushton.com"


let activeUser;

fs.readFile('./server/index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(outPort);
});


app.use(cors({
    origin: `http://localhost:${outPort}`
}));

app.get("/NewUser/*", async(req, res) => {
    console.log(`Creating user`)
    keyPair = encryption.createKeys()
    
    publicKey = keyPair["public"]
    publicKey = publicKey.replace(/\r?\n|\r/g, "-----NEWLINE-----")

    userName = req.url.split("/")[2]
    
    getResponse = await requests.get(`${baseURL}/newUser/${userName}/${publicKey}`)
    
    if(getResponse == "Created User") {
        km.saveKeys(userName, keyPair["public"], keyPair["private"])
    }
    res.end(getResponse)
})

app.get("/NewBlock/*", async(req, res) => {
    info = req.url.split("/")[2]
    console.log("Creating new block: ",info)

    getResponse = await requests.get(`${baseURL}/newBlock/${activeUser}/${info}`)
    try {
        getResponse = JSON.parse(getResponse)
        otp = getResponse[0]
        encryptedHash = getResponse[1]
    } catch (e) {
        res.end("Invalid input parameters")
    }


    privateKey = await km.getPrivateKey(activeUser)
    try {
        decryptedHash = encryption.decrypt(privateKey, encryptedHash)
        result = await requests.get(`${baseURL}/otp/${otp}/${decryptedHash}`)
    } catch (e) {
        res.end("Invalid Key Pair")
    }

    res.end("Created Block")
})

app.get("/del/*", async(req, res) => {
    message = req.url.split("/")[2]

    getResponse = await requests.get(`${baseURL}/del/${message}`)
    getResponse = JSON.parse(getResponse)
    otp = getResponse[0]
    encryptedHash = getResponse[1]

    privateKey = await km.getPrivateKey(activeUser)
    decryptedHash = encryption.decrypt(privateKey, encryptedHash)

    result = await requests.get(`${baseURL}/otp/${otp}/${decryptedHash}`)

    res.end("Deleted")

})

app.get("/ls/*", async(req, res) => {
    message = req.url.split("/")[2]
    res.end(await requests.get(`${baseURL}/ls/${message}`))
})

app.get("/setActiveUser/*", (req, res) => {
    keyPair = req.url.split("/")[2]
    if(km.isUser(keyPair)) {
        res.end(`Opened key pair: ${keyPair}`)
        activeUser = keyPair
    } 
    else {
        res.end("Invalid key pair")
        activeUser = null
    }

})



var server = app.listen(inPort, function () {
    var host = server.address().address
    var port = server.address().port
})
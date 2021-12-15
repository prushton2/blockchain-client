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
    console.log("received")


    keyPair = encryption.createKeys()
    
    console.log("Created key pair")

    publicKey = keyPair["public"]
    publicKey = publicKey.replace(/\r?\n|\r/g, "-----NEWLINE-----")

    console.log("Converted key pair to a URL acceptable string")

    userName = req.url.split("/")[2]

    console.log(`Set desired username to ${userName}`)
    console.log("Sending request to create user")
    
    getResponse = await requests.get(`${baseURL}/newUser/${userName}/${publicKey}`)
    
    console.log(`Got a response of ${getResponse}`)

    if(getResponse == "Created User") {
        km.saveKeys(userName, keyPair["public"], keyPair["private"])
        console.log("Saved key pair")
    }
    res.end(getResponse)
})

app.get("/NewBlock/*", async(req, res) => {
    info = req.url.split("/")[2]
    console.log("Creating new block: ",info)

    getResponse = await requests.get(`${baseURL}/newBlock/${activeUser}/${info}`)
    getResponse = JSON.parse(getResponse)
    otp = getResponse[0]
    encryptedHash = getResponse[1]


    privateKey = await km.getPrivateKey(activeUser)
    decryptedHash = encryption.decrypt(privateKey, encryptedHash)

    result = await requests.get(`${baseURL}/otp/${otp}/${decryptedHash}`)
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
    console.log(result)

    res.end(result)

})

app.get("/ls/*", async(req, res) => {
    message = req.url.split("/")[2]
    res.end(await requests.get(`${baseURL}/ls/${message}`))
})

app.get("/Encrypt/*", async(req, res) => {
    message = req.url.split("/")[2]

    f = await km.getPublicKey(activeUser)
    encrypted = encryption.encrypt(f, message)
    res.end(encrypted)
})

app.get("/Decrypt/*", async(req, res) => {
    message = req.url.split("/").slice(2).join("/")
    message = encryption.convertUrlEscapeCharacters(message)
    
    f = await km.getPrivateKey(activeUser)
    try {
        decrypted = encryption.decrypt(f, message)
        decrypted = encryption.convertUrlEscapeCharacters(decrypted)
        res.end(decrypted)
    } catch (e) {
        res.end("An Unexpected Error Occurred")
    }
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
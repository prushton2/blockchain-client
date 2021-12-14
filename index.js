const encryption  = require("./encryption");
const http        = require("http");
const fs          = require("fs");
const requests    = require("./requests");
const km          = require("./keyManager");

const cors        = require("cors")
const express     = require("express");
const res         = require("express/lib/response");
const app         = express();

const outPort     = 8080; 
const inPort      = 5000;
const baseURL     = "https://blockchain.prushton.repl.co"


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

    userName = req.url.split("/")[2]
    
    response = await requests.get(`${baseURL}/newUser/${userName}/${keyPair["public"]}`)
    
    if(response == "Created User") {
        km.saveKeys(userName, keyPair["public"], keyPair["private"])
    }
    
    res.end(response)
})

app.get("/Encrypt/*", (req, res) => {
    message = req.url.split("/")[2]
    fs.readFile(`keyPairs/${activeUser}/publicKey.pem`, "utf8", (err, f) => {
        f = f.toString()
        encrypted = encryption.encrypt(f, message)
        res.end(encrypted)
    })
})

app.get("/Decrypt/*", (req, res) => {
    message = req.url.split("/").slice(2).join("/")
    fs.readFile(`keyPairs/${activeUser}/privateKey.pem`, "utf8", (err, f) => { //No file available kills program, need to fix
        f = f.toString()
        decrypted = encryption.decrypt(f, message)
        decrypted = encryption.convertUrlEscapeCharacters(decrypted)
        res.end(decrypted)
    })
})

app.get("/setActiveUser/*", (req, res) => {
    keyPair = req.url.split("/")[2]
    if(fs.existsSync(`keyPairs/${keyPair}/publicKey.pem`) && fs.existsSync(`keyPairs/${keyPair}/privateKey.pem`)) {
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
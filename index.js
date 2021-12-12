const encryption = require("./encryption")
const http = require('http');
const fs = require('fs');

const cors = require("cors")
const express = require('express');
const app = express();

const outPort=8080; 
const inPort =5000;




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

app.get('/*', function (req, res) {
    res.send('Hello World2');
})

var server = app.listen(inPort, function () {
    var host = server.address().address
    var port = server.address().port
})
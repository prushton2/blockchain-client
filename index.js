const encryption = require("./encryption")
var http = require('http');
var fs = require('fs');

const PORT=8080; 

fs.readFile('./server/index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(PORT);
});

const requestListener = async(req, res) => {
    console.log("ayyy")
    res.end("ayyy")
}


const server = http.createServer(requestListener);
server.listen(5000);
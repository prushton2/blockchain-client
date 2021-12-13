var https = require('https');
var fs = require('fs');

module.exports.get = async(url) => {
    return new Promise((resolve, reject) => {
        https.get(url, function(res) {
            console.log("URL: ", url)
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);
            
            res.on('data', function(d) {
                resolve(d.toString());
            });
        
        }).on('error', function(e) {
            reject(e);
        });
    })
}

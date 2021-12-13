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


module.exports.post = async(url, postData) => {
    const dataString = JSON.stringify(postData)

    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length,
        },
        timeout: 1000, // in ms
    }

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
          if (res.statusCode < 200 || res.statusCode > 299) {
            return reject(new Error(`HTTP status code ${res.statusCode}`))
          }
    
          const body = []
          res.on('data', (chunk) => body.push(chunk))
          res.on('end', () => {
            const resString = Buffer.concat(body).toString()
            resolve(resString)
          })
        })
    
        req.on('error', (err) => {
          reject(err)
        })
    
        req.on('timeout', () => {
          req.destroy()
          reject(new Error('Request time out'))
        })
    
        req.write(dataString)
        req.end()
    })
}
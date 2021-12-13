const https = require('https')

module.exports.get = async(host, path, port) => {
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'GET'
    }
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d => {
            process.stdout.write(d)
        })
    })
    
    req.on('error', error => {
        console.error(error)
    })
    
    req.end()
}
const fs = require("fs");
const keyPairPath = "keyPairs"

module.exports.saveKeys = async(userName, publicKey, privateKey) => {
    res = await mkdir(`${keyPairPath}/${userName}`)
    console.log(res)
    res = await write(`${keyPairPath}/${userName}/publicKey.pem`, publicKey)
    console.log(res)
    res = await write(`${keyPairPath}/${userName}/privateKey.pem`, privateKey)
    console.log(res)
}

module.exports.getPublicKey = async(userName) => {
    return await get(`${keyPairPath}/${userName}/publicKey.pem`)
}

module.exports.getPrivateKey = async(userName) => {
    return await get(`${keyPairPath}/${userName}/privateKey.pem`)
}

module.exports.isUser = (userName) => {
    return fs.existsSync(`${keyPairPath}/${userName}/privateKey.pem`) && fs.existsSync(`${keyPairPath}/${userName}/publicKey.pem`)
}

async function mkdir(path) {
    return new Promise((resolve, reject) => {
        fs.mkdir(`${keyPairPath}/${userName}`, (error) => {
            if(error) {
                reject(error)
            } else {
                resolve(`Directory ${path} Created Successfully`)
            }
        })
    })
}

async function write(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, err => {
            if (err) {
              reject(err)
              return
            } else {
                resolve(`File ${path} Created and Written`)
            }
          })
    })
}

async function get(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (err, f) => {
            if(err) {
                reject(err)
            } else {
                resolve(f.toString())
            }
        })
    })
}
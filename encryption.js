
let crypto = require("crypto"),
 keypair = require("keypair");


const createKeys = () => {
    pair = keypair(3072);
    return pair
}

module.exports.encrypt = (keyPair, message) => {
    let toEncrypt = Buffer.from(message, "utf8");
    let encrypted = crypto
        .publicEncrypt(pair["public"], toEncrypt)
        .toString("base64");
    return encrypted
}

module.exports.decrypt = (keyPair, message) => {
    let toDecrypt = Buffer.from(message, "base64");
    let decrypted = crypto
    .privateDecrypt(pair["private"], toDecrypt)
    .toString("utf8");
    return decrypted
}





// let keyPair = createKeys()

// let encrypted = encrypt(keyPair, "this is a string")

// let decrypted = decrypt(keyPair, encrypted)

// console.log(keyPair["public"])
// console.log("--------------")
// console.log(keyPair["private"])
// console.log("--------------")
// console.log(encrypted)
// console.log("--------------")
// console.log(decrypted)




// for unit testing purposes
// module.exports = { demonstrateKeyBasedAsymmetricEncryption, logger };
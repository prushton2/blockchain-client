let crypto = require("crypto"),
 keypair = require("keypair");


module.exports.createKeys = () => {
    pair = keypair(3072);
    return pair
}

module.exports.encrypt = (publicKey, message) => {
    let toEncrypt = Buffer.from(message, "utf8");
    let encrypted = crypto
        .publicEncrypt(publicKey, toEncrypt)
        .toString("base64");
    return encrypted
}

module.exports.decrypt = (privateKey, message) => {
    let toDecrypt = Buffer.from(message, "base64");
    let decrypted = crypto
    .privateDecrypt(privateKey, toDecrypt)
    .toString("utf8");
    return decrypted
}

module.exports.convertUrlEscapeCharacters = (string) => {
    charmap = 
    [[" ","%20"],
    ["$", "%24"],
    ["&", "%26"],
    ["`", "%60"],
    [":", "%3A"],
    ["<", "%3C"],
    [">", "%3E"],
    ["[", "%5B"],
    ["]", "%5D"],
    ["{", "%7B"],
    ["}", "%7D"],
    ["“", "%22"],
    ["+", "%2B"],
    ["#", "%23"],
    ["%", "%25"],
    ["@", "%40"],
    ["/", "%2F"],
    [";", "%3B"],
    ["=", "%3D"],
    ["?", "%3F"],
    ["\\","%5C"],
    ["^", "%5E"],
    ["|", "%7C"],
    ["~", "%7E"],
    ["‘", "%27"],
    [",", "%2C"]]

    charmap.forEach((element) => {
        string = string.replaceAll(element[1], element[0])
    })
    return string
}
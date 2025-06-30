"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.hashPassword = void 0;
const crypto = require("crypto");
const Config = require("../config/Enviornment");
const CryptoJS = require("crypto-js");
let password = "PixaliveService";
let conversionOutput;
/**
 * @author Santhosh Khan K
 * @date  09-10-2023
 * @description This function return password encryption.
 * @param {String} text
 */
let hashPassword = async (text) => {
    return await new Promise((resolve, reject) => {
        const hash = crypto.createHmac("sha256", Config.SERVER.SALT);
        hash.update(text.toString());
        resolve(hash.digest("hex"));
    });
};
exports.hashPassword = hashPassword;
/**
 * @author Santhosh Khan K
 * @date  09-10-2022
 * @description This function return decrypted item for given encryption using cryptojs
 * @param {String} encrypted
 */
let encrypt = (textToConvert) => {
    return (conversionOutput = CryptoJS.AES.encrypt(textToConvert.trim(), password.trim()).toString());
};
exports.encrypt = encrypt;
/**
 * @author Santhosh Khan K
 * @date  09-10-2022
 * @description This function return encrypted item for given string using cryptojs
 * @param {String} text
 */
let decrypt = (textToConvert) => {
    return (conversionOutput = CryptoJS.AES.decrypt(textToConvert.trim(), password.trim()).toString(CryptoJS.enc.Utf8));
};
exports.decrypt = decrypt;
//# sourceMappingURL=Encryption.js.map
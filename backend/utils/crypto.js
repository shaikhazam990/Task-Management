const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.AES_SECRET_KEY;

/**
 * Encrypt a string value using AES
 */
const encrypt = (text) => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(String(text), SECRET_KEY).toString();
};

/**
 * Decrypt an AES-encrypted string
 */
const decrypt = (cipherText) => {
  if (!cipherText) return cipherText;
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Encrypt specific fields in a response object
 */
const encryptFields = (obj, fields) => {
  const result = { ...obj };
  fields.forEach((field) => {
    if (result[field]) result[field] = encrypt(result[field]);
  });
  return result;
};

module.exports = { encrypt, decrypt, encryptFields };

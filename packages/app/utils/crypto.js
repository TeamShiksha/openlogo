const crypto = require("crypto");

/**
 * Encrypts and decrypts data using AES-256-GCM Algorithm.
 * The key used is stored in the .env file.
 * The key must be 32 bytes long and hex encoded.
 *
 */

const algorithm = "aes-256-gcm";

const getKey = () => {
  const key = process.env.CRYPTO_KEY;
  return key;
};

/**
 * Encrypts the given text.
 * @param {string} text - The text to encrypt.
 * @returns {Object} - The encrypted text, iv and tag.
 */
const encrypt = (text) => {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();
  return { encrypted, iv, tag };
};

/**
 * Decrypts the given text.
 * @param {Buffer} encrypted - The encrypted text.
 * @param {Buffer} iv - The initialization vector.
 * @param {Buffer} tag - The authentication tag.
 * @returns {string} - The decrypted text.
 */

const decrypt = (encrypted, iv, tag) => {
  const key = getKey();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { encrypt, decrypt };

const crypto = require("node:crypto");

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
  const key = Buffer.from(getKey(), "hex");
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const tag = cipher.getAuthTag();

  return {
    encrypted, // base64 string
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
};

/**
 * Decrypts AES-256-GCM encrypted data.
 *
 * @param {string} encrypted - Base64-encoded ciphertext.
 * @param {string} iv - Base64-encoded initialization vector (12 bytes).
 * @param {string} tag - Base64-encoded authentication tag (16 bytes).
 * @returns {string} - The decrypted UTF-8 plaintext.
 */
const decrypt = (encrypted, iv, tag) => {
  const key = Buffer.from(getKey(), "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(tag, "base64"));

  let decrypted = decipher.update(Buffer.from(encrypted, "base64"));

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
};

module.exports = { encrypt, decrypt };

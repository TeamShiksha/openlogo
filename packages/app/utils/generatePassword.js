const crypto = require('crypto')

/**
 * Generates a cryptographically secure random password of specified length.
 *
 * This function uses a CSPRNG to generate passwords using a combination of lowercase letters,
 * digits, and special characters. Default length is 12 characters.
 *
 * @param {number} [length=12] - The desired length of the generated password. Default is 12.
 * @returns {string} A secure randomly generated password.
 *
 * @example
 * const password = generatePassword(16);
 * console.log(password); // Outputs a 16-character random password.
 */
function generatePassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*=";

  let password = '';

    // Generate secure random bytes
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % chars.length;
    password += chars[index];
  }
  return password;
}

module.exports = { generatePassword };
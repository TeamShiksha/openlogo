/**
 * Generates a random password of specified length.
 *
 * This function creates a password using a combination of lowercase letters, digits,
 * and special characters. The generated password is random, and the length can
 * be customized by passing an argument. The default length is 12 if no argument is provided.
 *
 * @param {number} [length=12] - The desired length of the generated password. Default is 12.
 * @returns {string} A randomly generated password string of the specified length.
 *
 * @example
 * const password = generatePassword(16);
 * console.log(password); // Outputs a 16-character random password.
 */
function generatePassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    password += chars[index];
  }
  return password;
}

module.exports = { generatePassword };
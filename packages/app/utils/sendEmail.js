const axios = require("axios");
const logger = require("./logger");

/**
 * Sends an email using the configured email service.
 *
 * @param {Object} options
 * @param {number} options.id - Template ID to identify the email template.
 * @param {string} options.subject - Email subject.
 * @param {string} options.recipient - Recipient email address.
 * @param {Object} options.body - Dynamic content to populate the email template.
 * @param {Array<string>} [options.cc] - Optional CC email addresses.
 * @param {Array<string>} [options.bcc] - Optional BCC email addresses.
 *
 * @throws {Error} If email sending fails.
 */
async function sendEmail({ id, subject, recipient, body, cc = [], bcc = [] }) {
  const payload = { id, subject, recipient, body, cc, bcc };

  try {
    if (process.env.NODE_ENV === "production") {
      const response = await axios.post(
        `${process.env.EMAIL_SERVICE_URL}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.EMAIL_SERVICE_AUTH_TOKEN,
          },
        }
      );
      logger.info("Email sent successfully:", response.data);
    } else {
      logger.info("Development Mode");
      logger.info(payload);
    }
  } catch (error) {
    logger.error("Email sending failed:", error.message);
  }
}

module.exports = sendEmail;

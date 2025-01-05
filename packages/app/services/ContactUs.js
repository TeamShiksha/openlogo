const ContactUsRepository = require("../repositories/ContactUs");
class ContactUsService {
  constructor() {
    this.contactUsRepository = new ContactUsRepository();
  }
  /**
   * Checks if a form already exists for a given email and is active.
   * @param {string} email - The email to search for in the contact forms.
   * @returns {boolean} - Returns `true` if an active form exists for the email, otherwise `false`.
   * @throws {Error} - Throws an error if there is an issue querying the database.
   */
  async formExists(email) {
    try {
      const formQuery = await this.contactUsRepository.findByEmailAndStatus(
        email,
        true,
      );
      return !!formQuery;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Creates a new contact form.
   * @param {Object} formData - The data for the new contact form.
   * @param {string} formData.name - The name of the user submitting the form.
   * @param {string} formData.email - The email of the user submitting the form.
   * @param {string} formData.message - The message provided in the form.
   * @returns {Object} - The newly created form object.
   * @throws {Error} - Throws an error if form creation fails.
   */
  async createForm(formData) {
    try {
      const newForm = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        assignedTo: null,
        activityStatus: false,
        reply: null,
      };
      return await this.contactUsRepository.create(newForm);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Updates the contact form with a reply and assigns it to an operator.
   * @param {string} formId - The ID of the contact form to update.
   * @param {string} reply - The reply message to associate with the form.
   * @param {string} operatorId - The ID of the operator handling the form.
   * @returns {Object} - An object containing the updated form details or a flag if already replied.
   * @throws {Error} - Throws an error if the form is not found or the database update operation fails.
   */
  async updateForm(formId, reply, operatorId) {
    try {
      const currentForm = await this.contactUsRepository.getById(formId);
      console.log("currentForm", currentForm);
      if (!currentForm) throw new Error("Form not found");
      if (currentForm.status === "RESOLVED") {
        return { alreadyReplied: true };
      }

      const updateData = {
        comment: reply,
        status: "RESOLVED",
        // assignedTo: operatorId
      };

      const result = await this.contactUsRepository.updateFormStatus(
        formId,
        updateData,
      );
      if (result.modifiedCount === 0)
        throw new Error("MongoDB operation failed");

      return {
        reply,
        activityStatus: true,
        assignedTo: operatorId,
        email: currentForm.email,
        message: currentForm.message,
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves a form by its ID.
   * @param {string} formId - The ID of the form to retrieve.
   * @returns {Object|null} - The form object if found, otherwise null.
   * @throws {Error} - Throws an error if there is an issue querying the database.
   */
  async getForm(formId) {
    //getForm - check it again for try-catch
    try {
      return await this.contactUsRepository.getById(formId); // Fetches form by ID
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContactUsService;

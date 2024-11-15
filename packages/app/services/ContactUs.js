const ContactUsRepository = require('./ContactUs');

class ContactUsService {
  /* constructor() {
    this.contactUsRepository = new ContactUsRepository();
  } */

  /**
   * Checks if a form exists in the database with the given email and active status.
   * @param {string} email - Email submitted in the form.
   * @returns {Promise<boolean>} - True if the form is found in the database, otherwise false.
   */
  async formExists(email) {
    try {
      const formQuery = await ContactUsRepository.findByEmailAndStatus(email, true);
      return !!formQuery;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new form in the database.
   * @param {Object} formData - The form data to be created.
   * @returns {Promise<Object>} - The newly created form.
   */
  async createForm(formData) {
    try {
      const newForm = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        assignedTo: null,
        activityStatus: false,
        reply: null
      };
      return await this.contactUsRepository.create(newForm);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing form's status in the database.
   * @param {string} formId - The ID of the form to be updated.
   * @param {string} reply - The reply message.
   * @param {string} operatorId - The ID of the operator who is updating the form.
   * @returns {Promise<Object>} - Updated form details.
   */
  async updateForm(formId, reply, operatorId) {
    try {
      const currentForm = await this.contactUsRepository.getById(formId);
      if (!currentForm) throw new Error('Form not found');
      if (currentForm.activityStatus) {
        return { alreadyReplied: true };
      }

      const updateData = {
        reply,
        activityStatus: true,
        assignedTo: operatorId
      };

      const result = await this.contactUsRepository.updateFormStatus(formId, updateData);
      if (result.modifiedCount === 0) throw new Error('MongoDB operation failed');

      return {
        reply,
        activityStatus: true,
        assignedTo: operatorId,
        email: currentForm.email,
        message: currentForm.message
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContactUsService;

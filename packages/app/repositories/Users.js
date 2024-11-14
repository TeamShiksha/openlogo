const BaseRepository = require('./base');
const User = require('../models/Users');

/**
 * The UsersRepository extends BaseRepository to manage User model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the Users model to the base repository for database interactions.
 * Custom methods specific to Users can also be added as needed.
*/

class UsersRepository extends BaseRepository {
  constructor() {
    super(User); 
  }

  /**
   * Finds a user by email.
   * @param {string} emailId - The email address to search for.
   * @returns {Promise<Object|null>} - Returns the user document if found, otherwise null.
   */
  async findUserByEmail(emailId) {
    return await this.model.findOne({ email: emailId });
  }
}

module.exports = UsersRepository;

const BaseRepository = require("./base");
const UserToken = require("../models/usertoken");
const dayjs = require("dayjs");

/**
 * The UserTokenRepository extends BaseRepository to manage UerToken model operations,
 * inheriting CRUD methods like getById, getAll, create, update, and delete.
 * It passes the UserToken model to the base repository for database interactions.
 *  Custom methods specific to UserToken can also be added as needed.
 */

class UserTokenRepository extends BaseRepository {
  constructor() {
    super(UserToken);
  }

  async fetchUserToken(token) {
    return await UserToken.findOne({ token: token, is_deleted: false });
  }

  async fetchDeletedUserToken(token) {
    return await UserToken.findOne({ token: token, is_deleted: true });
  }

  async fetchUserTokenByUserId(userId) {
    return await UserToken.findOne({ user_id: userId, is_deleted: false });
  }

  async updateUserToken(token) {
    const updatedToken = await UserToken.findOneAndUpdate(
      { token, is_deleted: false },
      {
        $set: {
          expire_at: dayjs().add(1, "day").toDate(), // set expiry to 24h from now
        },
      },
      { new: true }
    );

    return updatedToken;
  }
}

module.exports = UserTokenRepository;

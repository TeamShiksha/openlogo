const { v4 } = require("uuid");
const { UserTokenRepository } = require("../repositories");
const { UserTokenTypes } = require("../utils/constants");

class UserTokenService {
  constructor() {
    this.userTokenRepository = new UserTokenRepository();
  }

  async createUserToken(userId) {
    const tokenData = {
      user_id: userId,
      token: v4().replaceAll("-", ""),
      type: UserTokenTypes.VERIFY,
    };
    return await this.userTokenRepository.create(tokenData);
  }

  async fetchUserToken(token) {
    return await this.userTokenRepository.fetchUserToken(token);
  }

  async fetchDeletedUserToken(token) {
    return await this.userTokenRepository.fetchDeletedUserToken(token);
  }

  async deleteUserToken(userToken) {
    const deleteUserTokenData = {
      is_deleted: true,
    };
    return await this.userTokenRepository.update(
      userToken._id,
      deleteUserTokenData
    );
  }

  async createForgotToken(userId) {
    return await this.userTokenRepository.create({
      user_id: userId,
      token: v4().replaceAll("-", ""),
      type: UserTokenTypes.FORGOT,
    });
  }
}

module.exports = UserTokenService;

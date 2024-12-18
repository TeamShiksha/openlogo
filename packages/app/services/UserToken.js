const UserTokenRepository = require("../repositories/UserToken");
const { UserTokenTypes } = require("../utils/constants");
const { v4 } = require("uuid");

class UserTokenService {
    constructor() {
        this.userTokenRepository = new UserTokenRepository();
    }

    async createUserToken(userId) {
        return await this.userTokenRepository.create({
            user_id: userId,
            token: v4().replaceAll("-", ""),
            type: UserTokenTypes.VERIFY
        });
    }

    async fetchUserToken(token) {
        return await this.userTokenRepository.fetchUserToken(token);
    }

    async deleteUserToken(userToken) {
        const deleteUserTokenData = {
            is_deleted: true
        };
        return await this.userTokenRepository.update(userToken._id, deleteUserTokenData);
    }

    async createForgotToken(userId) {
        return await this.userTokenRepository.create({
            user_id: userId,
            token: v4().replaceAll("-", ""),
            type: UserTokenTypes.FORGOT
        });
    }
}

module.exports = UserTokenService;
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

    async fetchUserToken(userId) {
        return await this.userTokenRepository.fetchUserToken(userId);
    }

    async deleteUserToken(userToken) {
        const deleteUserTokenData = {
            is_deleted: true
        };
        return await this.userTokenRepository.update(userToken._id, deleteUserTokenData);
    }
}

module.exports = UserTokenService;
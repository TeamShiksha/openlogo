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
}

module.exports = UserTokenService;
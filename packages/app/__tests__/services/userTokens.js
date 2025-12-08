const UserToken = require("../../models/usertoken");
const { UserTokenRepository } = require("../../repositories");
const UserTokenService = require("../../services/usertoken");
const { UserTokenTypes } = require("../../utils/constants");
const { MOCK_USERTOKENS } = require("../../utils/mocks");
const dayjs = require("dayjs");

describe("User Token Service", () => {
  let userTokenService;

  beforeEach(() => {
    userTokenService = new UserTokenService();
    jest.clearAllMocks();
  });

  it("create a new user token succesfully whose default value is VERIFY", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);

    jest
      .spyOn(UserTokenRepository.prototype, "create")
      .mockResolvedValue(userToken);

    const result = await userTokenService.createUserToken(userToken.user_id);

    expect(result).toBeDefined();
    expect(result.type).toBe(UserTokenTypes.VERIFY);
    expect(result.is_deleted).toBe(false);
  });

  it("should fetch a user token successfully for valid token", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);

    jest
      .spyOn(UserTokenRepository.prototype, "fetchUserToken")
      .mockResolvedValue(userToken);

    const result = await userTokenService.fetchUserToken(userToken.token);

    expect(result).toBeDefined();
    expect(result._id).toBe(userToken._id);
    expect(result.type).toBe(UserTokenTypes.VERIFY);
  });

  it("should return null if no user token found", async () => {
    const userToken = "invalid-token";

    jest
      .spyOn(UserTokenRepository.prototype, "fetchUserToken")
      .mockResolvedValue(null);

    const result = await userTokenService.fetchUserToken(userToken);

    expect(result).toBe(null);
  });

  it("should fetch a deleted user token if valid token is provided", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[4]);

    jest
      .spyOn(UserTokenRepository.prototype, "fetchDeletedUserToken")
      .mockResolvedValue(userToken);
    const result = await userTokenService.fetchDeletedUserToken(
      userToken.token
    );

    expect(result).toBeDefined();
    expect(result.type).toBe(UserTokenTypes.VERIFY);
    expect(result.is_deleted).toBe(true);
  });

  it("should return null if invalid token is provided", async () => {
    const userToken = "invalid-token";

    jest
      .spyOn(UserTokenRepository.prototype, "fetchDeletedUserToken")
      .mockResolvedValue(null);

    const result = await userTokenService.fetchDeletedUserToken(userToken);

    expect(result).toBe(null);
  });

  it("should delete user token successfully", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);
    const updatedTokenData = { ...userToken.toObject(), is_deleted: true };

    jest
      .spyOn(UserTokenRepository.prototype, "update")
      .mockResolvedValue(updatedTokenData);

    const result = await userTokenService.deleteUserToken(userToken);
    expect(result).toBeDefined();
    expect(result.is_deleted).toBe(true);
    expect(result.type).toBe(UserTokenTypes.VERIFY);
  });

  it("should create a forgot user token succesfully", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[5]);

    jest
      .spyOn(UserTokenRepository.prototype, "create")
      .mockResolvedValue(userToken);

    const result = await userTokenService.createForgotToken(userToken.user_id);
    expect(result).toBeDefined();
    expect(result.type).toBe(UserTokenTypes.FORGOT);
    expect(result.user_id).toBe("user@5");
  });

  it("should fetch user token by user id successfully", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);

    jest
      .spyOn(UserTokenRepository.prototype, "fetchUserTokenByUserId")
      .mockResolvedValue(userToken);

    const result = await userTokenService.fetchUserTokenByUserIdTokenType(
      userToken.user_id,
      UserTokenTypes.VERIFY
    );
    expect(result).toBeDefined();
    expect(result.type).toBe(UserTokenTypes.VERIFY);
  });

  it("should return null if no user token found with invalid user id", async () => {
    const userId = "invalid-user-id";
    const type = UserTokenTypes.FORGOT;

    jest
      .spyOn(UserTokenRepository.prototype, "fetchUserTokenByUserId")
      .mockResolvedValue(null);

    const result = await userTokenService.fetchUserTokenByUserIdTokenType(
      userId,
      type
    );
    expect(result).toBe(null);
  });

  it("should return null if no user token found with invalid token type", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);
    const type = "invalid-type";

    jest
      .spyOn(UserTokenRepository.prototype, "fetchUserTokenByUserId")
      .mockResolvedValue(null);

    const result = await userTokenService.fetchUserTokenByUserIdTokenType(
      userToken.user_id,
      type
    );
    expect(result).toBe(null);
  });

  it("should update user token successfully", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[1]);
    const updatedExpireAt = dayjs().add(1, "day").toDate();

    jest
      .spyOn(UserTokenRepository.prototype, "updateUserToken")
      .mockResolvedValue({
        ...userToken.toObject(),
        expire_at: updatedExpireAt,
      });

    const result = await userTokenService.updateUserToken(userToken.token);
    expect(result).toBeDefined();
    expect(result.expire_at).toEqual(updatedExpireAt);
  });
});

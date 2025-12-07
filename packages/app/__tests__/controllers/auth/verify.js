const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { UserService, UserTokenService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");
const sendEmail = require("../../../utils/sendEmail");
jest.mock("../../../utils/sendEmail");

describe("VERIFY EMAIL API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sendEmail.mockResolvedValue(true);
  });

  it("422 - No token provided", async () => {
    const response = await request(app).get(ENDPOINTS.VERIFY).send();

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: Messages.INVALID_TOKEN,
      statusCode: 422,
    });
  });

  it("404 - Invalid token", async () => {
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(null);
    jest
      .spyOn(UserTokenService.prototype, "fetchDeletedUserToken")
      .mockResolvedValue(null);
    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/invalidToken`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: Messages.INVALID_TOKEN,
      statusCode: 400,
    });
  }, 10000);

  // add test here
  it("404 - Invalid Token", async () => {
    const mockToken = {
      user_id: "invalid-user-id",
      isExpired: jest.fn().mockReturnValue(false),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/invalidToken`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.INVALID_TOKEN,
      statusCode: 404,
    });
    expect(mockToken.isExpired).not.toHaveBeenCalled();
  });

  it("500 - Verification failed", async () => {
    const mockToken = {
      isExpired: jest.fn().mockReturnValue(false),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue({});
    jest.spyOn(UserService.prototype, "verifyUser").mockResolvedValue(false);

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/validToken`)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.VERIFICATION_FAIL,
      statusCode: 500,
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
  });

  it("500 - Something went wrong", async () => {
    const mockToken = {
      isExpired: jest.fn().mockReturnValue(false),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue({});
    jest.spyOn(UserService.prototype, "verifyUser").mockResolvedValue(true);
    jest
      .spyOn(UserTokenService.prototype, "deleteUserToken")
      .mockResolvedValue(null);

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/validToken`)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.SOMETHING_WENT_WRONG,
      statusCode: 500,
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
  });

  it("200 - Verified", async () => {
    const mockToken = {
      isExpired: jest.fn().mockReturnValue(false),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue({});
    jest.spyOn(UserService.prototype, "verifyUser").mockResolvedValue(true);
    jest
      .spyOn(UserTokenService.prototype, "deleteUserToken")
      .mockResolvedValue({});

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/validToken`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      message: "Email verified successfully",
      success: true,
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
  });
});

const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { UserService, UserTokenService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("VERIFY EMAIL API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("422 - No token provided", async () => {
    const response = await request(app).get(ENDPOINTS.VERIFY).send();

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: Messages.INVALID_TOKEN,
      statusCode: 422,
      ui: {
        message: "Invalid token.",
        showLoader: false,
        state: "ERROR",
        title: "Error",
      },
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
      ui: {
        message: "Invalid token.",
        showLoader: false,
        state: "ERROR",
        title: "Error",
      },
    });
  }, 10000);

  it("403 - Token expired", async () => {
    const mockToken = {
      isExpired: jest.fn().mockReturnValue(true),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/expiredToken`)
      .send();

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: STATUS_CODES[403],
      message: Messages.EXPIRED_TOKEN,
      statusCode: 403,
      ui: {
        message: "Token expired.",
        showLoader: false,
        state: "ERROR",
        title: "Error",
      },
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
  });

  it("404 - Invalid Token", async () => {
    const mockToken = {
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
      ui: {
        message: "Invalid token.",
        showLoader: false,
        state: "ERROR",
        title: "Error",
      },
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
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
      ui: {
        message: "Verification failed.",
        showLoader: false,
        state: "ERROR",
        title: "Error",
      },
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
      ui: {
        message: "We're experiencing high demand. Please try again later.",
        showLoader: false,
        state: "ERROR",
        title: "Error",
      },
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
      ui: {
        message:
          "Your email has been verified successfully. Redirecting to homepage...",
        redirectAfter: 3000,
        showLoader: false,
        state: "SUCCESS",
        title: "Verified",
      },
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
  });
});

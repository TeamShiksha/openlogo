const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { UserTokenService } = require("../../../services");

const app = require("../../../server");

describe("RESET PASSWORD SESSION API", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "secret";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it("422 - Invalid or expired token", async () => {
    const response = await request(app)
      .get(ENDPOINTS.RESET_PASSWORD_SESSION)
      .send();

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Invalid or expired token",
      statusCode: 422,
    });
  });

  it("404 - User Token not found", async () => {
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(null);

    const response = await request(app)
      .get(`${ENDPOINTS.RESET_PASSWORD_SESSION}/invalidToken`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: "User Token not found",
      statusCode: 404,
    });
  });

  it("403 - Token expired", async () => {
    const mockUserToken = {
      isExpired: jest.fn().mockReturnValue(true),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockUserToken);

    const response = await request(app)
      .get(`${ENDPOINTS.RESET_PASSWORD_SESSION}/expiredToken`)
      .send();

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: STATUS_CODES[403],
      message: "Token expired",
      statusCode: 403,
    });
  });

  it("200 - Successful", async () => {
    const mockUserToken = {
      isExpired: jest.fn().mockReturnValue(false),
      user_id: 123,
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockUserToken);

    const response = await request(app)
      .get(`${ENDPOINTS.RESET_PASSWORD_SESSION}/validToken`)
      .send();

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.header["set-cookie"][0]).toMatch(/resetPasswordSession=/);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
});

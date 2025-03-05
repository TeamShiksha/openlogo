const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { UserService, UserTokenService } = require("../../../services");

const app = require("../../../server");

describe("FORGOT PASSWORD API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("422 - Email is required", async () => {
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({});

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Email is required",
      statusCode: 422,
    });
  });

  it("422 - Invalid email", async () => {
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: "invalidEmail" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Invalid email",
      statusCode: 422,
    });
  });

  it("422 - Email must be string", async () => {
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: 123 });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Email must be string",
      statusCode: 422,
    });
  });

  it("404 - Email does not exist", async () => {
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: "email@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: "Email does not exist",
      statusCode: 404,
    });
  });

  it("503 - Unable to process request", async () => {
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue({});
    jest
      .spyOn(UserTokenService.prototype, "createForgotToken")
      .mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: "email@example.com" });

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      error: STATUS_CODES[503],
      message: "Unable to process request",
      statusCode: 503,
    });
  });

  it("200 - Email sent", async () => {
    const mockUserToken = {
      tokenURL: jest.fn().mockReturnValue("http://example.com"),
    };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue({});
    jest
      .spyOn(UserTokenService.prototype, "createForgotToken")
      .mockResolvedValue(mockUserToken);

    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: "email@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
});

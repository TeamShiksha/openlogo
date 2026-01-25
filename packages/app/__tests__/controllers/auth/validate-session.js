const request = require("supertest");
const app = require("../../../server");
const { STATUS_CODES } = require("http");
const { Users } = require("../../../models");
const { MOCK_USERS } = require("../../../utils/mocks");

describe("GET /validate-session", () => {
  beforeAll(() => {
    process.env.CLIENT_URL = "https://localhost:3000";
    process.env.JWT_SECRET = "secret";
  });

  afterAll(() => {
    delete process.env.CLIENT_URL;
    delete process.env.JWT_SECRET;
  });

  it("401 - token does not exist", async () => {
    const response = await request(app).get("/api/auth/validate-session");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: "Invalid credentials",
      error: STATUS_CODES[401],
    });
  });

  it.skip("200 - Success", async () => {
    const mockUser = new Users(MOCK_USERS[1]);
    const mockToken = mockUser.generateJWT();

    const response = await request(app)
      .get("/api/auth/validate-session")
      .set("Cookie", `jwt=${mockToken}`);

    const userData = mockUser.data();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      userData: {
        ...userData,
        created_at: new Date(userData.created_at).toISOString(),
        updated_at: new Date(userData.updated_at).toISOString(),
      },
    });
  });
});

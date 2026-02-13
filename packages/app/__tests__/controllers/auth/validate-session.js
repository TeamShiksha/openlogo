const request = require("supertest");
const app = require("../../../server");
const { STATUS_CODES } = require("http");
const { Users } = require("../../../models");
const { UserSessionService } = require("../../../services");
const {
  MOCK_USERS,
  MOCK_SESSION_ID,
  MOCK_USER_SESSIONS,
} = require("../../../utils/mocks");

describe("GET /validate-session", () => {
  beforeAll(() => {
    process.env.CLIENT_URL = "https://localhost:3000";
  });

  afterAll(() => {
    delete process.env.CLIENT_URL;
  });

  it("401 - token does not exist", async () => {
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(null);

    const response = await request(app).get("/api/auth/validate-session");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      statusCode: 401,
      message: "Invalid credentials",
      error: STATUS_CODES[401],
    });
  });

  it("200 - Success", async () => {
    const mockUser = new Users(MOCK_USERS[1]);
    const userData = mockUser.data();

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue({
        ...MOCK_USER_SESSIONS[1],
        userId: mockUser,
      });

    const response = await request(app)
      .get("/api/auth/validate-session")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      userData: {
        userId: userData.userId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        is_verified: userData.is_verified,
        subscription_id: userData.subscription_id,
        is_deleted: userData.is_deleted,
        updated_at: new Date(userData.updated_at).toISOString(),
      },
    });
  });
});

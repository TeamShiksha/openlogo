const request = require("supertest");
const { MOCK_SESSION_ID, MOCK_USER_SESSIONS } = require("../../../utils/mocks");
const { UserService, UserSessionService } = require("../../../services");
const app = require("../../../server");

describe("Delete User Account", () => {
  beforeAll(() => {
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.CLIENT_PROXY_URL;
  });

  it("500 - Unexpected Error", async () => {
    // Spy on the actual function used in controller
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(UserService.prototype, "markDeleteUser")
      .mockImplementation(() => {
        throw new Error("Unexpected error");
      });

    const response = await request(app)
      .delete("/api/user/me")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(500);
  });

  it("200 - User account deleted", async () => {
    // Spy on markDeleteUser function
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "markDeleteUser").mockResolvedValue(true);

    const response = await request(app)
      .delete("/api/user/me")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(200);

    const setCookieHeader = response.headers["set-cookie"];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/jwt=;/);
  });
});

const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");
const { MOCK_SESSION_ID, MOCK_USER_SESSIONS } = require("../../../utils/mocks");
const { UserSessionService } = require("../../../services");

describe("SIGNOUT API", () => {
  it("400 - Invalid email", async () => {
    const response = await request(app).post(ENDPOINTS.SIGNOUT).send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: Messages.SESSION_FAIL,
      statusCode: 400,
    });
  });

  it("205 - Signout successful", async () => {
    jest
      .spyOn(UserSessionService.prototype, "signout")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .post(ENDPOINTS.SIGNOUT)
      .set("Cookie", [`sessionId=${MOCK_SESSION_ID}`])
      .send();
    expect(response.status).toBe(205);
    const setCookieHeader = response.headers["set-cookie"];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/sessionId=;/);
  });
});

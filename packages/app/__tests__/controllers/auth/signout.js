const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

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

  it.skip("205 - Signout successful", async () => {
    const response = await request(app)
      .post(ENDPOINTS.SIGNOUT)
      .set("Cookie", ["jwt=token"])
      .send();
    expect(response.status).toBe(205);
    const setCookieHeader = response.headers["set-cookie"];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/jwt=;/);
  });
});

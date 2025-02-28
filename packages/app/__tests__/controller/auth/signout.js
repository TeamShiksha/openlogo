const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const app = require("../../../server");

describe("SIGNOUT API", () => {
  it("400 - Invalid email", async () => {
    const response = await request(app).post(ENDPOINTS.SIGNOUT).send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: "Failed to validate user session",
      statusCode: 400,
    });
  });

  it("205 - Signout successful", async () => {
    const response = await request(app)
      .post(ENDPOINTS.SIGNOUT)
      .set("Cookie", ["jwt=token"])
      .send();
    expect(response.status).toBe(205);
    expect(response.headers["set-cookie"]).toEqual([
      "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);
  });
});

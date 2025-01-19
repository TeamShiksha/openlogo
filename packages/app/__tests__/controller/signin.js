const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../index");

const ENDPOINT = "/api/auth/signin";

describe("Signin Controller", () => {
  it("422 - Email is required", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .send({ user: "hello world" });

    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Email is required",
      statusCode: 422,
    });
  });
});

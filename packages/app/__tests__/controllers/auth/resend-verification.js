jest.setTimeout(15000);
const request = require("supertest");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { UserTokenService, UserService } = require("../../../services");
const { MOCK_USERS, MOCK_USERTOKENS } = require("../../../utils/mocks");

const app = require("../../../server");

describe("RESEND VERIFICATION API", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("422 - empty email field", async () => {
    const response = await request(app)
      .post(ENDPOINTS.RESEND_VERIFICATION)
      .send({});
    expect(response.status).toBe(422);
  });
  it("400 - invalid email format", async () => {
    const response = await request(app)
      .post(ENDPOINTS.RESEND_VERIFICATION)
      .send({ email: "test" });
    expect(response.status).toBe(400);
  });

  it("200 - already verified user", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(MOCK_USERS[1]); // user with is_verified = true

    const response = await request(app)
      .post(ENDPOINTS.RESEND_VERIFICATION)
      .send({ email: MOCK_USERS[1].email });

    expect(response.status).toBe(200);
  });

  it("404 - user email doesn't exist", async () => {
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null); // simulate not found

    const response = await request(app)
      .post(ENDPOINTS.RESEND_VERIFICATION)
      .send({ email: "notSignedUpUser@gmail.com" });

    expect(response.status).toBe(404);
  });

  it("200 - verification link resended", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(MOCK_USERS[0]); // user with is_verified = false

    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockResolvedValue({
        ...MOCK_USERTOKENS[0],
        tokenURL: () => "https://mocked-verification-link",
      });
    const response = await request(app)
      .post(ENDPOINTS.RESEND_VERIFICATION)
      .send({ email: MOCK_USERS[0].email });

    expect(response.status).toBe(200);
  });
});

const request = require("supertest");
const { STATUS_CODES } = require("http");
const { MOCK_SESSION_ID, MOCK_USER_SESSIONS } = require("../../../utils/mocks");
const { RequestService, UserSessionService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("Logo Request", () => {
  beforeAll(() => {
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.CLIENT_PROXY_URL;
  });

  it("422 - User ID must be a valid hexadecimal string", async () => {
    const mockInput = {
      user_id: "DF01#301$80B@69B041@720@",
      companyUrl: "https://www.google.co.in/",
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);

    const response = await request(app)
      .post("/api/user/request")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: "User ID must be a valid hexadecimal string",
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("422 - Invalid URL", async () => {
    const mockInput = {
      user_id: "DF016301880BC69B04117206",
      companyUrl: "google",
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);

    const response = await request(app)
      .post("/api/user/request")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: "Invalid URL",
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("500 - Raise request fail", async () => {
    const mockInput = {
      user_id: "DF016301880BC69B04117206",
      companyUrl: "https://www.google.co.in/",
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(RequestService.prototype, "createRaiseRequest")
      .mockResolvedValue(false);

    const response = await request(app)
      .post("/api/user/request")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: Messages.SOMETHING_WENT_WRONG,
      statusCode: 500,
      error: STATUS_CODES[500],
    });
  });

  it("500 - Unexpected Error", async () => {
    const mockInput = {
      user_id: "DF016301880BC69B04117206",
      companyUrl: "https://www.google.co.in/",
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(RequestService.prototype, "createRaiseRequest")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await request(app)
      .post("/api/user/request")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(500);
  });

  it("200 - Request Raised", async () => {
    const mockInput = {
      user_id: "DF016301880BC69B04117206",
      companyUrl: "https://www.google.co.in/",
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(RequestService.prototype, "createRaiseRequest")
      .mockResolvedValue(true);

    const response = await request(app)
      .post("/api/user/request")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
});

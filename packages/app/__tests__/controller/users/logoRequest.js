const request = require("supertest");
const { STATUS_CODES } = require("http");
const { Users } = require("../../../models");
const { MOCK_USERS } = require("../../../utils/mocks");
const { RequestService } = require("../../../services");
const app = require("../../../server");

describe("Logo Request", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  it("422 - User ID is required", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      user_id: "",
      companyUrl: "https://www.google.co.in/",
    };

    const response = await request(app)
      .post("/api/users/me/request")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: '"user_id" is not allowed to be empty',
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("422 - User ID must be exactly 24 characters long", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      user_id: "DF016301880BC69B0411720",
      companyUrl: "https://www.google.co.in/",
    };

    const response = await request(app)
      .post("/api/users/me/request")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: "User ID must be exactly 24 characters long",
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("422 - User ID must be a valid hexadecimal string", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      user_id: "DF01#301$80B@69B041@720@",
      companyUrl: "https://www.google.co.in/",
    };

    const response = await request(app)
      .post("/api/users/me/request")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: "User ID must be a valid hexadecimal string",
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("422 - URL is required", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      user_id: "DF016301880BC69B04117206",
      companyUrl: "",
    };

    const response = await request(app)
      .post("/api/users/me/request")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: '"companyUrl" is not allowed to be empty',
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("422 - Invalid URL", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      user_id: "DF016301880BC69B04117206",
      companyUrl: "google",
    };

    const response = await request(app)
      .post("/api/users/me/request")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: "Invalid URL",
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("500 - Raise request fail", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      user_id: "DF016301880BC69B04117206",
      companyUrl: "https://www.google.co.in/",
    };
    jest
      .spyOn(RequestService.prototype, "createRaiseRequest")
      .mockResolvedValue(false);

    const response = await request(app)
      .post("/api/users/me/request")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Something went wrong, try again later",
      statusCode: 500,
      error: STATUS_CODES[500],
    });
  });

  it("200 - Request Raised", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      user_id: "DF016301880BC69B04117206",
      companyUrl: "https://www.google.co.in/",
    };

    jest
      .spyOn(RequestService.prototype, "createRaiseRequest")
      .mockResolvedValue(true);

    const response = await request(app)
      .post("/api/users/me/request")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
});

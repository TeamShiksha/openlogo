const request = require("supertest");
const { STATUS_CODES } = require("http");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Users } = require("../../../models");
const { UserService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("Update User Password", () => {
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

  it("422 - Current password is required", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      currPassword: "",
      newPassword: "mockNewpassword",
    };

    const response = await request(app)
      .put("/api/users/me/password")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: '"currPassword" is not allowed to be empty',
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("422 - New password is required", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      currPassword: "mockCurrpassword",
      newPassword: "",
    };

    const response = await request(app)
      .put("/api/users/me/password")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: '"newPassword" is not allowed to be empty',
      statusCode: 422,
      error: STATUS_CODES[422],
    });
  });

  it("404 - User not found", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      currPassword: "password123",
      newPassword: "mockNewpassword",
    };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);

    const response = await request(app)
      .put("/api/users/me/password")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: Messages.USER_NOT_FOUND,
      error: STATUS_CODES[404],
    });
  });

  it("400 - Current password is incorrect", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      currPassword: "mockCurrpassword",
      newPassword: "mockNewpassword",
    };
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(new Users(MOCK_USERS[1]));

    const response = await request(app)
      .put("/api/users/me/password")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: Messages.INCORRECT_PASSWORD,
      statusCode: 400,
      error: STATUS_CODES[400],
    });
  });

  it("500 - Something went wrong. Try again later", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      currPassword: "password123",
      newPassword: "mockNewpassword",
    };
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(new Users(MOCK_USERS[1]));
    jest
      .spyOn(UserService.prototype, "updateUserPassword")
      .mockReturnValue(false);

    const response = await request(app)
      .put("/api/users/me/password")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: Messages.SOMETHING_WENT_WRONG,
      statusCode: 500,
      error: STATUS_CODES[500],
    });
  });

  it("500 - Unexpected Error", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      currPassword: "password123",
      newPassword: "mockNewpassword",
    };
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(new Users(MOCK_USERS[1]));
    jest
      .spyOn(UserService.prototype, "updateUserPassword")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await request(app)
      .put("/api/users/me/password")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(500);
  });

  it("200 - User password updated", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      currPassword: "password123",
      newPassword: "mockNewpassword",
    };
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(new Users(MOCK_USERS[1]));
    jest
      .spyOn(UserService.prototype, "updateUserPassword")
      .mockResolvedValue(true);

    const response = await request(app)
      .put("/api/users/me/password")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
});

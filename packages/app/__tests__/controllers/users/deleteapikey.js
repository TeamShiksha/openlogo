const request = require("supertest");
const { STATUS_CODES } = require("http");
const { Users } = require("../../../models");
const { MOCK_USERS } = require("../../../utils/mocks");
const { mongoose } = require("mongoose");
const { UserService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("Destroy User Key", () => {
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

  it.skip("404 - Invalid Key", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const keyId = new mongoose.Types.ObjectId().toString();

    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(UserService.prototype, "destroyUserKey")
      .mockResolvedValue(false);

    const response = await request(app)
      .delete(`/api/user/api-key/${keyId}`)
      .set("Cookie", `jwt=${mockToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: Messages.INVALID_KEY,
      statusCode: STATUS_CODES[404],
    });
  });

  it.skip("404 - User not found", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const keyId = new mongoose.Types.ObjectId().toString();

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/user/api-key/${keyId}`)
      .set("Cookie", `jwt=${mockToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: Messages.USER_NOT_FOUND,
      error: STATUS_CODES[404],
    });
  });

  it.skip("500 - Unexpected Error", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const keyId = new mongoose.Types.ObjectId().toString();

    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(UserService.prototype, "destroyUserKey")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await request(app)
      .delete(`/api/user/api-key/${keyId}`)
      .set("Cookie", `jwt=${mockToken}`);

    expect(response.status).toBe(500);
  });

  it.skip("200 - Key Destroyed", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const keyId = new mongoose.Types.ObjectId().toString();

    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest.spyOn(UserService.prototype, "destroyUserKey").mockResolvedValue(true);

    const response = await request(app)
      .delete(`/api/user/api-key/${keyId}`)
      .set("Cookie", `jwt=${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
});

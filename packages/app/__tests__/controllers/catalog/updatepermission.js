const request = require("supertest");
const { STATUS_CODES } = require("http");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const { Users } = require("../../../models");
const { UserService } = require("../../../services");

const app = require("../../../server");

describe("PUT  /permission/:userId/roles/:role ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  it.skip("422 - Email is not valid", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockToken = mockUserModel.generateJWT();

    const response = await request(app)
      .put(
        `/api/catalog/permission/${mockUserModel._id}/roles/${mockUserModel.role}`
      )
      .set("Cookie", `jwt=${mockToken}`)
      .send({ email: "not-an-email" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "Invalid email",
      error: STATUS_CODES[422],
    });
  });

  it.skip("422 - Email is required", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockToken = mockUserModel.generateJWT();

    const response = await request(app)
      .put(
        `/api/catalog/permission/${mockUserModel._id}/roles/${mockUserModel.role}`
      )
      .set("Cookie", `jwt=${mockToken}`)
      .send({});

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "Email is required",
      error: STATUS_CODES[422],
    });
  });

  it.skip("404 - User not found", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockUpdateUser = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(mockUserModel);
    jest
      .spyOn(UserService.prototype, "updateUserToAdmin")
      .mockResolvedValue(false);

    const response = await request(app)
      .put(
        `/api/catalog/permission/${mockUserModel._id}/roles/${mockUserModel.role}`
      )
      .set("Cookie", `jwt=${mockToken}`)
      .send({ email: mockUpdateUser.email });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: Messages.USER_NOT_FOUND,
      error: STATUS_CODES[404],
    });
  });

  it.skip("200 - User role updated to admin", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockUpdateUser = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(mockUserModel);
    jest
      .spyOn(UserService.prototype, "updateUserToAdmin")
      .mockResolvedValue(mockUpdateUser);

    const response = await request(app)
      .put(
        `/api/catalog/permission/${mockUserModel._id}/roles/${mockUserModel.role}`
      )
      .set("Cookie", `jwt=${mockToken}`)
      .send({ email: mockUpdateUser.email });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });

  it.skip("500 - Internal server error", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockUpdateUser = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(mockUserModel);
    jest
      .spyOn(UserService.prototype, "updateUserToAdmin")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await request(app)
      .put(
        `/api/catalog/permission/${mockUserModel._id}/roles/${mockUserModel.role}`
      )
      .set("Cookie", `jwt=${mockToken}`)
      .send({ email: mockUpdateUser.email });

    expect(response.status).toBe(500);
  });
});

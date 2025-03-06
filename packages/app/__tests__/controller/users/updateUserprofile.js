const request = require("supertest");
const { STATUS_CODES } = require("http");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Users } = require("../../../models");
const { UserService } = require("../../../services");
const app = require("../../../server");

describe("Update User Profile", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_UR;
  });

  it("422 - First name must be a string", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = { name: 232323 };

    const response = await request(app)
      .patch("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "First name must be string",
      error: STATUS_CODES[422],
    });
  });

  it("422 - First name cannot be empty", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      name: "",
    };

    const response = await request(app)
      .patch("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: '"name" is not allowed to be empty',
      error: STATUS_CODES[422],
    });
  });

  it("422 - First name length must be 20 or fewer", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      name: "ijenxjienidxkjnxwnkjxnwkjxwnjkxnjkxnorc",
    };

    const response = await request(app)
      .patch("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "First name length must be 20 or fewer",
      error: STATUS_CODES[422],
    });
  });

  it("422 - First name should only contain alphabets", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      name: "name@1234",
    };

    const response = await request(app)
      .patch("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "First name should only contain alphabets",
      error: STATUS_CODES[422],
    });
  });

  it("404 - User not found", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      name: "Mockname",
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .patch("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: "User not found",
      error: STATUS_CODES[404],
    });
  });

  it("500 - Failed to update profile", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      name: "Mockname",
    };
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest.spyOn(UserService.prototype, "updateUser").mockReturnValue(false);

    const response = await request(app)
      .patch("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      message: "Failed to update profile",
      error: STATUS_CODES[500],
    });
  });

  it("200 - User profile updated", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      name: "Mockname",
    };
    const mockUpdatedResponse = { ...MOCK_USERS[1], name: mockInput.name };
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(UserService.prototype, "updateUser")
      .mockResolvedValue(mockUpdatedResponse);

    const response = await request(app)
      .patch("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
  });
});

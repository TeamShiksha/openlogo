const request = require("supertest");
const { Users } = require("../../../models");
const { UserService, KeyService } = require("../../../services");
const app = require("../../../server");
const { MOCK_USERS, MOCK_KEYS } = require("../../../utils/mocks");

describe("Update User Old Keys", () => {
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

  it("404 - User not found", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      key_description: MOCK_KEYS[2].key_description,
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .post("/api/user/update-oldKeys")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });

  it("200 - should return true when keys are successfully updated", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockUser = {
      ...MOCK_USERS[1],
      keys: MOCK_KEYS[3]._id,
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockUser);

    jest
      .spyOn(KeyService.prototype, "findUpdateKeyWithoutExpiry")
      .mockResolvedValue(true);

    const response = await request(app)
      .get("/api/user/update-oldKeys")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockUser.keys);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      keysUpdated: true,
    });
  });

  it("200 - should return false when no keys need updating", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockUser = {
      ...MOCK_USERS[1],
      keys: MOCK_KEYS[2]._id,
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockUser);

    jest
      .spyOn(KeyService.prototype, "findUpdateKeyWithoutExpiry")
      .mockResolvedValue(false);

    const response = await request(app)
      .get("/api/user/update-oldKeys")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockUser.keys);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      keysUpdated: false,
    });
  });
});

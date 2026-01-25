const request = require("supertest");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Users } = require("../../../models");
const { UserService } = require("../../../services");
const app = require("../../../server");

describe("Delete User Account", () => {
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

  it.skip("500 - Unexpected Error", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = { userId: "mockUserId@123" };

    // Spy on the actual function used in controller
    jest
      .spyOn(UserService.prototype, "markDeleteUser")
      .mockImplementation(() => {
        throw new Error("Unexpected error");
      });

    const response = await request(app)
      .delete("/api/user/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(500);
  });

  it.skip("200 - User account deleted", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = { userId: "mockUserId@123" };

    // Spy on markDeleteUser function
    jest.spyOn(UserService.prototype, "markDeleteUser").mockResolvedValue(true);

    const response = await request(app)
      .delete("/api/user/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(200);

    const setCookieHeader = response.headers["set-cookie"];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/jwt=;/);
  });
});

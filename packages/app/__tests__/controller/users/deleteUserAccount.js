const request = require("supertest");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Users } = require("../../../models");
const { UserService } = require("../../../services");
const app = require("../../../server");

describe("Delete User Account", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "http://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  it("200- User account deleted", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      userId: "mockUserId@123",
    };
    jest
      .spyOn(UserService.prototype, "deleteUserAccount")
      .mockReturnValue(true);

    const response = await request(app)
      .delete("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(200);
  });
});

const request = require("supertest");
const { STATUS_CODES } = require("http");
const { UserService, ImageService } = require("../../../services");
const mongoose = require("mongoose");
const { Users, Images } = require("../../../models");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("GET /api/catalog/logos", () => {
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
    const mockAdmin = new Users(MOCK_USERS[2]); // ADMIN
    const token = mockAdmin.generateJWT();

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const res = await request(app)
      .get("/api/catalog/logos")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      statusCode: 404,
      error: STATUS_CODES[404],
      message: Messages.USER_NOT_FOUND,
    });
  });

  it("200 - No images found", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockAdmin);
    jest
      .spyOn(ImageService.prototype, "getImagesByUserId")
      .mockResolvedValue([]);

    const res = await request(app)
      .get("/api/catalog/logos")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      data: [],
    });
  });

  it("200 - Images returned", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    const mockImage = new Images({
      _id: new mongoose.Types.ObjectId(),
      user_id: mockAdmin._id,
      company_name: "GOOGLE.png",
      company_uri: "https://example.com/google",
      image_size: 1024,
      is_deleted: false,
      updated_at: new Date(),
    });

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockAdmin);
    jest
      .spyOn(ImageService.prototype, "getImagesByUserId")
      .mockResolvedValue([mockImage]);

    const res = await request(app)
      .get("/api/catalog/logos")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      data: [expect.objectContaining({ company_name: "GOOGLE.png" })],
    });
  });

  it("500 - Unexpected error", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    jest.spyOn(UserService.prototype, "getUser").mockImplementation(() => {
      throw new Error("fail");
    });

    const res = await request(app)
      .get("/api/catalog/logos")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(500);
  });
});

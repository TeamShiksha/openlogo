const request = require("supertest");
const { ImageService } = require("../../../services");
const { Users } = require("../../../models");
const { STATUS_CODES } = require("http");
const app = require("../../../server");
const { MOCK_USERS, MOCK_IMAGES } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");

describe("PUT /api/catalog/logoMetadata", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-key";
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
    process.env.KEY = "logos";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
    delete process.env.KEY;
  });

  it("Should return 404 if pre existing image metadata not found, for admin", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();
    jest.spyOn(ImageService.prototype, "getImageById").mockResolvedValue(null);
    const res = await request(app)
      .put("/api/catalog/logoMetadata")
      .set("Cookie", `jwt=${token}`)
      .send({ id: "615f1b5e6b1f1c3f8a123456" });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      error: STATUS_CODES[404],
      statusCode: 404,
      message: Messages.IMAGE_NOT_EXIST,
    });
  });

  it("should return 500 if image update throws error", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    const mockPreviousImage = MOCK_IMAGES[0];

    jest
      .spyOn(ImageService.prototype, "getImageById")
      .mockResolvedValue(mockPreviousImage);

    jest
      .spyOn(ImageService.prototype, "updateImageById")
      .mockRejectedValue(new Error("Database update failed"));

    const res = await request(app)
      .put("/api/catalog/logoMetadata")
      .set("Cookie", `jwt=${token}`)
      .send({
        id: MOCK_IMAGES[0]._id.toString(),
        companyUri: "https://www.google.com",
        extension: "jpg",
        size: 2048,
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(500);
  });

  it("Should return 200 if Image Updates", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    const mockPreviousImage = MOCK_IMAGES[0];

    jest
      .spyOn(ImageService.prototype, "getImageById")
      .mockResolvedValue(mockPreviousImage);

    jest.spyOn(ImageService.prototype, "updateImageById").mockResolvedValue({
      _id: MOCK_IMAGES[0]._id,
      updatedAt: new Date(),
    });

    const updatePayload = {
      id: MOCK_IMAGES[0]._id.toString(),
      companyUri: "https://example.com/google",
      extension: "png",
      size: 1024,
    };

    const res = await request(app)
      .put("/api/catalog/logoMetadata")
      .set("Cookie", `jwt=${token}`)
      .send(updatePayload);

    expect(res.body).toEqual({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: {
        _id: MOCK_IMAGES[0]._id.toString(),
        updatedAt: expect.any(String),
      },
    });
  });
});

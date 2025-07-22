const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ImageService } = require("../../../services");
const { Users, Images } = require("../../../models");
const { MOCK_USERS, MOCK_IMAGES } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("PUT /api/catalog/logo", () => {
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

  it("422 - Image is required", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockToken = mockUserModel.generateJWT();
    const response = await request(app)
      .put("/api/catalog/logo")
      .set("Cookie", `jwt=${mockToken}`)
      .send({ id: "mock-image-id" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: Messages.IMAGE_REQUIRED,
      error: STATUS_CODES[422],
    });
  });

  it("422 - Id is required", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockToken = mockUserModel.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";

    const response = await request(app)
      .put("/api/catalog/logo")
      .set("Cookie", `jwt=${mockToken}`)
      .attach("logo", mockBuffer, mockFileName)
      .field("id", "");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: '"id" is not allowed to be empty',
      error: STATUS_CODES[422],
    });
  });

  it("500 - Upload failed", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockToken = mockUserModel.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";
    const mockImage = new Images(MOCK_IMAGES[0]);

    jest
      .spyOn(ImageService.prototype, "getImageById")
      .mockResolvedValue(mockImage);
    jest.spyOn(ImageService.prototype, "uploadToS3").mockResolvedValue(null);

    const response = await request(app)
      .put("/api/catalog/logo")
      .set("Cookie", `jwt=${mockToken}`)
      .attach("logo", mockBuffer, mockFileName)
      .field("id", mockImage._id.toString());

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      message: Messages.UPLOAD_FAILED,
      error: STATUS_CODES[500],
    });
  });

  it("500 - Image upload failed.", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockToken = mockUserModel.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";
    const mockImage = new Images(MOCK_IMAGES[0]);

    jest
      .spyOn(ImageService.prototype, "getImageById")
      .mockResolvedValue(mockImage);
    jest.spyOn(ImageService.prototype, "uploadToS3").mockResolvedValue(null);

    const response = await request(app)
      .put("/api/catalog/logo")
      .set("Cookie", `jwt=${mockToken}`)
      .attach("logo", mockBuffer, mockFileName)
      .field("id", mockImage._id.toString());

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      message: Messages.UPLOAD_FAILED,
      error: STATUS_CODES[500],
    });
  });

  it("500 - Failed to update image record.", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockToken = mockUserModel.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";
    const mockImage = new Images(MOCK_IMAGES[0]);
    jest
      .spyOn(ImageService.prototype, "getImageById")
      .mockResolvedValue(mockImage);
    jest
      .spyOn(ImageService.prototype, "uploadToS3")
      .mockResolvedValue("logos/png/GOOGLE.png");
    jest
      .spyOn(ImageService.prototype, "updateImageById")
      .mockResolvedValue(null);

    const res = await request(app)
      .put("/api/catalog/logo")
      .set("Cookie", `jwt=${mockToken}`)
      .attach("logo", mockBuffer, mockFileName)
      .field("id", mockImage._id.toString());

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      statusCode: 500,
      message: Messages.UPDATE_IMAGE_FAILED,
      error: STATUS_CODES[500],
    });
  });

  it("200 - Image updated successfully", async () => {
    const mockUserModel = new Users(MOCK_USERS[2]);
    const mockToken = mockUserModel.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";
    const mockImage = new Images(MOCK_IMAGES[0]);
    const mockImageData = {
      _id: mockImage._id.toString(),
      updatedAt: new Date().toISOString(),
    };
    jest
      .spyOn(ImageService.prototype, "getImageById")
      .mockResolvedValue(mockImage);
    jest
      .spyOn(ImageService.prototype, "uploadToS3")
      .mockResolvedValue("logos/png/GOOGLE.png");
    jest
      .spyOn(ImageService.prototype, "updateImageById")
      .mockResolvedValue(mockImageData);

    const response = await request(app)
      .put("/api/catalog/logo")
      .set("Cookie", `jwt=${mockToken}`)
      .attach("logo", mockBuffer, mockFileName)
      .field("id", mockImage._id.toString());

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: mockImageData,
    });
  });
});

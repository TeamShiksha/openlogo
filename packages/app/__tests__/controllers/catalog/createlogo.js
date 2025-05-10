const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ImageService } = require("../../../services");
const { Users } = require("../../../models");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("POST /api/catalog/logo", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
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

  it("500 - S3 upload fails", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]); // Admin user
    const token = mockAdmin.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";

    jest.spyOn(ImageService.prototype, "uploadToS3").mockResolvedValue(null);

    const res = await request(app)
      .post("/api/catalog/logo")
      .set("Cookie", `jwt=${token}`)
      .field("companyUri", "https://validcompany.com/")
      .attach("logo", mockBuffer, mockFileName);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      statusCode: 500,
      message: Messages.UPLOAD_FAILED,
      error: STATUS_CODES[500],
    });
  });

  it("500 - createImageData fails", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]); // Admin user
    const token = mockAdmin.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";

    jest
      .spyOn(ImageService.prototype, "uploadToS3")
      .mockResolvedValue("logos/png/GOOGLE.png");
    jest
      .spyOn(ImageService.prototype, "createImageData")
      .mockResolvedValue(null);

    const res = await request(app)
      .post("/api/catalog/logo")
      .set("Cookie", `jwt=${token}`)
      .field("companyUri", "https://validcompany.com/")
      .attach("logo", mockBuffer, mockFileName);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      statusCode: 500,
      message: Messages.UPDATE_IMAGE_FAILED,
      error: STATUS_CODES[500],
    });
  });

  it("500 - Unexpected exception from uploadToS3", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]); // Admin user
    const token = mockAdmin.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";

    jest.spyOn(ImageService.prototype, "uploadToS3").mockImplementation(() => {
      throw new Error("Boom!");
    });

    const res = await request(app)
      .post("/api/catalog/logo")
      .set("Cookie", `jwt=${token}`)
      .field("companyUri", "https://validcompany.com/")
      .attach("logo", mockBuffer, mockFileName);

    expect(res.status).toBe(500);
  });

  it("200 - Success", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]); // Admin user
    const token = mockAdmin.generateJWT();
    const mockBuffer = Buffer.from("test image");
    const mockFileName = "GOOGLE.png";

    const mockImageData = {
      _id: "mock-image-id",
      updatedAt: new Date().toISOString(),
    };

    jest
      .spyOn(ImageService.prototype, "uploadToS3")
      .mockResolvedValue("logos/png/GOOGLE.png");
    jest
      .spyOn(ImageService.prototype, "createImageData")
      .mockResolvedValue(mockImageData);

    const res = await request(app)
      .post("/api/catalog/logo")
      .set("Cookie", `jwt=${token}`)
      .field("companyUri", "https://validcompany.com/")
      .attach("logo", mockBuffer, mockFileName);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: mockImageData,
    });
  });
});

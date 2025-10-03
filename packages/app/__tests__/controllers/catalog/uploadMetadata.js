const request = require("supertest");
const { ImageService } = require("../../../services");
const { Users } = require("../../../models");
const { STATUS_CODES } = require("http");
const app = require("../../../server");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");

describe("POST /api/catalog/logoMetadata", () => {
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

  it("should return 400 if imageData is not present in response for admin", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();
    jest
      .spyOn(ImageService.prototype, "createImageData")
      .mockResolvedValue(null);

    const res = await request(app)
      .post("/api/catalog/logoMetadata")
      .set("Cookie", `jwt=${token}`)
      .send({
        userId: MOCK_USERS[2],
        companyName: "GOOGLE",
        companyUri: "https://google.com/",
        imageSize: 1024,
        Extension: "png",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.UPDATE_IMAGE_FAILED,
    });
  });

  it("should return 200 if imageData present in response for admin", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();
    jest.spyOn(ImageService.prototype, "createImageData").mockResolvedValue({
      imageData: {
        id: "651f3a8d2b4c9e12f7a9d3f4",
        updatedAt: "2025-10-03T14:27:59.123Z",
      },
    });
    const res = await request(app)
      .post("/api/catalog/logoMetadata")
      .set("Cookie", `jwt=${token}`)
      .send({
        userId: MOCK_USERS[2],
        companyName: "GOOGLE",
        companyUri: "https://google.com/",
        imageSize: 1024,
        Extension: "png",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: {
        imageData: {
          id: "651f3a8d2b4c9e12f7a9d3f4",
          updatedAt: "2025-10-03T14:27:59.123Z",
        },
      },
    });
  });

  it("should return 400 if imageData is not present in response for operator", async () => {
    const mockAdmin = new Users(MOCK_USERS[3]);
    const token = mockAdmin.generateJWT();
    jest
      .spyOn(ImageService.prototype, "createImageData")
      .mockResolvedValue(null);

    const res = await request(app)
      .post("/api/catalog/logoMetadata")
      .set("Cookie", `jwt=${token}`)
      .send({
        userId: MOCK_USERS[2],
        companyName: "GOOGLE",
        companyUri: "https://google.com/",
        imageSize: 1024,
        Extension: "png",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.UPDATE_IMAGE_FAILED,
    });
  });

  it("should return 200 if imageData present in response for operator", async () => {
    const mockAdmin = new Users(MOCK_USERS[3]);
    const token = mockAdmin.generateJWT();
    jest.spyOn(ImageService.prototype, "createImageData").mockResolvedValue({
      imageData: {
        id: "651f3a8d2b4c9e12f7a9d3f4",
        updatedAt: "2025-10-03T14:27:59.123Z",
      },
    });
    const res = await request(app)
      .post("/api/catalog/logoMetadata")
      .set("Cookie", `jwt=${token}`)
      .send({
        userId: MOCK_USERS[2],
        companyName: "GOOGLE",
        companyUri: "https://google.com/",
        imageSize: 1024,
        Extension: "png",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: {
        imageData: {
          id: "651f3a8d2b4c9e12f7a9d3f4",
          updatedAt: "2025-10-03T14:27:59.123Z",
        },
      },
    });
  });
});

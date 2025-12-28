jest.mock("../../../utils/webLogoSearch.js", () => ({
  grabCompanyLogos: jest.fn(),
}));

const request = require("supertest");
const { UserService, ImageService } = require("../../../services");
const mongoose = require("mongoose");
const { Users } = require("../../../models");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");
const { grabCompanyLogos } = require("../../../utils/webLogoSearch.js");

describe("GET /api/catalog/logos", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });

  beforeEach(() => {
    jest.clearAllMocks();
    grabCompanyLogos.mockResolvedValue({ success: false, logos: [] });
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  it("404 - User not found", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const res = await request(app)
      .get("/api/catalog/logos")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "Not Found",
      statusCode: 404,
      message: Messages.USER_NOT_FOUND,
    });
  });

  it("404 - ADMIN - No images found in DB and web search fails", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockAdmin);
    jest.spyOn(ImageService.prototype, "getImages").mockResolvedValue({
      data: [],
      total: 0,
      currentPage: 1,
      totalPages: 0,
    });
    grabCompanyLogos.mockResolvedValue({ success: false, logos: [] });

    const res = await request(app)
      .get("/api/catalog/logos?search=NonExistent")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "Not Found",
      statusCode: 404,
      message: Messages.LOGO_NOT_FOUND,
    });
  });

  it("200 - ADMIN - Images returned from DB", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    const mockImage = {
      _id: new mongoose.Types.ObjectId(),
      user_id: mockAdmin._id,
      company_name: "GOOGLE.png",
      company_uri: "https://example.com/google",
      image_size: 1024,
      is_deleted: false,
      updated_at: new Date().toISOString(),
    };

    const imageData = {
      data: [mockImage],
      total: 1,
      currentPage: 1,
      totalPages: 1,
    };

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockAdmin);
    jest
      .spyOn(ImageService.prototype, "getImages")
      .mockResolvedValue(imageData);

    const res = await request(app)
      .get("/api/catalog/logos")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      data: expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            company_name: "GOOGLE.png",
            company_uri: "https://example.com/google",
          }),
        ]),
        total: 1,
      }),
      source: "db-search",
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

  it("200 - OPERATOR - Image exists in DB", async () => {
    const mockOperator = new Users(MOCK_USERS[3]);
    const token = mockOperator.generateJWT();

    const mockImage = {
      _id: new mongoose.Types.ObjectId(),
      user_id: mockOperator._id,
      company_name: "EXAMPLE.png",
      company_uri: "https://example.com",
      image_size: 2048,
      is_deleted: false,
      updated_at: new Date(),
    };

    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(mockOperator);
    jest.spyOn(ImageService.prototype, "getImages").mockResolvedValue({
      data: [mockImage],
      total: 1,
      currentPage: 1,
      totalPages: 1,
    });

    const res = await request(app)
      .get("/api/catalog/logos?search=example")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      data: {
        imagesExist: true,
        images: [],
      },
      source: "db-search",
    });
  });

  it("200 - ADMIN - Web search returns logos when DB empty", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockAdmin);
    jest.spyOn(ImageService.prototype, "getImages").mockResolvedValue({
      data: [],
      total: 0,
      currentPage: 1,
      totalPages: 0,
    });

    grabCompanyLogos.mockResolvedValue({
      success: true,
      logos: [
        {
          companyName: "TestCompany",
          url: "https://logo.png",
          companyUri: "https://testcompany.com/",
          extension: "png",
          size: 1024,
        },
        {
          companyName: "TestCompany",
          url: "https://logo2.png",
          companyUri: "https://testcompany.com/",
          extension: "png",
          size: 2048,
        },
      ],
    });

    const res = await request(app)
      .get("/api/catalog/logos?search=TestCompany")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      source: "web-search",
      data: [
        {
          bufferBase64: "",
          companyName: "TestCompany",
          url: "https://logo.png",
          companyUri: "https://testcompany.com/",
          extension: "png",
          mimeType: "",
          size: 1024,
        },
        {
          bufferBase64: "",
          companyName: "TestCompany",
          url: "https://logo2.png",
          companyUri: "https://testcompany.com/",
          extension: "png",
          mimeType: "",
          size: 2048,
        },
      ],
    });
  });
  it("200 - OPERATOR - Web search returns logos when DB empty", async () => {
    const mockAdmin = new Users(MOCK_USERS[3]);
    const token = mockAdmin.generateJWT();

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockAdmin);
    jest.spyOn(ImageService.prototype, "getImages").mockResolvedValue({
      data: [],
      total: 0,
      currentPage: 1,
      totalPages: 0,
    });

    grabCompanyLogos.mockResolvedValue({
      success: true,
      logos: [
        {
          companyName: "TestCompany",
          url: "https://logo.png",
          companyUri: "https://testcompany.com/",
          extension: "png",
          size: 1024,
        },
        {
          companyName: "TestCompany",
          url: "https://logo2.png",
          companyUri: "https://testcompany.com/",
          extension: "png",
          size: 2048,
        },
      ],
    });

    const res = await request(app)
      .get("/api/catalog/logos?search=TestCompany")
      .set("Cookie", `jwt=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      source: "web-search",
      data: [
        {
          bufferBase64: "",
          companyName: "TestCompany",
          url: "https://logo.png",
          companyUri: "https://testcompany.com/",
          extension: "png",
          mimeType: "",
          size: 1024,
        },
        {
          bufferBase64: "",
          companyName: "TestCompany",
          url: "https://logo2.png",
          companyUri: "https://testcompany.com/",
          extension: "png",
          mimeType: "",
          size: 2048,
        },
      ],
    });
  });
});

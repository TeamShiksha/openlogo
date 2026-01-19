const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../../server");
const { Users } = require("../../../models");
const {
  ImageService,
  RequestService,
  CreateLogoService,
} = require("../../../services");
const { MOCK_USERS, MOCK_IMAGES } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");

describe("POST /api/create-logo/logo - Add Create Logo", () => {
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

  const validRequestBody = {
    companyUrl: "https://testcompany.com/",
    size: 1024,
    extension: "png",
  };

  it("should return 500 if companyUrl validation fails", async () => {
    const mockUser = new Users(MOCK_USERS[1]);
    const token = mockUser.generateJWT();

    const res = await request(app)
      .post("/api/create-logo/logo")
      .set("Cookie", `jwt=${token}`)
      .send({ companyUrl: "invalid-uri", size: 1024, extension: "png" });

    expect(res.statusCode).toEqual(500);
    expect(res.body.statusCode).toEqual(500);
  });

  it("should return 400 if image already exists for the company", async () => {
    const mockUser = new Users(MOCK_USERS[1]);
    const token = mockUser.generateJWT();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(MOCK_IMAGES[0]);

    const res = await request(app)
      .post("/api/create-logo/logo")
      .set("Cookie", `jwt=${token}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.IMAGE_ALREADY_EXISTS,
    });
  });

  it("should return 400 if company URL already has a pending request", async () => {
    const mockUser = new Users(MOCK_USERS[1]);
    const token = mockUser.generateJWT();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);
    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue({ companyUrl: "https://testcompany.com/" });

    const res = await request(app)
      .post("/api/create-logo/logo")
      .set("Cookie", `jwt=${token}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.COMPANY_URL_ALREADY_PENDING,
    });
  });

  it("should return 400 if logo already created and pending", async () => {
    const mockUser = new Users(MOCK_USERS[1]);
    const token = mockUser.generateJWT();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);
    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue(null);
    jest
      .spyOn(CreateLogoService.prototype, "findPendingRequestByCompanyUrl")
      .mockResolvedValue({ companyUrl: "https://testcompany.com/" });

    const res = await request(app)
      .post("/api/create-logo/logo")
      .set("Cookie", `jwt=${token}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.LOGO_ALREADY_CREATED_AND_PENDING,
    });
  });

  it("should return 500 if image data creation fails", async () => {
    const mockUser = new Users(MOCK_USERS[1]);
    const token = mockUser.generateJWT();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);
    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue(null);
    jest
      .spyOn(CreateLogoService.prototype, "findPendingRequestByCompanyUrl")
      .mockResolvedValue(null);
    jest
      .spyOn(ImageService.prototype, "createImageData")
      .mockResolvedValue(null);

    const res = await request(app)
      .post("/api/create-logo/logo")
      .set("Cookie", `jwt=${token}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      error: STATUS_CODES[500],
      statusCode: 500,
      message: Messages.UPDATE_IMAGE_FAILED,
    });
  });

  it("should return 200 on successful logo creation", async () => {
    const mockUser = new Users(MOCK_USERS[1]);
    const token = mockUser.generateJWT();

    const mockImageData = { _id: "image123" };
    const mockCreateLogoData = { _id: "createLogo123" };

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);
    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue(null);
    jest
      .spyOn(CreateLogoService.prototype, "findPendingRequestByCompanyUrl")
      .mockResolvedValue(null);
    jest
      .spyOn(ImageService.prototype, "createImageData")
      .mockResolvedValue(mockImageData);
    jest
      .spyOn(CreateLogoService.prototype, "addLogoData")
      .mockResolvedValue(mockCreateLogoData);

    const res = await request(app)
      .post("/api/create-logo/logo")
      .set("Cookie", `jwt=${token}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: mockCreateLogoData,
    });
  });

  it("should return 401 if no auth token provided", async () => {
    const res = await request(app)
      .post("/api/create-logo/logo")
      .send(validRequestBody);

    expect(res.statusCode).toEqual(401);
  });
});

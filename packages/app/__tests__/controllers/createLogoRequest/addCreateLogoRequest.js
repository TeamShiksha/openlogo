const request = require("supertest");
const { STATUS_CODES } = require("node:http");
const app = require("../../../server");
const { Users } = require("../../../models");
const {
  ImageService,
  RequestService,
  CreateLogoRequestService,
  UserSessionService,
  UserService,
} = require("../../../services");
const {
  MOCK_USERS,
  MOCK_IMAGES,
  MOCK_USER_SESSIONS,
  MOCK_SESSION_ID,
} = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");

describe("POST /api/create-logo-request/logo - Add Create Logo Request", () => {
  beforeAll(() => {
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
    process.env.KEY = "logos";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.CLIENT_PROXY_URL;
    delete process.env.KEY;
  });

  const validRequestBody = {
    companyUrl: "https://testcompany.com/",
    size: 1024,
    extension: "png",
  };

  /**
   * Helper to mock valid session + user
   */
  const mockValidSession = (userIndex = 1) => {
    const mockUser = new Users(MOCK_USERS[userIndex]);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[userIndex]);

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockUser);
  };

  it("should return 500 if companyUrl validation fails", async () => {
    mockValidSession();

    const res = await request(app)
      .post("/api/create-logo-request/logo")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ companyUrl: "invalid-uri", size: 1024, extension: "png" });

    expect(res.statusCode).toEqual(500);
    expect(res.body.statusCode).toEqual(500);
  });

  it("should return 400 if image already exists for the company", async () => {
    mockValidSession();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(MOCK_IMAGES[0]);

    const res = await request(app)
      .post("/api/create-logo-request/logo")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.IMAGE_ALREADY_EXISTS,
    });
  });

  it("should return 400 if company URL already has a pending request", async () => {
    mockValidSession();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);

    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue({ companyUrl: "https://testcompany.com/" });

    const res = await request(app)
      .post("/api/create-logo-request/logo")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.COMPANY_URL_ALREADY_PENDING,
    });
  });

  it("should return 400 if logo already created and pending", async () => {
    mockValidSession();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);

    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue(null);

    jest
      .spyOn(
        CreateLogoRequestService.prototype,
        "findPendingRequestByCompanyUrl"
      )
      .mockResolvedValue({ companyUrl: "https://testcompany.com/" });

    const res = await request(app)
      .post("/api/create-logo-request/logo")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.LOGO_ALREADY_CREATED_AND_PENDING,
    });
  });

  it("should return 500 if image data creation fails", async () => {
    mockValidSession();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);

    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue(null);

    jest
      .spyOn(
        CreateLogoRequestService.prototype,
        "findPendingRequestByCompanyUrl"
      )
      .mockResolvedValue(null);

    jest
      .spyOn(ImageService.prototype, "createImageData")
      .mockResolvedValue(null);

    const res = await request(app)
      .post("/api/create-logo-request/logo")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual({
      error: STATUS_CODES[500],
      statusCode: 500,
      message: Messages.UPDATE_IMAGE_FAILED,
    });
  });

  it("should return 200 on successful logo creation", async () => {
    mockValidSession();

    const mockImageData = { _id: "image123" };
    const mockCreateLogoData = { _id: "createLogo123" };

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);

    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue(null);

    jest
      .spyOn(
        CreateLogoRequestService.prototype,
        "findPendingRequestByCompanyUrl"
      )
      .mockResolvedValue(null);

    jest
      .spyOn(ImageService.prototype, "createImageData")
      .mockResolvedValue(mockImageData);

    jest
      .spyOn(CreateLogoRequestService.prototype, "addLogoData")
      .mockResolvedValue(mockCreateLogoData);

    const res = await request(app)
      .post("/api/create-logo-request/logo")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(validRequestBody);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: mockCreateLogoData,
    });
  });

  it("should return 401 if no session provided", async () => {
    const res = await request(app)
      .post("/api/create-logo-request/logo")
      .send(validRequestBody);

    expect(res.statusCode).toEqual(401);
  });
});

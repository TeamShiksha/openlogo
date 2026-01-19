const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { Messages, StatusTypes } = require("../../../utils/constants");
const app = require("../../../server");
const { RequestService, CreateLogoService } = require("../../../services");
const { default: mongoose } = require("mongoose");

jest.mock("../../../middlewares/auth", () =>
  jest.fn(() => (req, res, next) => {
    req.userData = { userId: "mock-operator-id" };
    next();
  })
);

describe("POST : /api/requests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("422 - Company URL is required", async () => {
    const response = await request(app).post(ENDPOINTS.REQUESTS).send({});

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Company URL is required",
    });
  });
  it("422 - company url should be a valid url", async () => {
    const response = await request(app).post(ENDPOINTS.REQUESTS).send({
      companyUrl: "123@com",
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Please enter a valid URL",
    });
  });
  it("400 - user already has a pending request", async () => {
    jest
      .spyOn(RequestService.prototype, "requestExistsForUser")
      .mockResolvedValue(true);

    const response = await request(app).post(ENDPOINTS.REQUESTS).send({
      companyUrl: "https://google.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: Messages.USER_ALREADY_HAS_PENDING,
      statusCode: 400,
      error: STATUS_CODES[400],
    });
  });
  it("400 - Company URL already has a pending request", async () => {
    jest
      .spyOn(RequestService.prototype, "requestExistsForUser")
      .mockResolvedValue(false);
    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue(true);

    const response = await request(app).post(ENDPOINTS.REQUESTS).send({
      companyUrl: "https://google.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: Messages.COMPANY_URL_ALREADY_PENDING,
      statusCode: 400,
      error: STATUS_CODES[400],
    });
  });
  it("201 - logo request created successfully", async () => {
    const mockRequest = {
      _id: new mongoose.Types.ObjectId().toString(),
      user_id: new mongoose.Types.ObjectId().toString(),
      companyUrl: "https://google.com",
      status: StatusTypes.PENDING,
      operator: null,
      comment: null,
    };
    jest
      .spyOn(RequestService.prototype, "requestExistsForUser")
      .mockResolvedValue(false);
    jest
      .spyOn(RequestService.prototype, "requestExistsForCompanyUrl")
      .mockResolvedValue(false);
    jest
      .spyOn(CreateLogoService.prototype, "findPendingRequestByCompanyUrl")
      .mockResolvedValue(false);
    jest
      .spyOn(RequestService.prototype, "createRaiseRequest")
      .mockResolvedValue(mockRequest);

    const response = await request(app).post(ENDPOINTS.REQUESTS).send({
      companyUrl: "https://google.com",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      statusCode: 201,
      message: Messages.LOGO_REQUEST_CREATED,
      data: mockRequest,
    });
  });
});

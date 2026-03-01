const request = require("supertest");
const { STATUS_CODES } = require("node:http");
const app = require("../../../server");
const { Users } = require("../../../models");
const {
  CreateLogoRequestService,
  UserSessionService,
  UserService,
} = require("../../../services");
const {
  MOCK_USERS,
  MOCK_USER_SESSIONS,
  MOCK_SESSION_ID,
} = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");

describe("PUT /api/create-logo-request/:createLogoId - Update Create Logo Request", () => {
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

  const mockCreateLogoId = "507f1f77bcf86cd799439011";

  /**
   * Helper to mock valid session + user
   */
  const mockValidSession = (userIndex) => {
    const mockUser = new Users(MOCK_USERS[userIndex]);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[userIndex]);

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockUser);

    return mockUser;
  };

  it("should return 422 if validation fails for invalid status", async () => {
    mockValidSession(2); // ADMIN

    const res = await request(app)
      .put(`/api/create-logo-request/${mockCreateLogoId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ status: "INVALID_STATUS", comment: "test" });

    expect(res.statusCode).toEqual(422);
    expect(res.body.error).toEqual(STATUS_CODES[422]);
  });

  it("should return 404 if created logo not found", async () => {
    mockValidSession(2); // ADMIN

    jest
      .spyOn(CreateLogoRequestService.prototype, "getLogoById")
      .mockResolvedValue(null);

    const res = await request(app)
      .put(`/api/create-logo-request/${mockCreateLogoId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ status: "RESOLVED", comment: "Approved" });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      statusCode: 404,
      error: STATUS_CODES[404],
      message: Messages.CREATED_LOGO_NOT_FOUND,
    });
  });

  it("should return 409 if logo request already processed", async () => {
    mockValidSession(2); // ADMIN

    const mockCreatedLogo = {
      _id: mockCreateLogoId,
      companyUrl: "https://testcompany.com/",
      openedAt: new Date(),
    };

    jest
      .spyOn(CreateLogoRequestService.prototype, "getLogoById")
      .mockResolvedValue(mockCreatedLogo);

    jest
      .spyOn(CreateLogoRequestService.prototype, "respondToLogo")
      .mockResolvedValue({ alreadyProcessed: true });

    const res = await request(app)
      .put(`/api/create-logo-request/${mockCreateLogoId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ status: "RESOLVED", comment: "Approved" });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual({
      statusCode: 409,
      error: STATUS_CODES[409],
      message: Messages.LOGO_REQUEST_ALREADY_PROCESSED,
    });
  });

  it("should return 200 on successful update", async () => {
    mockValidSession(2); // ADMIN

    const mockCreatedLogo = {
      _id: mockCreateLogoId,
      companyUrl: "https://testcompany.com/",
      openedAt: new Date("2025-01-01"),
    };

    jest
      .spyOn(CreateLogoRequestService.prototype, "getLogoById")
      .mockResolvedValue(mockCreatedLogo);

    jest
      .spyOn(CreateLogoRequestService.prototype, "respondToLogo")
      .mockResolvedValue({ modifiedCount: 1 });

    const res = await request(app)
      .put(`/api/create-logo-request/${mockCreateLogoId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ status: "RESOLVED", comment: "Approved" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.statusCode).toEqual(200);
    expect(res.body.message).toEqual(Messages.UPDATE_SUCCESS);
    expect(res.body.data).toMatchObject({
      companyUrl: "https://testcompany.com/",
      status: "RESOLVED",
      comment: "Approved",
    });
  });

  it("should return 401 for unauthenticated request", async () => {
    const res = await request(app)
      .put(`/api/create-logo-request/${mockCreateLogoId}`)
      .send({ status: "RESOLVED", comment: "Approved" });

    expect(res.statusCode).toEqual(401);
  });

  it("should return 401 for customer role (not authorized)", async () => {
    mockValidSession(1); // CUSTOMER

    const res = await request(app)
      .put(`/api/create-logo-request/${mockCreateLogoId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ status: "RESOLVED", comment: "Approved" });

    expect(res.statusCode).toEqual(401);
  });
});

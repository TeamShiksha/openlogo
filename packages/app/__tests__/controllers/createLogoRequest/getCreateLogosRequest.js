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

describe("GET /api/create-logo-request - Get Create Logo Request", () => {
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

  /**
   * Helper: mock valid session + user
   */
  const mockValidSession = (userIndex) => {
    const mockUser = new Users(MOCK_USERS[userIndex]);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[userIndex]);

    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockUser);

    return mockUser;
  };

  it("should return 422 if invalid query params provided", async () => {
    mockValidSession(2); // ADMIN

    const res = await request(app)
      .get("/api/create-logo-request?page=invalid&limit=abc")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.error).toEqual(STATUS_CODES[422]);
  });

  it("should return 200 with empty results when no logos exist", async () => {
    mockValidSession(2); // ADMIN

    jest
      .spyOn(CreateLogoRequestService.prototype, "getPaginatedCreateLogos")
      .mockResolvedValue({
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 0,
      });

    const res = await request(app)
      .get("/api/create-logo-request?page=1&limit=10&tab=active")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      statusCode: 200,
      message: Messages.FETCH_ALL_REQUESTS,
      total: 0,
      currentPage: 1,
      totalPages: 0,
      results: [],
    });
  });

  it("should return 200 with paginated results", async () => {
    mockValidSession(2); // ADMIN

    const mockData = [
      {
        _id: "logo1",
        companyUrl: "https://company1.com",
        status: "PENDING",
        _doc: {
          _id: "logo1",
          companyUrl: "https://company1.com",
          status: "PENDING",
        },
      },
      {
        _id: "logo2",
        companyUrl: "https://company2.com",
        status: "RESOLVED",
        _doc: {
          _id: "logo2",
          companyUrl: "https://company2.com",
          status: "RESOLVED",
        },
      },
    ];

    jest
      .spyOn(CreateLogoRequestService.prototype, "getPaginatedCreateLogos")
      .mockResolvedValue({
        data: mockData,
        total: 2,
        currentPage: 1,
        totalPages: 1,
      });

    jest
      .spyOn(CreateLogoRequestService.prototype, "getLogoDetails")
      .mockImplementation((id) => {
        return Promise.resolve({
          _id: id,
          previewUrl: `https://cdn.example.com/${id}.png`,
        });
      });

    const res = await request(app)
      .get("/api/create-logo-request?page=1&limit=10&tab=active")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.statusCode).toEqual(200);
    expect(res.body.message).toEqual(Messages.FETCH_ALL_REQUESTS);
    expect(res.body.results).toHaveLength(2);
    expect(res.body.total).toEqual(2);
  });

  it("should return 401 for unauthenticated request", async () => {
    const res = await request(app).get(
      "/api/create-logo-request?page=1&limit=10"
    );

    expect(res.statusCode).toEqual(401);
  });

  it("should return 401 for customer role (not authorized)", async () => {
    mockValidSession(1); // CUSTOMER (assuming index 1 is customer)

    const res = await request(app)
      .get("/api/create-logo-request?page=1&limit=10")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(res.statusCode).toEqual(401);
  });
});

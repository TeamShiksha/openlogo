const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../../server");
const { Users } = require("../../../models");
const { CreateLogoService } = require("../../../services");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");

describe("GET /api/create-logo - Get Create Logos", () => {
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

  it("should return 422 if invalid query params provided", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    const res = await request(app)
      .get("/api/create-logo?page=invalid&limit=abc")
      .set("Cookie", `jwt=${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.error).toEqual(STATUS_CODES[422]);
  });

  it("should return 200 with empty results when no logos exist", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    jest
      .spyOn(CreateLogoService.prototype, "getPaginatedCreateLogos")
      .mockResolvedValue({
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 0,
      });

    const res = await request(app)
      .get("/api/create-logo?page=1&limit=10&tab=active")
      .set("Cookie", `jwt=${token}`);

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
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

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
      .spyOn(CreateLogoService.prototype, "getPaginatedCreateLogos")
      .mockResolvedValue({
        data: mockData,
        total: 2,
        currentPage: 1,
        totalPages: 1,
      });

    jest
      .spyOn(CreateLogoService.prototype, "getLogoDetails")
      .mockImplementation((id) => {
        return Promise.resolve({
          _id: id,
          previewUrl: `https://cdn.example.com/${id}.png`,
        });
      });

    const res = await request(app)
      .get("/api/create-logo?page=1&limit=10&tab=active")
      .set("Cookie", `jwt=${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.statusCode).toEqual(200);
    expect(res.body.message).toEqual(Messages.FETCH_ALL_REQUESTS);
    expect(res.body.results).toHaveLength(2);
    expect(res.body.total).toEqual(2);
  });

  it("should return 401 for unauthenticated request", async () => {
    const res = await request(app).get("/api/create-logo?page=1&limit=10");

    expect(res.statusCode).toEqual(401);
  });

  it("should return 401 for customer role (not authorized)", async () => {
    const mockCustomer = new Users(MOCK_USERS[1]);
    const token = mockCustomer.generateJWT();

    const res = await request(app)
      .get("/api/create-logo?page=1&limit=10")
      .set("Cookie", `jwt=${token}`);

    expect(res.statusCode).toEqual(401);
  });
});

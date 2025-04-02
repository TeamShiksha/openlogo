const request = require("supertest");
const {
  UserService,
  KeyService,
  RequestService,
  SubscriptionService,
  ContactUsService,
} = require("../../../services");
const app = require("../../../server");
const jwt = require("jsonwebtoken");
const {
  MOCK_ANALYTICS_DATA_INPUT,
  MOCK_USERS,
  MOCK_ANALYTICS_DATA_OUTPUT,
} = require("../../../utils/mocks");

jest.mock("jsonwebtoken");

const mockAdminUser = {
  data: {
    email: MOCK_USERS[2].email, // Use the admin's email
    userId: MOCK_USERS[2]._id.toString(), // Convert ObjectId to string
    role: MOCK_USERS[2].role, // Ensure role is ADMIN
  },
};

jwt.verify.mockImplementation(() => mockAdminUser);

describe("GET /api/catalog/stats", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "jwtsecret";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    delete process.env.JWT_SECRET;
  });

  it("200 - Returns analytics data successfully", async () => {
    jest
      .spyOn(UserService.prototype, "getUsersCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT.Users);
    jest
      .spyOn(KeyService.prototype, "getKeysCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT.Keys);
    jest
      .spyOn(RequestService.prototype, "getRequestsCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT.Requests);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscriptionUsageCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT.Hits);
    jest
      .spyOn(ContactUsService.prototype, "getFormsCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT.ContactUs);

    const response = await request(app)
      .get("/api/catalog/stats")
      .set("Cookie", ["jwt=mockValidToken"]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: MOCK_ANALYTICS_DATA_OUTPUT,
    });
  });
});

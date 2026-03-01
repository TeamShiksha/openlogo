const request = require("supertest");
const {
  UserService,
  KeyService,
  RequestService,
  SubscriptionService,
  ContactUsService,
  ImageService,
  UserSessionService,
} = require("../../../services");
const app = require("../../../server");
const {
  MOCK_ANALYTICS_DATA_INPUT,
  MOCK_ANALYTICS_DATA_OUTPUT,
  MOCK_USER_SESSIONS,
  MOCK_SESSION_ID,
} = require("../../../utils/mocks");

describe("GET /api/catalog/stats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("200 - Returns analytics data successfully", async () => {
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[2]); // admin access
    jest
      .spyOn(UserService.prototype, "getUsersCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT[0].value);
    jest
      .spyOn(KeyService.prototype, "getKeysCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT[1].value);
    jest
      .spyOn(RequestService.prototype, "getRequestsCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT[2].value);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscriptionUsageCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT[4].value);
    jest
      .spyOn(ContactUsService.prototype, "getFormsCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT[3].value);

    jest
      .spyOn(ImageService.prototype, "getImagesCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA_INPUT[5].value);

    const response = await request(app)
      .get("/api/catalog/stats")
      .set("Cookie", [`sessionId=${MOCK_SESSION_ID}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: MOCK_ANALYTICS_DATA_OUTPUT,
    });
  });
});

const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../../server");
const { Messages } = require("../../../utils/constants");
const { MOCK_KEYS, MOCK_SUBSCRIPTION } = require("../../../utils/mocks");

const {
  ImageService,
  KeyService,
  SubscriptionService,
} = require("../../../services");

describe("searchLogoController", () => {
  const apiUrl = "/api/logo/search";

  const wrongBaseQuery = {
    API_KEY: "28482DNDO483ND3",
    key: "https://google.com",
  };

  const baseQuery = {
    API_KEY: MOCK_KEYS[1].key,
    key: "https://google.com",
  };

  const mockSubscription = [MOCK_SUBSCRIPTION[0], MOCK_SUBSCRIPTION[1]];

  function mockRepetedService(mockSubscription) {
    const keyServiceMockResolve = MOCK_KEYS[0];

    jest
      .spyOn(KeyService.prototype, "getApiKey")
      .mockResolvedValue({ ...keyServiceMockResolve });

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(mockSubscription);
  }

  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "http://localhost:3000";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  it("should return 422 if query validation fails", async () => {
    const response = await request(app).get(apiUrl).query(wrongBaseQuery);
    expect(response.status).toBe(422);
  });

  it("if API_KEY is invalid it should return 403", async () => {
    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue(null);
    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.INVALID_KEY,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("if usage limit is reached it should return 403", async () => {
    mockRepetedService(mockSubscription[1]);
    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.LIMIT_REACHED,
      error: STATUS_CODES[403],
      statusCode: 403,
    });
  });

  it("if Company not found it should return 404", async () => {
    mockRepetedService(mockSubscription[0]);
    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockResolvedValue([]);

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: Messages.LOGO_NOT_FOUND,
      statusCode: 404,
      error: STATUS_CODES[404],
    });
  });

  it("if Company found it should return 200", async () => {
    mockRepetedService(mockSubscription[0]);

    jest.spyOn(ImageService.prototype, "fetchCompanyList").mockResolvedValue([
      {
        _id: "1234",
        company_name: "GOOGLE",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    jest.spyOn(ImageService.prototype, "getDataList").mockResolvedValue([
      {
        _id: "1234",
        company_name: "GOOGLE",
        image: "https://cdn.myapp.com/png/GOOGLE.png?v=1755253230000",
      },
    ]);

    // Ensure incrementUsageCount is mocked to avoid unhandled error
    jest
      .spyOn(SubscriptionService.prototype, "incrementUsageCount")
      .mockResolvedValue();

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: [
        {
          _id: "1234",
          company_name: "GOOGLE",
          image: "https://cdn.myapp.com/png/GOOGLE.png?v=1755253230000",
        },
      ],
    });
  });

  it("500-unexpected error", async () => {
    mockRepetedService(mockSubscription[0]);

    jest.spyOn(ImageService.prototype, "fetchCompanyList").mockResolvedValue([
      {
        _id: "1234",
        company_name: "GOOGLE",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    jest.spyOn(ImageService.prototype, "getDataList").mockImplementation(() => {
      throw new Error("Boom!");
    });

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(500);
  });
});

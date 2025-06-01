const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { RequestRepository } = require("../../../repositories");
const { Messages } = require("../../../utils/constants");

jest.mock("../../../middlewares/auth", () =>
  jest.fn(() => (req, res, next) => next())
);

jest.mock("../../../repositories", () => ({
  RequestRepository: jest.fn(),
}));

const app = require("../../../server");

describe("GET : /api/requests", () => {
  let mockGetAll;
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAll = jest.fn();
    RequestRepository.mockImplementation(() => ({
      getAll: mockGetAll,
    }));
  });

  it("422 - Page number is required", async () => {
    const response = await request(app).get(ENDPOINTS.REQUESTS);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Page number is required",
    });
  });

  it("422 - Page number must be a number", async () => {
    const response = await request(app).get(ENDPOINTS.REQUESTS).query({
      page: "abc",
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Page number must be a number",
    });
  });

  it("422 - Limit is required", async () => {
    const response = await request(app).get(ENDPOINTS.REQUESTS).query({
      page: 1,
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Limit is required",
    });
  });

  it("422 - Limit must be a number", async () => {
    const response = await request(app).get(ENDPOINTS.REQUESTS).query({
      page: 1,
      limit: "abc",
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Limit must be a number",
    });
  });

  it("500 - unexpected error", async () => {
    mockGetAll.mockImplementation(() => {
      throw new Error("Unexpected Error");
    });

    const response = await request(app).get(ENDPOINTS.REQUESTS).query({
      page: 1,
      limit: 1,
    });

    expect(response.status).toBe(500);
  });

  it("200 - No requests found", async () => {
    mockGetAll.mockResolvedValue({
      data: [],
      total: 10,
      currentPage: 1,
      totalPages: 1,
    });

    const response = await request(app).get(ENDPOINTS.REQUESTS).query({
      page: 1,
      limit: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: Messages.FETCH_ALL_REQUESTS,
      statusCode: 200,
      total: 10,
      currentPage: 1,
      totalPages: 1,
      results: [],
    });
  });

  it("422 - Invalid status value", async () => {
    const response = await request(app).get(ENDPOINTS.REQUESTS).query({
      page: 1,
      limit: 1,
      status: "Inavlid-status",
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Status must be one of PENDING, REJECTED, or RESOLVED",
    });
  });

  it("200 - Get all requests", async () => {
    mockGetAll.mockResolvedValue({
      data: [{ key: "value" }],
      total: 1,
      currentPage: 1,
      totalPages: 1,
    });
    const response = await request(app).get(ENDPOINTS.REQUESTS).query({
      page: 1,
      limit: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      message: Messages.FETCH_ALL_REQUESTS,
      total: 1,
      currentPage: 1,
      totalPages: 1,
      results: [{ key: "value" }],
    });
  });
});

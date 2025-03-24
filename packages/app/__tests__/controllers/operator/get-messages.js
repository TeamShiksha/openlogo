const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { ContactUsRepository } = require("../../../repositories");
const { Messages } = require("../../../utils/constants");

jest.mock("../../../middlewares/auth", () =>
  jest.fn(() => (req, res, next) => next())
);

jest.mock("../../../repositories", () => ({
  ContactUsRepository: jest.fn(),
}));

const app = require("../../../server");

describe("GET MESSAGES API", () => {
  let mockGetAll;
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAll = jest.fn();
    ContactUsRepository.mockImplementation(() => ({
      getAll: mockGetAll,
    }));
  });

  it("422 - Page number is required", async () => {
    const response = await request(app).get(ENDPOINTS.MESSAGES);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Page number is required",
      statusCode: 422,
    });
  });

  it("422 - Page number must be a number", async () => {
    const response = await request(app).get(ENDPOINTS.MESSAGES).query({
      page: "abc",
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Page number must be a number",
      statusCode: 422,
    });
  });

  it("422 - Limit is required", async () => {
    const response = await request(app).get(ENDPOINTS.MESSAGES).query({
      page: 1,
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Limit is required",
      statusCode: 422,
    });
  });

  it("422 - Limit must be a number", async () => {
    const response = await request(app).get(ENDPOINTS.MESSAGES).query({
      page: 1,
      limit: "xyz",
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Limit must be a number",
      statusCode: 422,
    });
  });

  it("200 - No messages found", async () => {
    mockGetAll.mockResolvedValue({
      data: [],
      total: 10,
      currentPage: 1,
      totalPages: 1,
    });

    const response = await request(app).get(ENDPOINTS.MESSAGES).query({
      page: 1,
      limit: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: Messages.FETCH_ALL_MESSAGE,
      statusCode: 200,
      total: 10,
      currentPage: 1,
      totalPages: 1,
      results: [],
    });
  });

  it("200 - Get all messages", async () => {
    mockGetAll.mockResolvedValue({
      data: [{ key: "value" }],
      total: 1,
      currentPage: 1,
      totalPages: 1,
    });

    const response = await request(app).get(ENDPOINTS.MESSAGES).query({
      page: 1,
      limit: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: Messages.FETCH_ALL_MESSAGE,
      statusCode: 200,
      total: 1,
      currentPage: 1,
      totalPages: 1,
      results: [{ key: "value" }],
    });
  });
});

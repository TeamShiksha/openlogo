const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { ContactUsService } = require("../../../services");
const { Messages } = require("../../../utils/constants");

jest.mock("../../../middlewares/auth", () =>
  jest.fn(() => (req, res, next) => {
    req.userData = { userId: "mock-operator-id" };
    next();
  })
);

jest.mock("../../../services", () => ({
  ContactUsService: jest.fn(),
}));

const app = require("../../../server");
const { default: mongoose } = require("mongoose");

describe("RESPOND MESSAGES API", () => {
  let mockGetForm;
  let mockUpdateForm;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetForm = jest.fn();
    mockUpdateForm = jest.fn();
    ContactUsService.mockImplementation(() => ({
      getForm: mockGetForm,
      updateForm: mockUpdateForm,
    }));
  });

  it("422 - Key ID must be a valid MongoDB ObjectId", async () => {
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/invalid-id`)
      .send({
        reply: "This is a valid reply with a minimum of twenty characters",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Key ID must be a valid MongoDB ObjectId",
      statusCode: 422,
    });
  });

  it("422 - Reply is required", async () => {
    const id = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send();

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Reply is required",
      statusCode: 422,
    });
  });

  it("422 - Reply must be a string", async () => {
    const id = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send({ reply: 123 });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Reply must be a string",
      statusCode: 422,
    });
  });

  it("422 - Reply should be at least 20 characters", async () => {
    const id = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send({
        reply: "Short reply",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Reply should be at least 20 characters",
      statusCode: 422,
    });
  });

  it("422 - Reply must be 500 or fewer characters", async () => {
    const id = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send({
        reply: "A".repeat(501),
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Reply must be 500 or fewer characters",
      statusCode: 422,
    });
  });

  it("422 - Reply should only contain alphabets", async () => {
    const id = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send({ reply: "Invalid reply with special #%$ characters" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Reply should only contain alphabets",
      statusCode: 422,
    });
  });
  it("422 - Status is required", async () => {
    const dummyRequestId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${dummyRequestId}`)
      .send({
        reply: "could you provide more details how to use this platform",
      });
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Status is required",
    });
  });
  it("422 - Status must be one of PENDING, REJECTED, or RESOLVED", async () => {
    const dummyRequestId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${dummyRequestId}`)
      .send({
        reply: "could you provide more details how to use this platform",
        status: "CREATED",
      });
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Status must be one of PENDING, REJECTED, or RESOLVED",
    });
  });

  it("404 - Message not found", async () => {
    mockGetForm.mockResolvedValue(null);
    const id = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send({
        reply: "This is a valid reply with a minimum of twenty characters",
        status: "RESOLVED",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.MESSAGE_NOT_FOUND,
      statusCode: 404,
    });
  });

  it("409 - Already replied to message", async () => {
    mockGetForm.mockResolvedValue({});
    mockUpdateForm.mockResolvedValue({ alreadyReplied: true });

    const id = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send({
        reply: "This is a valid reply with a minimum of twenty characters",
        status: "RESOLVED",
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: STATUS_CODES[409],
      message: Messages.ALREADY_SEND_RESPOND,
      statusCode: 409,
    });
  });

  it("500 - Unexpected Error", async () => {
    const id = new mongoose.Types.ObjectId();
    mockGetForm.mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send({
        reply: "This is a valid reply with a minimum of twenty characters",
        status: "RESOLVED",
      });

    expect(response.status).toBe(500);
  });

  it("200 - Successfully responded to message", async () => {
    const id = new mongoose.Types.ObjectId();
    mockGetForm.mockResolvedValue({});
    mockUpdateForm.mockResolvedValue({});

    const response = await request(app)
      .put(`${ENDPOINTS.MESSAGES}/${id}`)
      .send({
        reply: "This is a valid reply with a minimum of twenty characters",
        status: "RESOLVED",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: Messages.UPDATE_SUCCESS,
      data: {},
    });
  });
});

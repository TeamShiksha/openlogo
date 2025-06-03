const request = require("supertest");
const { ENDPOINTS } = require("../../../utils/testconstants");
const app = require("../../../server");
const { STATUS_CODES } = require("http");
const { Messages, StatusTypes } = require("../../../utils/constants");
const { RequestService } = require("../../../services");
const { default: mongoose } = require("mongoose");

jest.mock("../../../middlewares/auth", () =>
  jest.fn(() => (req, res, next) => {
    req.userData = { userId: "mock-operator-id" };
    next();
  })
);

describe("PUT : /api/requests/:requestId", () => {
  it("422 - Status is required", async () => {
    const dummyRequestId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .put(`${ENDPOINTS.REQUESTS}/${dummyRequestId}`)
      .send({});
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
      .put(`${ENDPOINTS.REQUESTS}/${dummyRequestId}`)
      .send({
        status: "CREATED",
      });
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Status must be one of PENDING, REJECTED, or RESOLVED",
    });
  });

  it("422 - Comment must be a string", async () => {
    const dummyRequestId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .put(`${ENDPOINTS.REQUESTS}/${dummyRequestId}`)
      .send({
        status: StatusTypes.PENDING,
        comment: 123,
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      error: STATUS_CODES[422],
      message: "Comment must be a string",
    });
  });

  it("422 - Comment should be at least 5 characters", async () => {
    const dummyRequestId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.REQUESTS}/${dummyRequestId}`)
      .send({
        status: StatusTypes.PENDING,
        comment: "okay",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Comment should be at least 5 characters",
      statusCode: 422,
    });
  });
  it("422 - Comment must be 500 or fewer characters", async () => {
    const dummyRequestId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`${ENDPOINTS.REQUESTS}/${dummyRequestId}`)
      .send({
        status: StatusTypes.PENDING,
        comment: "ABC".repeat(190),
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Comment must be 500 or fewer characters",
      statusCode: 422,
    });
  });

  it("404 - Request not found", async () => {
    jest
      .spyOn(RequestService.prototype, "getRequestById")
      .mockResolvedValue(null);
    const dummyRequestId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .put(`${ENDPOINTS.REQUESTS}/${dummyRequestId}`)
      .send({
        status: StatusTypes.RESOLVED,
        comment: "okay we will look into it",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.LOGO_REQUEST_NOT_FOUND,
      statusCode: 404,
    });
  });
  it("409 - Already responded to request", async () => {
    const dummyRequestId = new mongoose.Types.ObjectId().toString();
    jest
      .spyOn(RequestService.prototype, "getRequestById")
      .mockResolvedValue({ _id: dummyRequestId, status: StatusTypes.RESOLVED });
    jest
      .spyOn(RequestService.prototype, "respondToRequest")
      .mockResolvedValue({ alreadyProcessed: true });
    const response = await request(app)
      .put(`${ENDPOINTS.REQUESTS}/${dummyRequestId}`)
      .send({
        status: StatusTypes.RESOLVED,
        comment: "Already updated",
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      error: STATUS_CODES[409],
      message: Messages.LOGO_REQUEST_ALREADY_PROCESSED,
    });
  });
  it("200 - Successfully updated request status", async () => {
    const dummyRequest = {
      _id: new mongoose.Types.ObjectId(),
      status: StatusTypes.PENDING,
    };

    const updatedRequest = {
      companyUrl: "https://example.com",
      status: StatusTypes.RESOLVED,
      comment: "Approved and resolved",
      openedAt: new Date("2024-01-01").toString(),
      closedAt: new Date().toString(),
    };

    jest
      .spyOn(RequestService.prototype, "getRequestById")
      .mockResolvedValue(dummyRequest);
    jest
      .spyOn(RequestService.prototype, "respondToRequest")
      .mockResolvedValue(updatedRequest);

    const response = await request(app)
      .put(`${ENDPOINTS.REQUESTS}/${dummyRequest._id}`)
      .send({
        status: StatusTypes.RESOLVED,
        comment: "Approved and resolved",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      message: Messages.UPDATE_SUCCESS,
      data: {
        status: "RESOLVED",
        comment: "Approved and resolved",
      },
    });
  });
});

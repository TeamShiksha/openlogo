const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { ContactUsService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const mongoose = require("mongoose");

const app = require("../../../server");

describe("POST : /api/messages/contact-us", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("422 - Email is required", async () => {
    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "John Doe",
        message: "This is a test message",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Email is required",
      statusCode: 422,
    });
  });

  it("422 - Email must be a valid email", async () => {
    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "John Doe",
        email: "invalid-email",
        message: "This is a test message",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Invalid email",
      statusCode: 422,
    });
  });

  it("422 - Name is required", async () => {
    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        email: "abc@gmail.com",
        message: "This is a test message",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Name is required",
      statusCode: 422,
    });
  });

  it("422 - Message is required", async () => {
    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "John Doe",
        email: "abc@gmail.com",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Message is required",
      statusCode: 422,
    });
  });

  it("422 - Message should be at least 20 characters", async () => {
    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "John Doe",
        email: "abc@gmail.com",
        message: "Short message",
      });
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Message should be at least be 20 characters",
      statusCode: 422,
    });
  });

  it("422 - Message must be 500 or fewer characters", async () => {
    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "John Doe",
        email: "abc@gmail.com",
        message: "A".repeat(501),
      });
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Message must be 500 or fewer characters",
      statusCode: 422,
    });
  });

  it("400 - Form already exists", async () => {
    jest
      .spyOn(ContactUsService.prototype, "formExists")
      .mockResolvedValue(true);

    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "john Doe",
        email: "abc@gmail.com",
        message: "This is a test message",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: Messages.FORM_ALREADY_SUBMITTED,
      statusCode: 400,
      error: STATUS_CODES[400],
    });
  });

  it("500 - Something went wrong", async () => {
    jest
      .spyOn(ContactUsService.prototype, "formExists")
      .mockResolvedValue(false);
    jest
      .spyOn(ContactUsService.prototype, "createForm")
      .mockResolvedValue(null);
    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "john Doe",
        email: "abc@gmail.com",
        message: "This is a test message",
      });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: Messages.INTERNAL_SERVER_ERROR,
      statusCode: 500,
      error: STATUS_CODES[500],
    });
  });

  it("500 - Intenal Server Error", async () => {
    jest
      .spyOn(ContactUsService.prototype, "formExists")
      .mockResolvedValue(false);
    jest
      .spyOn(ContactUsService.prototype, "createForm")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "john Doe",
        email: "abc@gmail.com",
        message: "This is a test message",
      });

    expect(response.status).toBe(500);
  });

  it("200 - Form submitted successfully", async () => {
    const mockForm = {
      _id: new mongoose.Types.ObjectId(),
      name: "john Doe",
      email: "abc@gmail.com",
      message: "This is a test message",
      status: "PENDING",
      is_deleted: false,
      updated_at: new Date(),
    };
    jest
      .spyOn(ContactUsService.prototype, "formExists")
      .mockResolvedValue(false);
    jest
      .spyOn(ContactUsService.prototype, "createForm")
      .mockResolvedValue(mockForm);

    const response = await request(app)
      .post(`${ENDPOINTS.MESSAGES}/contact-us`)
      .send({
        name: "john Doe",
        email: "abc@gmail.com",
        message: "This is a test message",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Form submitted, our team will get in touch shortly",
      statusCode: 200,
    });
  });
});

const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ImageService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("GET /api/logo/demo-search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("422 - Missing key query param", async () => {
    const res = await request(app).get("/api/logo/demo-search");

    expect(res.status).toBe(422);
    expect(res.body).toEqual({
      statusCode: 422,
      message: expect.any(String),
      error: STATUS_CODES[422],
    });
  });

  it("404 - No companies found for key", async () => {
    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockResolvedValue([]);

    const res = await request(app).get("/api/logo/demo-search?key=unknown");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      statusCode: 404,
      message: Messages.LOGO_NOT_FOUND,
      error: STATUS_CODES[404],
    });
  });

  it("200 - Companies found and logos returned", async () => {
    const mockCompanies = ["Google", "GoDaddy"];
    const mockDataList = [
      { name: "Google", logoUrl: "https://logo.com/google.png" },
      { name: "GoDaddy", logoUrl: "https://logo.com/godaddy.png" },
    ];

    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockResolvedValue(mockCompanies);
    jest
      .spyOn(ImageService.prototype, "getDataList")
      .mockResolvedValue(mockDataList);

    const res = await request(app).get("/api/logo/demo-search?key=Go");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      data: mockDataList,
    });
  });

  it("500 - Unexpected error from fetchCompanyList", async () => {
    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockImplementation(() => {
        throw new Error("Boom!");
      });

    const res = await request(app).get("/api/logo/demo-search?key=Go");

    expect(res.status).toBe(500);
  });

  it("429 - blocks requests from same IP after limit", async () => {
    const ip = "1.1.1.1";
    let res;

    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockResolvedValue(["Google"]);

    jest
      .spyOn(ImageService.prototype, "getDataList")
      .mockResolvedValue([{ name: "Google", logoUrl: "logo" }]);

    // 30 allowed
    for (let i = 0; i < 30; i++) {
      res = await request(app)
        .get("/api/logo/demo-search?key=Go")
        .set("X-Forwarded-For", ip);

      expect(res.status).not.toBe(429);
    }

    // 31st blocked
    res = await request(app)
      .get("/api/logo/demo-search?key=Go")
      .set("X-Forwarded-For", ip);

    expect(res.status).toBe(429);
  });

  it("should allow requests from different IPs even after one IP is blocked", async () => {
    const blockedIP = "1.1.1.1";
    const newIP = "2.2.2.2";

    let res;

    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockResolvedValue(["Google"]);

    jest
      .spyOn(ImageService.prototype, "getDataList")
      .mockResolvedValue([{ name: "Google", logoUrl: "logo" }]);

    // Exhaust limit for first IP
    for (let i = 0; i < 31; i++) {
      res = await request(app)
        .get("/api/logo/demo-search?key=Go")
        .set("X-Forwarded-For", blockedIP);
    }

    expect(res.status).toBe(429);

    // Different IP should pass
    res = await request(app)
      .get("/api/logo/demo-search?key=Go")
      .set("X-Forwarded-For", newIP);

    expect(res.status).not.toBe(429);
    expect(res.status).toBe(200);
  });
});

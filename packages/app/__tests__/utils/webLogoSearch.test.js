const { grabCompanyLogos } = require("../../utils/webLogoSearch");
const puppeteer = require("puppeteer-core");
const axios = require("axios");
const https = require("https");
const { EventEmitter } = require("events");

jest.mock("puppeteer-core");
jest.mock("axios");
jest.mock("@sparticuz/chromium", () => ({
  args: [],
  defaultViewport: {},
  executablePath: jest.fn().mockResolvedValue("/mock/path"),
  headless: true,
}));

describe("webLogoSearch Utility", () => {
  let mockBrowser;
  let mockPage;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPage = {
      setDefaultNavigationTimeout: jest.fn(),
      goto: jest.fn().mockResolvedValue({}),
      evaluate: jest.fn().mockResolvedValue(["https://example.com/logo.png"]),
    };
    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(true),
    };
    puppeteer.launch.mockResolvedValue(mockBrowser);

    axios.get.mockResolvedValue({
      data: Buffer.from("mock-image-data"),
      headers: { "content-type": "image/png" },
    });
  });

  test("grabCompanyLogos returns logos when discovery is successful", async () => {
    const mockResponse = new EventEmitter();
    const mockRequest = { on: jest.fn() };

    jest.spyOn(https, "get").mockImplementation((url, callback) => {
      callback(mockResponse);
      mockResponse.emit("data", JSON.stringify([{ domain: "example.com" }]));
      mockResponse.emit("end");
      return mockRequest;
    });

    const result = await grabCompanyLogos("Example Corp");

    expect(result.success).toBe(true);
    expect(result.count).toBeGreaterThan(0);
    expect(result.logos[0].url).toBe("https://example.com/logo.png");
    expect(puppeteer.launch).toHaveBeenCalled();
  });

  test("returns empty array if company name is invalid", async () => {
    const result = await grabCompanyLogos(null);
    expect(result.success).toBe(false);
    expect(result.logos).toHaveLength(0);
  });

  test("handles puppeteer launch failures gracefully", async () => {
    puppeteer.launch.mockRejectedValue(new Error("Launch Failed"));

    jest.spyOn(https, "get").mockImplementation((url, callback) => {
      const res = new EventEmitter();
      callback(res);
      res.emit("data", JSON.stringify([{ domain: "example.com" }]));
      res.emit("end");
      return { on: jest.fn() };
    });

    const result = await grabCompanyLogos("Example Corp");
    expect(result.success).toBe(false);
  });
});

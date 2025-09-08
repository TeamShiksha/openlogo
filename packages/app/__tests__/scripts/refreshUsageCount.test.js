const refreshUsageCount = require("../../scripts/refreshUsageCount");

jest.mock("mongoose", () => {
  const connection = { readyState: 0, close: jest.fn().mockResolvedValue() };
  return {
    connect: jest.fn().mockImplementation(() => {
      connection.readyState = 1;
      return Promise.resolve();
    }),
    connection,
  };
});

jest.mock("../../models/subscriptions", () => ({
  updateMany: jest.fn().mockResolvedValue({ modifiedCount: 5 }),
}));

const mongoose = require("mongoose");
const Subscriptions = require("../../models/subscriptions");

describe("refreshUsageCount script", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MONGO_URL = "mongodb://localhost:27017/fake";
    mongoose.connection.readyState = 0;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    delete process.env.MONGO_URL;
  });

  it("should reset usage count on first day of month", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-10-01")); // mocks first day of month

    await refreshUsageCount();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URL);
    expect(Subscriptions.updateMany).toHaveBeenCalledWith(
      { is_active: true },
      {
        usage_count: 0,
        updated_at: expect.any(Date),
      }
    );
    expect(mongoose.connection.close).toHaveBeenCalled();
  });

  it("should not reset usage count on other days", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-10-15")); // mocks other day

    await refreshUsageCount();

    expect(mongoose.connect).not.toHaveBeenCalled();
    expect(Subscriptions.updateMany).not.toHaveBeenCalled();
    expect(mongoose.connection.close).not.toHaveBeenCalled();
  });
});

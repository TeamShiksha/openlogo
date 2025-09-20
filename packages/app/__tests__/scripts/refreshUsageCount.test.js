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

  it("should reset subscriptions older than one month", async () => {
    jest.useFakeTimers();
    const now = new Date("2025-10-15T00:00:00.000Z");
    jest.setSystemTime(now);

    await refreshUsageCount();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URL);

    expect(Subscriptions.updateMany).toHaveBeenCalled();
    const [filter, update] = Subscriptions.updateMany.mock.calls[0];

    expect(filter).toEqual(
      expect.objectContaining({
        is_active: true,
        updated_at: expect.objectContaining({ $lte: expect.any(Date) }),
      })
    );

    const expectedOneMonthAgo = new Date(now);
    expectedOneMonthAgo.setMonth(expectedOneMonthAgo.getMonth() - 1);
    expect(filter.updated_at.$lte.getTime()).toBe(
      expectedOneMonthAgo.getTime()
    );
    expect(update).toEqual(
      expect.objectContaining({
        usage_count: 0,
        updated_at: expect.any(Date),
      })
    );
    expect(update.updated_at.getTime()).toBe(now.getTime());

    expect(mongoose.connection.close).toHaveBeenCalled();
  });

  it("should exit with error if MONGO_URL is missing", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-10-15T00:00:00.000Z"));

    delete process.env.MONGO_URL;
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

    await refreshUsageCount();

    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(mongoose.connect).not.toHaveBeenCalled();
    expect(Subscriptions.updateMany).not.toHaveBeenCalled();
    expect(mongoose.connection.close).not.toHaveBeenCalled();
  });
});

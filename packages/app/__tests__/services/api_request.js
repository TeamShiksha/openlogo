const ApiRequestService = require("../../services/api_request");
const { ApiRequestRepository } = require("../../repositories");
const {
  MOCK_API_REQUESTS,
  MOCK_USERS,
  MOCK_KEYS,
  MOCK_IMAGES,
  MOCK_WEEKLY_STATS,
  MOCK_MONTHLY_STATS,
} = require("../../utils/mocks");

describe("ApiRequest Service", () => {
  let apiRequestService;

  beforeEach(() => {
    apiRequestService = new ApiRequestService();
    jest.clearAllMocks();
  });

  describe("createEntry", () => {
    it("should create a new API request entry with all fields", async () => {
      const requestData = {
        user_id: MOCK_USERS[0]._id.toString(),
        key_id: MOCK_KEYS[0]._id.toString(),
        image_id: MOCK_IMAGES[0]._id.toString(),
        response_size_bytes: 1024,
      };

      const mockCreatedRequest = {
        ...requestData,
        _id: MOCK_API_REQUESTS[0]._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(ApiRequestRepository.prototype, "create")
        .mockResolvedValue(mockCreatedRequest);

      const result = await apiRequestService.createEntry(requestData);

      expect(result).toBeDefined();
      expect(result.user_id).toBe(requestData.user_id);
      expect(result.key_id).toBe(requestData.key_id);
      expect(result.image_id).toBe(requestData.image_id);
      expect(result.response_size_bytes).toBe(1024);
      expect(ApiRequestRepository.prototype.create).toHaveBeenCalledWith({
        user_id: requestData.user_id,
        key_id: requestData.key_id,
        image_id: requestData.image_id,
        response_size_bytes: 1024,
      });
    });

    it("should create API request entry with default response_size_bytes when not provided", async () => {
      const requestData = {
        user_id: MOCK_USERS[0]._id.toString(),
        key_id: MOCK_KEYS[0]._id.toString(),
        image_id: MOCK_IMAGES[0]._id.toString(),
      };

      const mockCreatedRequest = {
        ...requestData,
        response_size_bytes: 0,
        _id: MOCK_API_REQUESTS[0]._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(ApiRequestRepository.prototype, "create")
        .mockResolvedValue(mockCreatedRequest);

      const result = await apiRequestService.createEntry(requestData);

      expect(result).toBeDefined();
      expect(result.response_size_bytes).toBe(0);
      expect(ApiRequestRepository.prototype.create).toHaveBeenCalledWith({
        user_id: requestData.user_id,
        key_id: requestData.key_id,
        image_id: requestData.image_id,
        response_size_bytes: 0,
      });
    });

    it("should create API request entry with 0 when response_size_bytes is 0", async () => {
      const requestData = {
        user_id: MOCK_USERS[0]._id.toString(),
        key_id: MOCK_KEYS[0]._id.toString(),
        image_id: MOCK_IMAGES[0]._id.toString(),
        response_size_bytes: 0,
      };

      const mockCreatedRequest = {
        ...requestData,
        _id: MOCK_API_REQUESTS[0]._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(ApiRequestRepository.prototype, "create")
        .mockResolvedValue(mockCreatedRequest);

      const result = await apiRequestService.createEntry(requestData);

      expect(result).toBeDefined();
      expect(result.response_size_bytes).toBe(0);
    });

    it("should handle repository errors during creation", async () => {
      const requestData = {
        user_id: MOCK_USERS[0]._id.toString(),
        key_id: MOCK_KEYS[0]._id.toString(),
        image_id: MOCK_IMAGES[0]._id.toString(),
        response_size_bytes: 1024,
      };

      jest
        .spyOn(ApiRequestRepository.prototype, "create")
        .mockRejectedValue(new Error("Database error"));

      await expect(apiRequestService.createEntry(requestData)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("getWeeklyStats", () => {
    it("should return weekly stats for a valid user", async () => {
      const userId = MOCK_USERS[0]._id.toString();

      jest
        .spyOn(ApiRequestRepository.prototype, "getCurrentWeekData")
        .mockResolvedValue(MOCK_WEEKLY_STATS);

      const result = await apiRequestService.getWeeklyStats(userId);

      expect(result).toBeDefined();
      expect(result.period).toBe("week");
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.totalCount).toBe(15);
      expect(result.summary.totalKB).toBe("45.50");
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(
        ApiRequestRepository.prototype.getCurrentWeekData
      ).toHaveBeenCalledWith(userId);
    });

    it("should return empty stats when user has no requests in current week", async () => {
      const userId = MOCK_USERS[1]._id.toString();
      const emptyStats = {
        period: "week",
        startDate: "2025-11-16",
        endDate: "2025-11-22",
        summary: {
          totalCount: 0,
          totalKB: "0.00",
        },
        data: [],
      };

      jest
        .spyOn(ApiRequestRepository.prototype, "getCurrentWeekData")
        .mockResolvedValue(emptyStats);

      const result = await apiRequestService.getWeeklyStats(userId);

      expect(result).toBeDefined();
      expect(result.summary.totalCount).toBe(0);
      expect(result.data).toEqual([]);
    });

    it("should handle repository errors when fetching weekly stats", async () => {
      const userId = MOCK_USERS[0]._id.toString();

      jest
        .spyOn(ApiRequestRepository.prototype, "getCurrentWeekData")
        .mockRejectedValue(new Error("Database connection failed"));

      await expect(apiRequestService.getWeeklyStats(userId)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getMonthlyStats", () => {
    it("should return monthly stats for a valid user", async () => {
      const userId = MOCK_USERS[0]._id.toString();

      jest
        .spyOn(ApiRequestRepository.prototype, "getCurrentMonthData")
        .mockResolvedValue(MOCK_MONTHLY_STATS);

      const result = await apiRequestService.getMonthlyStats(userId);

      expect(result).toBeDefined();
      expect(result.period).toBe("month");
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.summary.totalCount).toBe(50);
      expect(result.summary.totalKB).toBe("150.75");
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(
        ApiRequestRepository.prototype.getCurrentMonthData
      ).toHaveBeenCalledWith(userId);
    });

    it("should return empty stats when user has no requests in current month", async () => {
      const userId = MOCK_USERS[2]._id.toString();
      const emptyStats = {
        period: "month",
        startDate: "2025-11-01",
        endDate: "2025-11-30",
        summary: {
          totalCount: 0,
          totalKB: "0.00",
        },
        data: [],
      };

      jest
        .spyOn(ApiRequestRepository.prototype, "getCurrentMonthData")
        .mockResolvedValue(emptyStats);

      const result = await apiRequestService.getMonthlyStats(userId);

      expect(result).toBeDefined();
      expect(result.summary.totalCount).toBe(0);
      expect(result.data).toEqual([]);
    });

    it("should handle repository errors when fetching monthly stats", async () => {
      const userId = MOCK_USERS[0]._id.toString();

      jest
        .spyOn(ApiRequestRepository.prototype, "getCurrentMonthData")
        .mockRejectedValue(new Error("Aggregation failed"));

      await expect(apiRequestService.getMonthlyStats(userId)).rejects.toThrow(
        "Aggregation failed"
      );
    });
  });

  describe("service instance", () => {
    it("should create service instance with repository", () => {
      expect(apiRequestService).toBeDefined();
      expect(apiRequestService.apiRequestRepository).toBeDefined();
      expect(
        apiRequestService.apiRequestRepository instanceof ApiRequestRepository
      ).toBe(true);
    });
  });
});

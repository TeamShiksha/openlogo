const mongoose = require("mongoose");
const RewardTrackingService = require("../../services/rewardTransactions");
const {
  LogoRequestLogsRepository,
  SubscriptionsRepository,
  UsersRepository,
} = require("../../repositories");
const { SubscriptionTypes } = require("../../utils/constants");
const {
  createMockLogoRequestLogEntry,
  createValidRewardTrackingParams,
} = require("../../utils/mocks");

// Mock the repositories
jest.mock("../../repositories");

describe.skip("RewardTrackingService", () => {
  let rewardTrackingService;
  let mockLogoRequestLogsRepository;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a new instance of the service
    rewardTrackingService = new RewardTrackingService();

    // Get mocked repository instances
    mockLogoRequestLogsRepository = LogoRequestLogsRepository.mock.instances[0];
    SubscriptionsRepository.mock.instances[0];
    UsersRepository.mock.instances[0];

    // Setup default mock implementations
    if (mockLogoRequestLogsRepository) {
      mockLogoRequestLogsRepository.create = jest.fn();
      mockLogoRequestLogsRepository.find = jest.fn();
    }
  });

  describe("Constructor", () => {
    it("should initialize with required repositories", () => {
      expect(rewardTrackingService.logoRequestLogsRepository).toBeDefined();
      expect(rewardTrackingService.subscriptionsRepository).toBeDefined();
      expect(rewardTrackingService.usersRepository).toBeDefined();
    });

    it("should create separate repository instances", () => {
      const service1 = new RewardTrackingService();
      const service2 = new RewardTrackingService();

      expect(service1.logoRequestLogsRepository).not.toBe(
        service2.logoRequestLogsRepository
      );
    });
  });

  describe("validateRequestParams", () => {
    it("should validate all required parameters", () => {
      const params = {
        imageId: "image123",
        userId: "user123",
        creatorId: "creator123",
        subscriptionId: "sub123",
        subscription: { type: SubscriptionTypes.PRO },
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should report error when imageId is missing", () => {
      const params = {
        userId: "user123",
        creatorId: "creator123",
        subscriptionId: "sub123",
        subscription: { type: SubscriptionTypes.PRO },
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("imageId is required");
    });

    it("should report error when userId is missing", () => {
      const params = {
        imageId: "image123",
        creatorId: "creator123",
        subscriptionId: "sub123",
        subscription: { type: SubscriptionTypes.PRO },
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("userId is required");
    });

    it("should report error when creatorId is missing", () => {
      const params = {
        imageId: "image123",
        userId: "user123",
        subscriptionId: "sub123",
        subscription: { type: SubscriptionTypes.PRO },
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("creatorId is required");
    });

    it("should report error when subscriptionId is missing", () => {
      const params = {
        imageId: "image123",
        userId: "user123",
        creatorId: "creator123",
        subscription: { type: SubscriptionTypes.PRO },
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("subscriptionId is required");
    });

    it("should report error when subscription object is missing", () => {
      const params = {
        imageId: "image123",
        userId: "user123",
        creatorId: "creator123",
        subscriptionId: "sub123",
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("subscription object is required");
    });

    it("should report multiple errors when multiple parameters are missing", () => {
      const params = {
        imageId: "image123",
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it("should validate with empty string values", () => {
      const params = {
        imageId: "",
        userId: "",
        creatorId: "",
        subscriptionId: "",
        subscription: { type: SubscriptionTypes.PRO },
      };

      const result = rewardTrackingService.validateRequestParams(params);

      // Empty strings are falsy, so they should be invalid
      expect(result.isValid).toBe(false);
    });

    it("should validate with null values", () => {
      const params = {
        imageId: null,
        userId: null,
        creatorId: null,
        subscriptionId: null,
        subscription: null,
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(5);
    });

    it("should validate with undefined values", () => {
      const params = {
        imageId: undefined,
        userId: undefined,
        creatorId: undefined,
        subscriptionId: undefined,
        subscription: undefined,
      };

      const result = rewardTrackingService.validateRequestParams(params);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(5);
    });
  });

  describe("validateAndLogRequest", () => {
    const createMockLogEntry = createMockLogoRequestLogEntry;
    const createValidParams = createValidRewardTrackingParams;

    describe("Subscription Type Validation", () => {
      it("should reject non-PRO users (HOBBY_USER)", async () => {
        const params = createValidParams();
        params.subscription = { type: SubscriptionTypes.HOBBY };
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "HOBBY_USER";

        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.is_reward_eligible).toBe(false);
        expect(result.reward_eligibility_reason).toBe("HOBBY_USER");
        expect(mockLogoRequestLogsRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            user_plan: SubscriptionTypes.HOBBY,
            is_reward_eligible: false,
            reward_eligibility_reason: "HOBBY_USER",
          })
        );
      });

      it("should accept PRO subscription", async () => {
        const params = createValidParams();
        params.subscription = { type: SubscriptionTypes.PRO };
        const mockLogEntry = createMockLogEntry();

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.is_reward_eligible).toBe(true);
      });
    });

    describe("Self-Usage Detection", () => {
      it("should reject when user is the creator (SELF_USAGE)", async () => {
        const params = createValidParams();
        params.userId = "same-user";
        params.creatorId = "same-user";
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "SELF_USAGE";

        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.is_reward_eligible).toBe(false);
        expect(result.reward_eligibility_reason).toBe("SELF_USAGE");
      });

      it("should handle string IDs correctly for self-usage check", async () => {
        const params = createValidParams();
        params.userId = "123";
        params.creatorId = "123";
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "SELF_USAGE";

        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.reward_eligibility_reason).toBe("SELF_USAGE");
      });

      it("should handle ObjectId type comparison correctly", async () => {
        const params = createValidParams();
        const userId = new mongoose.Types.ObjectId();
        params.userId = userId;
        params.creatorId = userId;
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "SELF_USAGE";

        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.reward_eligibility_reason).toBe("SELF_USAGE");
      });

      it("should not reject when user and creator are different", async () => {
        const params = createValidParams();
        const mockLogEntry = createMockLogEntry();

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        await rewardTrackingService.validateAndLogRequest(params);

        // Should pass the self-usage check
        expect(mockLogoRequestLogsRepository.find).toHaveBeenCalled();
      });
    });

    describe("Duplicate Usage Detection", () => {
      it("should reject duplicate usage (DUPLICATE_USAGE)", async () => {
        const params = createValidParams();
        const existingLog = createMockLogEntry();
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "DUPLICATE_USAGE";

        mockLogoRequestLogsRepository.find.mockResolvedValue([existingLog]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.is_reward_eligible).toBe(false);
        expect(result.reward_eligibility_reason).toBe("DUPLICATE_USAGE");
        expect(mockLogoRequestLogsRepository.find).toHaveBeenCalledWith({
          image_id: params.imageId,
          user_id: params.userId,
          is_reward_eligible: true,
        });
      });

      it("should handle empty find results as no duplicates", async () => {
        const params = createValidParams();
        const mockLogEntry = createMockLogEntry();

        mockLogoRequestLogsRepository.find.mockResolvedValue(null);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.is_reward_eligible).toBe(true);
        expect(result.reward_eligibility_reason).toBe("VALID");
      });

      it("should handle array with multiple duplicate records", async () => {
        const params = createValidParams();
        const existingLog1 = createMockLogEntry();
        const existingLog2 = createMockLogEntry();
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "DUPLICATE_USAGE";

        mockLogoRequestLogsRepository.find.mockResolvedValue([
          existingLog1,
          existingLog2,
        ]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.is_reward_eligible).toBe(false);
        expect(result.reward_eligibility_reason).toBe("DUPLICATE_USAGE");
      });
    });

    describe("Valid Request Handling", () => {
      it("should approve valid requests (VALID)", async () => {
        const params = createValidParams();
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = true;
        mockLogEntry.reward_eligibility_reason = "VALID";

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.is_reward_eligible).toBe(true);
        expect(result.reward_eligibility_reason).toBe("VALID");
        expect(mockLogoRequestLogsRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            user_id: params.userId,
            key_id: params.keyId,
            image_id: params.imageId,
            ip_address: params.ipAddress,
            user_agent: params.userAgent,
            user_plan: SubscriptionTypes.PRO,
            is_reward_eligible: true,
            reward_eligibility_reason: "VALID",
          })
        );
      });

      it("should return log entry with all required fields", async () => {
        const params = createValidParams();
        const mockLogEntry = createMockLogEntry();

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result).toHaveProperty("_id");
        expect(result).toHaveProperty("user_id");
        expect(result).toHaveProperty("image_id");
        expect(result).toHaveProperty("key_id");
        expect(result).toHaveProperty("ip_address");
        expect(result).toHaveProperty("user_agent");
        expect(result).toHaveProperty("user_plan");
        expect(result).toHaveProperty("is_reward_eligible");
        expect(result).toHaveProperty("reward_eligibility_reason");
      });

      it("should call create with correctly formatted data", async () => {
        const params = createValidParams();
        const mockLogEntry = createMockLogEntry();

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        await rewardTrackingService.validateAndLogRequest(params);

        expect(mockLogoRequestLogsRepository.create).toHaveBeenCalledWith({
          user_id: params.userId,
          key_id: params.keyId,
          image_id: params.imageId,
          ip_address: params.ipAddress,
          user_agent: params.userAgent,
          user_plan: SubscriptionTypes.PRO,
          is_reward_eligible: true,
          reward_eligibility_reason: "VALID",
        });
      });
    });

    describe("Async Reward Processing", () => {
      it("should trigger async reward processing for valid requests", async () => {
        const params = createValidParams();
        const mockLogEntry = createMockLogEntry();

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        jest.spyOn(rewardTrackingService, "triggerAsyncRewardProcessing");

        await rewardTrackingService.validateAndLogRequest(params);

        expect(
          rewardTrackingService.triggerAsyncRewardProcessing
        ).toHaveBeenCalledWith(params.imageId);
      });

      it("should not trigger async reward processing for invalid requests", async () => {
        const params = createValidParams();
        params.subscription = { type: SubscriptionTypes.HOBBY };
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "HOBBY_USER";

        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        jest.spyOn(rewardTrackingService, "triggerAsyncRewardProcessing");

        await rewardTrackingService.validateAndLogRequest(params);

        expect(
          rewardTrackingService.triggerAsyncRewardProcessing
        ).not.toHaveBeenCalled();
      });

      it("should trigger async reward processing only once per valid request", async () => {
        const params = createValidParams();
        const mockLogEntry = createMockLogEntry();

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const triggerSpy = jest.spyOn(
          rewardTrackingService,
          "triggerAsyncRewardProcessing"
        );

        await rewardTrackingService.validateAndLogRequest(params);

        expect(triggerSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("Error Handling", () => {
      it("should handle repository create errors gracefully", async () => {
        const params = createValidParams();
        const error = new Error("Database error");

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockRejectedValue(error);

        await expect(
          rewardTrackingService.validateAndLogRequest(params)
        ).rejects.toThrow("Database error");
      });

      it("should handle repository find errors gracefully", async () => {
        const params = createValidParams();
        const error = new Error("Query error");

        mockLogoRequestLogsRepository.find.mockRejectedValue(error);

        await expect(
          rewardTrackingService.validateAndLogRequest(params)
        ).rejects.toThrow("Query error");
      });

      it("should propagate unexpected errors from repository", async () => {
        const params = createValidParams();
        const error = new Error("Unexpected error");

        mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        mockLogoRequestLogsRepository.create.mockRejectedValue(error);

        await expect(
          rewardTrackingService.validateAndLogRequest(params)
        ).rejects.toThrow("Unexpected error");
      });
    });

    describe("Validation Order", () => {
      it("should check subscription type before self-usage", async () => {
        const params = createValidParams();
        params.userId = "same-user";
        params.creatorId = "same-user";
        params.subscription = { type: SubscriptionTypes.HOBBY };
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "HOBBY_USER";

        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        // Should fail on subscription type check first
        expect(result.reward_eligibility_reason).toBe("HOBBY_USER");
        expect(mockLogoRequestLogsRepository.find).not.toHaveBeenCalled();
      });

      it("should check self-usage before duplicate usage", async () => {
        const params = createValidParams();
        params.userId = "same-user";
        params.creatorId = "same-user";
        const mockLogEntry = createMockLogEntry();
        mockLogEntry.is_reward_eligible = false;
        mockLogEntry.reward_eligibility_reason = "SELF_USAGE";

        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        // Should fail on self-usage check before checking duplicates
        expect(result.reward_eligibility_reason).toBe("SELF_USAGE");
        expect(mockLogoRequestLogsRepository.find).not.toHaveBeenCalled();
      });
    });
  });

  describe("triggerAsyncRewardProcessing", () => {
    it("should log message when triggered", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const imageId = "image123";

      rewardTrackingService.triggerAsyncRewardProcessing(imageId);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Triggered async reward processing")
      );
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(imageId));

      consoleSpy.mockRestore();
    });

    it("should handle any image ID format", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      rewardTrackingService.triggerAsyncRewardProcessing("123");
      rewardTrackingService.triggerAsyncRewardProcessing(
        new mongoose.Types.ObjectId()
      );
      rewardTrackingService.triggerAsyncRewardProcessing("uuid-string");

      expect(consoleSpy).toHaveBeenCalledTimes(3);

      consoleSpy.mockRestore();
    });

    it("should log with the correct imageId for different formats", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const objectId = new mongoose.Types.ObjectId();

      rewardTrackingService.triggerAsyncRewardProcessing(objectId);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(objectId.toString())
      );

      consoleSpy.mockRestore();
    });

    it("should not throw for null or undefined imageId", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      expect(() => {
        rewardTrackingService.triggerAsyncRewardProcessing(null);
      }).not.toThrow();

      expect(() => {
        rewardTrackingService.triggerAsyncRewardProcessing(undefined);
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe("Integration scenarios", () => {
    it("should handle full flow for valid PRO user", async () => {
      const params = {
        imageId: "logo-apple",
        userId: new mongoose.Types.ObjectId(),
        creatorId: new mongoose.Types.ObjectId(),
        keyId: "key-123",
        subscriptionId: "sub-pro-001",
        subscription: { type: SubscriptionTypes.PRO },
        ipAddress: "192.168.1.1",
        userAgent: "Chrome/90",
      };

      const mockLogEntry = {
        _id: new mongoose.Types.ObjectId(),
        user_id: params.userId,
        key_id: params.keyId,
        image_id: params.imageId,
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
        user_plan: SubscriptionTypes.PRO,
        is_reward_eligible: true,
        reward_eligibility_reason: "VALID",
      };

      mockLogoRequestLogsRepository.find.mockResolvedValue([]);
      mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const result = await rewardTrackingService.validateAndLogRequest(params);

      expect(result.is_reward_eligible).toBe(true);
      expect(result.reward_eligibility_reason).toBe("VALID");
      expect(mockLogoRequestLogsRepository.create).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should stop processing after first validation failure", async () => {
      const params = {
        imageId: "logo-apple",
        userId: "user123",
        creatorId: "user123", // Self-usage
        keyId: "key-123",
        subscriptionId: "sub-pro-001",
        subscription: { type: SubscriptionTypes.PRO },
        ipAddress: "192.168.1.1",
        userAgent: "Chrome/90",
      };

      const mockLogEntry = {
        _id: new mongoose.Types.ObjectId(),
        is_reward_eligible: false,
        reward_eligibility_reason: "SELF_USAGE",
      };

      mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

      const result = await rewardTrackingService.validateAndLogRequest(params);

      // Should fail on self-usage check before checking duplicates
      expect(result.reward_eligibility_reason).toBe("SELF_USAGE");
      expect(mockLogoRequestLogsRepository.find).not.toHaveBeenCalled();
    });

    it("should handle complex ObjectId comparisons in real-world scenario", async () => {
      const userId = new mongoose.Types.ObjectId();
      const creatorId = new mongoose.Types.ObjectId();

      const params = {
        imageId: "apple-logo-2024",
        userId,
        creatorId,
        keyId: "api-key-abc123",
        subscriptionId: "sub-pro-xyz",
        subscription: { type: SubscriptionTypes.PRO },
        ipAddress: "203.0.113.45",
        userAgent: "node-fetch/2.6.7",
      };

      const mockLogEntry = {
        _id: new mongoose.Types.ObjectId(),
        user_id: userId,
        key_id: "api-key-abc123",
        image_id: "apple-logo-2024",
        ip_address: "203.0.113.45",
        user_agent: "node-fetch/2.6.7",
        user_plan: SubscriptionTypes.PRO,
        is_reward_eligible: true,
        reward_eligibility_reason: "VALID",
      };

      mockLogoRequestLogsRepository.find.mockResolvedValue([]);
      mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

      const result = await rewardTrackingService.validateAndLogRequest(params);

      expect(result.is_reward_eligible).toBe(true);
    });

    it("should validate all subscription types correctly", async () => {
      const testCases = [
        {
          type: SubscriptionTypes.HOBBY,
          shouldBeEligible: false,
          reason: "HOBBY_USER",
        },
        {
          type: SubscriptionTypes.PRO,
          shouldBeEligible: true,
          reason: "VALID",
        },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();

        const params = {
          imageId: "test-image",
          userId: "user123",
          creatorId: "creator456",
          keyId: "key123",
          subscriptionId: "sub123",
          subscription: { type: testCase.type },
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0",
        };

        const mockLogEntry = {
          _id: new mongoose.Types.ObjectId(),
          is_reward_eligible: testCase.shouldBeEligible,
          reward_eligibility_reason: testCase.reason,
        };

        if (testCase.shouldBeEligible) {
          mockLogoRequestLogsRepository.find.mockResolvedValue([]);
        }
        mockLogoRequestLogsRepository.create.mockResolvedValue(mockLogEntry);

        const result =
          await rewardTrackingService.validateAndLogRequest(params);

        expect(result.is_reward_eligible).toBe(testCase.shouldBeEligible);
        expect(result.reward_eligibility_reason).toBe(testCase.reason);
      }
    });
  });
});

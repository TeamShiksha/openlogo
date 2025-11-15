const UserService = require("../../services/users");
const KeyService = require("../../services/keys");
const SubscriptionService = require("../../services/subscriptions");
const { UsersRepository, RequestRepository } = require("../../repositories");
const { MOCK_USERS, MOCK_KEYS } = require("../../utils/mocks");
const User = require("../../models/users");
const Keys = require("../../models/keys");
const { UserType } = require("../../utils/constants");

jest.mock("../../services/keys");
jest.mock("../../services/subscriptions");
jest.mock("../../repositories");

describe("User Service", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });
  describe("getUserDataForDownload", () => {
    // --- Mock Data for this suite ---
    const mockGetTimestamp = () => "2025-10-31T10:00:00.000Z";
    const mockUserId = "user_abc_123";

    const mockUser = {
      _id: { getTimestamp: mockGetTimestamp, toString: () => mockUserId },
      name: "Test User",
      email: "test@example.com",
      role: "user",
      keys: ["key_id_1"],
      subscription_id: "sub_id_1",
    };

    const mockRequests = [
      {
        _id: "req_1",
        companyUrl: "http://example.com",
        status: "completed",
        openedAt: "2025-10-30T00:00:00.000Z",
      },
    ];

    const mockKeys = [
      {
        _id: { getTimestamp: mockGetTimestamp },
        usageCount: 10,
        key_description: "Test Key",
      },
    ];

    const mockSubscription = {
      usage_count: 100,
      usage_limit: 1000,
    };
    // --- End Mock Data ---

    it("should return null if user is not found", async () => {
      // Arrange
      // Spy on the service's *own* method
      jest.spyOn(userService, "getUser").mockResolvedValue(null);

      // Act
      const result =
        await userService.getUserDataForDownload("non_existent_id");

      // Assert
      expect(result).toBeNull();
      expect(userService.getUser).toHaveBeenCalledWith("non_existent_id");
    });

    it("should compile and return correct user data on happy path", async () => {
      // Arrange
      // 1. Mock the service's *own* getUser method
      jest.spyOn(userService, "getUser").mockResolvedValue(mockUser);

      // 2. Mock the *injected* dependencies (prototypes of the classes)
      jest
        .spyOn(RequestRepository.prototype, "find")
        .mockResolvedValue(mockRequests);
      jest
        .spyOn(KeyService.prototype, "getAllUserKeys")
        .mockResolvedValue(mockKeys);
      jest
        .spyOn(SubscriptionService.prototype, "getSubscription")
        .mockResolvedValue(mockSubscription);

      // Act
      const result = await userService.getUserDataForDownload(mockUserId);

      // Assert: Check data compilation
      expect(result.profile.name).toBe("Test User");
      expect(result.generationHistory.totalGenerations).toBe(1);
      expect(result.generationHistory.generations[0].companyUrl).toBe(
        "http://example.com"
      );
      expect(result.usageStats.apiCalls).toBe(100);
      expect(result.security.totalApiKeys).toBe(1);
      expect(result.security.apiKeys[0].description).toBe("Test Key");

      // Assert: Check that dependencies were called correctly
      expect(userService.getUser).toHaveBeenCalledWith(mockUserId);
      expect(RequestRepository.prototype.find).toHaveBeenCalledWith({
        user_id: mockUserId,
      });
      expect(KeyService.prototype.getAllUserKeys).toHaveBeenCalledWith(
        mockUser.keys
      );
      expect(
        SubscriptionService.prototype.getSubscription
      ).toHaveBeenCalledWith(mockUser.subscription_id);
    });

    it("should handle empty or null related data", async () => {
      // Arrange
      jest.spyOn(userService, "getUser").mockResolvedValue(mockUser);
      jest.spyOn(RequestRepository.prototype, "find").mockResolvedValue([]);
      jest.spyOn(KeyService.prototype, "getAllUserKeys").mockResolvedValue([]);
      jest
        .spyOn(SubscriptionService.prototype, "getSubscription")
        .mockResolvedValue(null);

      // Act
      const result = await userService.getUserDataForDownload(mockUserId);

      // Assert: Check defaults
      expect(result.generationHistory.totalGenerations).toBe(0);
      expect(result.generationHistory.generations).toEqual([]);
      expect(result.usageStats.apiCalls).toBe(0); // Test the '|| 0' logic
      expect(result.usageStats.apiCallsLimit).toBe(0); // Test the '|| 0' logic
      expect(result.security.totalApiKeys).toBe(0);
      expect(result.security.apiKeys).toEqual([]);
    });
  });

  it("should return a user for valid id", async () => {
    const user = MOCK_USERS[0];
    jest.spyOn(UsersRepository.prototype, "getById").mockResolvedValue(user);

    const result = await userService.getUser(user._id);
    expect(result).toEqual(user);
  });

  it("should return total user count", async () => {
    jest.spyOn(UsersRepository.prototype, "getUsersCount").mockResolvedValue(5);
    const result = await userService.getUsersCount();
    expect(result).toBe(5);
  });

  it("should update data successfully if data is valid", async () => {
    const user = new User(MOCK_USERS[0]);
    const updatedDate = {
      ...user,
      name: "updated name",
    };
    jest
      .spyOn(UsersRepository.prototype, "update")
      .mockResolvedValue(updatedDate);

    const result = await userService.updateUser(updatedDate.name, user.id);
    expect(result).toBe(true);
  });

  it("Should create a new valid key and add it to user", async () => {
    const mockKey = new Keys(MOCK_KEYS[0]);
    const user = new User(MOCK_USERS[0]);

    jest.spyOn(KeyService.prototype, "createNewKey").mockResolvedValue(mockKey);
    jest.spyOn(user, "save").mockResolvedValue(user);

    const result = await userService.createNewUserKey(
      mockKey.key_description,
      user
    );
    expect(result).toBe(mockKey);
  });

  it("should update password successfully", async () => {
    const newPassword = "password123";
    const user = new User(MOCK_USERS[0]);

    jest.spyOn(user, "save").mockResolvedValue(user);

    const result = await userService.updateUserPassword(user, newPassword);
    expect(result).toBe(true);
    expect(user.password).not.toBe(newPassword);
    expect(typeof user.password).toBe("string");
    expect(user.save).toHaveBeenCalled();
  });

  it("destroy user key successfully", async () => {
    const key = new Keys(MOCK_KEYS[0]);
    const user = new User(MOCK_USERS[0]);
    user.keys.push(key._id);
    user.save = jest.fn().mockResolvedValue(user);
    jest.spyOn(KeyService.prototype, "destroyKey").mockResolvedValue(key);
    const result = await userService.destroyUserKey(key.id, user);

    expect(result).toEqual(key);
  });

  it("deleting user returns false if user not found", async () => {
    jest.spyOn(UsersRepository.prototype, "delete").mockResolvedValue(null);
    const result = await userService.deleteUserAccount("nonexistent-id");
    expect(result).toBe(false);
  });

  it("delete user successfully", async () => {
    const user = { ...MOCK_USERS[0], is_deleted: false, _id: "123" };
    jest.spyOn(UsersRepository.prototype, "delete").mockResolvedValue(user);
    const userService = new UserService();
    const result = await userService.deleteUserAccount(user._id);
    console.log("Result:", result);
    expect(result).toBe(true);
  });

  it("finds a user with valid email who is registered", async () => {
    const user = new User(MOCK_USERS[0]);
    jest
      .spyOn(UsersRepository.prototype, "findUserByEmail")
      .mockResolvedValue(user);
    const result = await userService.getUserByEmail(user.email);

    expect(result).toBeDefined();
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("johndoe@example.com");
  });

  it("returns null for unregistered email", async () => {
    jest
      .spyOn(UsersRepository.prototype, "findUserByEmail")
      .mockResolvedValue(null);
    const result = await userService.getUserByEmail("nonexistent@example.com");

    expect(result).toBeNull();
  });

  it("should return guest user", async () => {
    const user = new User(MOCK_USERS[4]);

    jest
      .spyOn(UsersRepository.prototype, "getGuestUser")
      .mockResolvedValue(user);

    const result = await userService.getGuestUser();

    expect(result).toBeDefined();
    expect(result.role).toBe(UserType.GUEST);
  });

  it("returns ADMIN if in admin list", () => {
    process.env.ADMINSEMAILS =
      "admin1@example.com,admin2@example.com,admin3@example.com";
    const role = userService.getRole("admin1@example.com");
    expect(role).toBe(UserType.ADMIN);
  });
  it("returns CUSTOMER if not in admin list", () => {
    process.env.ADMINSEMAILS =
      "admin1@example.com,admin2@example.com,admin3@example.com";
    const role = userService.getRole("user@example.com");
    expect(role).toBe(UserType.CUSTOMER);
  });

  it("should create user succesfully", async () => {
    const userDetails = {
      name: MOCK_USERS[0].name,
      email: MOCK_USERS[0].email,
      password: "password123",
      confirmPassword: "password123",
    };
    const user = new User(MOCK_USERS[0]);
    jest
      .spyOn(UserService.prototype, "getRole")
      .mockResolvedValue(UserType.CUSTOMER);
    jest.spyOn(UsersRepository.prototype, "create").mockResolvedValue(user);

    const result = await userService.createUser(userDetails);
    expect(result).toBeDefined();
    expect(result.role).toBe(UserType.CUSTOMER);
    expect(result.name).toBe(user.name);
    expect(result.password).not.toBe(userDetails.password);
  });

  it("should return true if user verification successful", async () => {
    const user = new User(MOCK_USERS[0]);
    const updated_user = { ...user.toObject(), is_verified: true };
    jest
      .spyOn(UsersRepository.prototype, "update")
      .mockResolvedValue(updated_user);

    const result = await userService.verifyUser(user.id);

    expect(result).toBeDefined();
    expect(result).toBe(true);
  });

  it("should return false if user verification fails", async () => {
    const userId = "new-user-id";
    jest.spyOn(UsersRepository.prototype, "update").mockResolvedValue(null);

    const result = await userService.verifyUser(userId);
    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  it("return true if user role updated succesfully", async () => {
    const user = new User(MOCK_USERS[0]);
    const updated_user = { ...user.toObject(), role: UserType.ADMIN };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest
      .spyOn(UsersRepository.prototype, "update")
      .mockResolvedValue(updated_user);

    const result = await userService.updateUserToAdmin(user.email);
    console.log(result);
    expect(result).toBe(true);
  });

  it("should return false if user role not able to update", async () => {
    const user = "user-id";

    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest.spyOn(UsersRepository.prototype, "update").mockResolvedValue(null);

    const result = await userService.updateUserToAdmin(user.email);
    expect(result).toBe(false);
  });
});

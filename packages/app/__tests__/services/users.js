const UserService = require("../../services/users");
const KeyService = require("../../services/keys");
const { UsersRepository } = require("../../repositories");
const { MOCK_USERS, MOCK_KEYS } = require("../../utils/mocks");
const User = require("../../models/users");
const Keys = require("../../models/keys");
const { UserType } = require("../../utils/constants");

jest.mock("../../services/keys");

describe("User Service", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
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

  it("delete user succesfully", async () => {
    const user = new User(MOCK_USERS[0]);

    jest.spyOn(UsersRepository.prototype, "delete").mockResolvedValue(user);

    const result = await userService.deleteUserAccount(user.id);

    expect(result).toBe(true);
  });

  it("deleting user returns false if user not found", async () => {
    jest.spyOn(UsersRepository.prototype, "delete").mockResolvedValue(null);

    const result = await userService.deleteUserAccount("nonexistent-id");

    expect(result).toBe(false);
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

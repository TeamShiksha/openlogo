const { downloadUserData } = require("../../../controllers/users");
const UserService = require("../../../services/users");

jest.mock("../../../services/users");

describe("Controller: downloadUserData", () => {
  let req, res, next;
  const mockUserId = "user_123";

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      userData: { userId: mockUserId },
    };

    res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res),
      setHeader: jest.fn(() => res),
    };

    next = jest.fn();

    UserService.prototype.getUserDataForDownload = jest.fn();
  });

  it("should download user data on 200 happy path", async () => {
    const mockData = { profile: { name: "Test User" } };
    UserService.prototype.getUserDataForDownload.mockResolvedValue(mockData);

    await downloadUserData(req, res, next);

    expect(UserService.prototype.getUserDataForDownload).toHaveBeenCalledWith(
      mockUserId
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      `attachment; filename="user_data_${mockUserId}.json"`
    );
    expect(res.send).toHaveBeenCalledWith(JSON.stringify(mockData, null, 2));

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if service returns null", async () => {
    UserService.prototype.getUserDataForDownload.mockResolvedValue(null);

    await downloadUserData(req, res, next);

    expect(UserService.prototype.getUserDataForDownload).toHaveBeenCalledWith(
      mockUserId
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: "User not found." });

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next(err) if service throws an error", async () => {
    const mockError = new Error("Database failed");
    UserService.prototype.getUserDataForDownload.mockRejectedValue(mockError);

    await downloadUserData(req, res, next);

    expect(UserService.prototype.getUserDataForDownload).toHaveBeenCalledWith(
      mockUserId
    );

    expect(next).toHaveBeenCalledWith(mockError);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});

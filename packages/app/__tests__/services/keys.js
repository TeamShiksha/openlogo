const KeyService = require("../../services/keys");
const { KeysRepository } = require("../../repositories");
const { MOCK_KEYS } = require("../../utils/mocks");

jest.mock("../../repositories");

describe("KeyService", () => {
  let keyService;

  beforeEach(() => {
    keyService = new KeyService();
    jest.clearAllMocks();
  });

  it("should return empty array if keyIds list is empty", async () => {
    jest
      .spyOn(KeysRepository.prototype, "getMultipleKeys")
      .mockResolvedValue([]);

    const result = await keyService.getAllUserKeys([]);
    expect(result).toEqual([]);
  });

  it("should fetch multiple keys by IDs", async () => {
    const keyIds = [MOCK_KEYS[0]._id];
    const mockKeys = [MOCK_KEYS[0]];

    jest
      .spyOn(KeysRepository.prototype, "getMultipleKeys")
      .mockResolvedValue(mockKeys);

    const result = await keyService.getAllUserKeys(keyIds);
    expect(result).toEqual(mockKeys);
  });

  it("should return total number of keys", async () => {
    jest.spyOn(KeysRepository.prototype, "getKeysCount").mockResolvedValue(5);

    const count = await keyService.getKeysCount();
    expect(count).toBe(5);
  });

  it("should create a new key", async () => {
    const keyDescription = {
      user: MOCK_KEYS[0].user,
      key: "new-key-123",
      key_description: "Test Key",
      expires_at: "2025-07-23T14:32:18.456Z",
    };

    jest
      .spyOn(KeysRepository.prototype, "create")
      .mockResolvedValue(keyDescription);

    const result = await keyService.createNewKey(keyDescription);
    expect(result.key).toBe("new-key-123");
  });

  it("should destroy a key by ID", async () => {
    const keyId = MOCK_KEYS[0]._id;

    jest
      .spyOn(KeysRepository.prototype, "delete")
      .mockResolvedValue({ deleted: true });

    const result = await keyService.destroyKey(keyId);
    expect(result).toEqual({ deleted: true });
  });

  it("should update oldKeys without a expiry", async () => {
    const keyId = MOCK_KEYS[3]._id;
    jest
      .spyOn(KeysRepository.prototype, "getMultipleKeys")
      .mockResolvedValue([MOCK_KEYS[3]]);
    jest
      .spyOn(KeysRepository.prototype, "updateOldKeys")
      .mockResolvedValue(true);
    const result = await keyService.findUpdateKeyWithoutExpiry(keyId);
    expect(result).toEqual(true);
  });

  it("should not update any oldKey with a expiry", async () => {
    const keyId = MOCK_KEYS[2]._id;
    jest
      .spyOn(KeysRepository.prototype, "getMultipleKeys")
      .mockResolvedValue([MOCK_KEYS[2]]);
    jest
      .spyOn(KeysRepository.prototype, "updateOldKeys")
      .mockResolvedValue(false);
    const result = await keyService.findUpdateKeyWithoutExpiry(keyId);
    expect(result).toEqual(false);
  });

  it("should fetch user with subscription using api key", async () => {
    const apiKey = "123-abc";
    const mockResult = {
      user: {
        _id: "user123",
        name: "Test User",
      },
      subscription: {
        type: "HOBBY",
        key_limit: 2,
      },
    };

    jest
      .spyOn(KeysRepository.prototype, "fetchUserWithSubscription")
      .mockResolvedValue(mockResult);

    const result = await keyService.fetchUserWithSubscription(apiKey);
    expect(result.user.name).toBe("Test User");
    expect(result.subscription.type).toBe("HOBBY");
  });

  it("should return key if apiKey exists", async () => {
    const apiKey = MOCK_KEYS[0].key;

    jest
      .spyOn(KeysRepository.prototype, "getApiKey")
      .mockResolvedValue(MOCK_KEYS[0]);

    const result = await keyService.getApiKey(apiKey);
    expect(result.key).toBe(apiKey);
  });

  it("should return null if apiKey does not exist", async () => {
    jest.spyOn(KeysRepository.prototype, "getApiKey").mockResolvedValue(null);

    const result = await keyService.getApiKey("non-existent-key");
    expect(result).toBeNull();
  });
});

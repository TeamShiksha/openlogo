const { RequestService } = require("../../services");
const { RequestRepository } = require("../../repositories");
const { StatusTypes } = require("../../utils/constants.js");
const {
  MOCK_USERS,
  MOCK_REQUESTS,
  MOCK_REQUESTS_LIST,
} = require("../../utils/mocks.js");

jest.mock("../../repositories");

describe("RequestService", () => {
  let requestService;
  let mockFindByUserAndStatus;
  let mockFindByCompanyUrlAndStatus;
  let mockCreate;
  let mockGetRequestsCount;
  let mockGetAll;
  let mockGetHitsCount;
  let mockGetById;
  let mockUpdateRequestStatus;

  beforeEach(() => {
    requestService = new RequestService();
    jest.clearAllMocks();

    mockFindByUserAndStatus = jest.spyOn(
      RequestRepository.prototype,
      "findByUserAndStatus"
    );
    mockFindByCompanyUrlAndStatus = jest.spyOn(
      RequestRepository.prototype,
      "findByCompanyUrlAndStatus"
    );
    mockCreate = jest.spyOn(RequestRepository.prototype, "create");
    mockGetRequestsCount = jest.spyOn(
      RequestRepository.prototype,
      "getRequestsCount"
    );
    mockGetAll = jest.spyOn(RequestRepository.prototype, "getAll");
    mockGetHitsCount = jest.spyOn(RequestRepository.prototype, "getHitsCount");
    mockGetById = jest.spyOn(RequestRepository.prototype, "getById");
    mockUpdateRequestStatus = jest.spyOn(
      RequestRepository.prototype,
      "updateRequestStatus"
    );
  });
  const userId = MOCK_USERS[0]._id;
  const companyUrl = MOCK_REQUESTS[0].companyUrl;
  const formData = {
    user_id: userId,
    companyUrl: companyUrl,
  };
  const request = MOCK_REQUESTS[0];

  it("Should return false if no active request exists for the given user id", async () => {
    mockFindByUserAndStatus.mockResolvedValue(false);

    const result = await requestService.requestExistsForUser(userId);
    expect(result).toBeFalsy();
  });

  it("Should return true if an active request exists for the given user id", async () => {
    mockFindByUserAndStatus.mockResolvedValue({
      user_id: userId,
      status: StatusTypes.PENDING,
    });

    const result = await requestService.requestExistsForUser(userId);
    expect(result).toBeTruthy();
  });

  it("Should return false if no active request exists for the given company url", async () => {
    mockFindByCompanyUrlAndStatus.mockResolvedValue(null);

    const result = await requestService.requestExistsForCompanyUrl(companyUrl);
    expect(result).toBeFalsy();
  });

  it("Should return true if an active request exists for the given company url", async () => {
    mockFindByCompanyUrlAndStatus.mockResolvedValue({
      companyUrl: companyUrl,
      status: StatusTypes.PENDING,
    });

    const result = await requestService.requestExistsForCompanyUrl(companyUrl);
    expect(result).toBeTruthy();
  });

  it("throw error if request creation fails", async () => {
    mockCreate.mockRejectedValue(new Error("Request creation failed"));

    const result = requestService.createRaiseRequest(formData);
    await expect(result).rejects.toThrow("Request creation failed");
  });

  it("returns newRaiseRequest if request creation is successful", async () => {
    mockCreate.mockResolvedValue(request);

    const result = await requestService.createRaiseRequest(formData);
    expect(result).toEqual(request);
  });

  it("should return the total number of requests", async () => {
    mockGetRequestsCount.mockResolvedValue(5);
    const result = await requestService.getRequestsCount();
    expect(result).toEqual(5);
  });

  it("should return null if no request exists ", async () => {
    mockGetAll.mockResolvedValue(null);

    const result = await requestService.getPaginatedRequests(1, 10);
    expect(result).toEqual(null);
  });

  it("should return the list of requests", async () => {
    const requests = MOCK_REQUESTS_LIST[0];
    mockGetAll.mockResolvedValue(requests);
    const result = await requestService.getPaginatedRequests(1, 10);
    expect(result).toEqual(requests);
  });

  it("should return the total number of resolved requests", async () => {
    mockGetHitsCount.mockResolvedValue(5);
    const result = await requestService.getHitsCount();
    expect(result).toEqual(5);
  });

  it("should return null if no request exists", async () => {
    mockGetById.mockResolvedValue(null);
    const result = await requestService.getRequestById(userId);
    expect(result).toEqual(null);
  });

  it("should return the request", async () => {
    mockGetById.mockResolvedValue(request);
    const result = await requestService.getRequestById(request._id);
    expect(result).toEqual(request);
  });

  it("should return alreadyProcessed: true if request is already resolved", async () => {
    const { _id, user_id, status, operator_id, comment } = MOCK_REQUESTS[1];
    const mockRequest = { _id, user_id, status };
    const requestData = { _id, operator_id, status, comment };
    mockGetById.mockResolvedValue(mockRequest);
    const result = await requestService.respondToRequest(requestData);
    expect(result).toEqual({ alreadyProcessed: true });
  });

  it("should return alreadyProcessed: true if request is already rejected", async () => {
    const { _id, user_id, status, operator_id, comment } = MOCK_REQUESTS[2];
    const mockRequest = { _id, user_id, status };
    const requestData = { _id, operator_id, status, comment };
    mockGetById.mockResolvedValue(mockRequest);
    const result = await requestService.respondToRequest(requestData);
    expect(result).toEqual({ alreadyProcessed: true });
  });

  it("should return the updated request", async () => {
    const { _id, operator_id, status, comment } = request;
    const updatedRequest = { _id, operator: operator_id, status, comment };
    mockGetById.mockResolvedValue(request);
    mockUpdateRequestStatus.mockResolvedValue(updatedRequest);
    const result = await requestService.respondToRequest(updatedRequest);
    expect(result).toEqual(updatedRequest);
  });

  it("should throw error if modifiedCount is 0", async () => {
    const { _id, operator_id, status, comment } = request;
    const responseData = { _id, operator: operator_id, status, comment };
    mockGetById.mockResolvedValue(request);
    mockUpdateRequestStatus.mockResolvedValue({ modifiedCount: 0 });
    await expect(requestService.respondToRequest(responseData)).rejects.toThrow(
      "MongoDB operation failed"
    );
  });
});

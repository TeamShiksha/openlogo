const { ContactUsRepository } = require("../../repositories");
const { StatusTypes } = require("../../utils/constants");
const { ContactUsService } = require("../../services");
const { MOCK_CONTACTUS_FORM_DATA } = require("../../utils/mocks");

jest.mock("../../repositories");

describe("ContactUsService", () => {
  let contactUsService;

  let findByEmailAndStatusMock;
  let getByIdMock;
  let createMock;
  let updateFormStatusMock;
  let getFormsCountMock;
  let getAllMock;

  beforeEach(() => {
    contactUsService = new ContactUsService();
    jest.clearAllMocks();

    findByEmailAndStatusMock = jest.spyOn(
      ContactUsRepository.prototype,
      "findByEmailAndStatus"
    );
    getByIdMock = jest.spyOn(ContactUsRepository.prototype, "getById");
    createMock = jest.spyOn(ContactUsRepository.prototype, "create");
    updateFormStatusMock = jest.spyOn(
      ContactUsRepository.prototype,
      "updateFormStatus"
    );
    getFormsCountMock = jest.spyOn(
      ContactUsRepository.prototype,
      "getFormsCount"
    );
    getAllMock = jest.spyOn(ContactUsRepository.prototype, "getAll");
  });

  const { _id, name, email, message } = MOCK_CONTACTUS_FORM_DATA[0];
  const formData = { name, email, message };
  const formId = _id;

  it("should return true if request exists ", async () => {
    findByEmailAndStatusMock.mockResolvedValue({
      email,
      status: StatusTypes.PENDING,
    });

    const result = await contactUsService.formExists(email);
    expect(result).toBeTruthy();
  });

  it("should return false if request does not exist", async () => {
    findByEmailAndStatusMock.mockResolvedValue(null);

    const result = await contactUsService.formExists(email);
    expect(result).toBeFalsy();
  });

  it("should return the newly created form if creation is successful", async () => {
    const newForm = { name, email };

    createMock.mockResolvedValue(newForm);

    const result = await contactUsService.createForm(formData);
    expect(result).toEqual(newForm);
  });

  it("should throw an error if form not found", async () => {
    getByIdMock.mockResolvedValue(null);

    await expect(contactUsService.updateForm(formId)).rejects.toThrow(
      "Form not found"
    );
  });

  it("should throw an error if form is already replied when status is RESOLVED", async () => {
    getByIdMock.mockResolvedValue({ status: StatusTypes.RESOLVED });

    const result = await contactUsService.updateForm(formId);

    expect(result).toEqual({ alreadyReplied: true });
  });

  it("should throw an error if form is already replied when status is REJECTED", async () => {
    getByIdMock.mockResolvedValue({ status: StatusTypes.REJECTED });

    const result = await contactUsService.updateForm(formId);

    expect(result).toEqual({ alreadyReplied: true });
  });

  it("should throw error if modifiedCount is 0", async () => {
    getByIdMock.mockResolvedValue({ status: StatusTypes.PENDING });
    updateFormStatusMock.mockResolvedValue({ modifiedCount: 0 });
    await expect(contactUsService.updateForm(formId)).rejects.toThrow(
      "MongoDB operation failed"
    );
  });

  it("should return the updated form", async () => {
    const { _id, comment, status, operatorId, reply, closedAt } =
      MOCK_CONTACTUS_FORM_DATA[2];
    const updatedForm = {
      _id,
      comment,
      status,
      operator: operatorId,
      closedAt,
    };
    const requestData = { formId: _id, reply, status, operatorId };
    getByIdMock.mockResolvedValue(status);
    updateFormStatusMock.mockResolvedValue(updatedForm);
    const result = await contactUsService.updateForm(requestData);
    expect(result).toEqual(updatedForm);
  });

  it("should return null if form is not found", async () => {
    getByIdMock.mockResolvedValue(null);
    const result = await contactUsService.getForm(formId);
    expect(result).toBeNull();
  });

  it("should return the form object if found", async () => {
    const { _id, neme, email, message } = MOCK_CONTACTUS_FORM_DATA[2];
    const form = { _id, neme, email, message };
    getByIdMock.mockResolvedValue(form);
    const result = await contactUsService.getForm({ formId: _id });
    expect(result).toEqual(form);
  });

  it("should return total count of forms", async () => {
    const mockCount = 5;
    getFormsCountMock.mockResolvedValue(mockCount);
    const count = await contactUsService.getFormsCount();
    expect(count).toBe(mockCount);
  });

  it("should return null if no request exists", async () => {
    const page = 1;
    const limit = 10;
    const tab = "PENDING";
    getAllMock.mockResolvedValue(null);
    const result = await contactUsService.getPaginatedRequests(
      page,
      limit,
      tab
    );
    expect(result).toBeNull();
  });

  it("should return a list of requests", async () => {
    const page = 1;
    const limit = 10;
    const tab = "PENDING";
    const requests = {
      data: [
        MOCK_CONTACTUS_FORM_DATA[0],
        MOCK_CONTACTUS_FORM_DATA[1],
        MOCK_CONTACTUS_FORM_DATA[2],
      ],

      total: 3,
      currentPage: 1,
      totalPages: 1,
    };
    getAllMock.mockResolvedValue(requests);
    const result = await contactUsService.getPaginatedRequests(
      page,
      limit,
      tab
    );
    expect(result).toEqual(requests);
  });
});

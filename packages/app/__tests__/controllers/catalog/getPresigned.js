const request = require("supertest");
const { ImageService } = require("../../../services");
const { Users } = require("../../../models");
const { STATUS_CODES } = require("http");
const {
  MOCK_PRESIGNED_REQUEST_UPLOAD,
  MOCK_PRESIGNED_REQUEST_UPDATE,
  MOCK_USERS,
} = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("POST /api/catalog/signedUrl", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
    process.env.KEY = "logos";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
    delete process.env.KEY;
  });

  it("should return 400 if its upload type but image already exists", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();
    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue({ company_name: "GOOGLE" });

    const res = await request(app)
      .post("/api/catalog/signedUrl")
      .set("Cookie", `jwt=${token}`)
      .send({
        companyUri: MOCK_PRESIGNED_REQUEST_UPLOAD[0].body.companyUri,
        extension: MOCK_PRESIGNED_REQUEST_UPLOAD[0].body.extension,
        type: MOCK_PRESIGNED_REQUEST_UPLOAD[0].body.type,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.IMAGE_ALREADY_EXISTS,
    });
  });

  it("should return 400 if its update type but image does not exists", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();
    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockReturnValue(null);

    const res = await request(app)
      .post("/api/catalog/signedUrl")
      .set("Cookie", `jwt=${token}`)
      .send({
        companyUri: MOCK_PRESIGNED_REQUEST_UPDATE[0].body.companyUri,
        extension: MOCK_PRESIGNED_REQUEST_UPDATE[0].body.extension,
        type: MOCK_PRESIGNED_REQUEST_UPDATE[0].body.type,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: STATUS_CODES[400],
      statusCode: 400,
      message: Messages.IMAGE_NOT_EXIST,
    });
  });

  it("should return 200 and presigned Url and Key", async () => {
    const mockAdmin = new Users(MOCK_USERS[2]);
    const token = mockAdmin.generateJWT();

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);

    jest.spyOn(ImageService.prototype, "getPreSignedUrl").mockResolvedValue({
      presignedUrl:
        "https://mock-s3-bucket.s3.amazonaws.com/logos/png/GOOGLE.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=FAKECREDENTIAL&X-Amz-Date=20251002T000000Z&X-Amz-Expires=10&X-Amz-SignedHeaders=host&X-Amz-Signature=fake-signature",
      key: "logos/png/GOOGLE.png",
    });

    const res = await request(app)
      .post("/api/catalog/signedUrl")
      .set("Cookie", `jwt=${token}`)
      .send({
        companyUri: MOCK_PRESIGNED_REQUEST_UPLOAD[0].body.companyUri,
        extension: MOCK_PRESIGNED_REQUEST_UPLOAD[0].body.extension,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      statusCode: 200,
      data: {
        key: "logos/png/GOOGLE.png",
        presignedUrl:
          "https://mock-s3-bucket.s3.amazonaws.com/logos/png/GOOGLE.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=FAKECREDENTIAL&X-Amz-Date=20251002T000000Z&X-Amz-Expires=10&X-Amz-SignedHeaders=host&X-Amz-Signature=fake-signature",
      },
      message: Messages.UPLOAD_SUCCESS,
    });
  });
});

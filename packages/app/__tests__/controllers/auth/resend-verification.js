const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { Messages } = require("../../../utils/constants");
const { 
    UserTokenService,
    UserService
 } = require("../../../services");
const {
  MOCK_USERS
} = require("../../../utils/mocks");

const app = require("../../../server");

describe("RESEND VERIFICATION API", ()=>{
    beforeAll(()=>{
        jest.spyOn(UserService.prototype).mockResolvedValue([...MOCK_USERS]);
    })
    beforeEach(()=>{
        jest.restoreAllMocks();
    })
    it("422 - empty user data",async()=>{
        const response = await request(app)
        .post(ENDPOINTS.RESEND_VERIFICATION)
        .send({})
        .set("Content-Type","application/json");
        expect(response.status).toBe(422);
        expect(response.body).toEqual({
            error: STATUS_CODES[422],
            message: Messages.DATA_NOT_FOUND,
            statusCode: 422
        })
    });
    it("200 - already verified user",async()=>{
        const response=await request(app)
        .post(ENDPOINTS.RESEND_VERIFICATION)
        .send({email: MOCK_USERS[1].email}) // send already verified user email
        .set("Content-Type","application/json");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            statusCode: 200,
            message: Messages.EMAIL_ALREADY_VERIFIED,
            success: true,
            alreadyVerified: true,
        });
    });
    it("404 -  user email doesn't exists in  database",async()=>{
        const response=await request(app)
        .post(ENDPOINTS.RESEND_VERIFICATION)
        .send({email: "notSignedUpUser@gmail.com"}) // send email that doesn't signed up
        .set("Content-Type","application/json");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: STATUS_CODES[404],
            message: Messages.EMAIL_DOESNT_EXISTS,
            statusCode: 404,
        });
    });
    it("200 - verification link resended successfully",async()=>{
        const response = await request(app)
        .post(ENDPOINTS.RESEND_VERIFICATION)
        .send({email: MOCK_USERS[0].email}) // sent email that registered but not verified yet
        .set("Content-Type","application/json");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: Messages.EMAIL_SENT,
            success: true,
            statusCode: 200,
        });
    });

})
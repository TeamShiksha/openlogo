const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { SubscriptionTypes, UserType, UserTokenTypes } = require("./constants");

const MOCK_SUBSCRIPTION = [
  {
    _id: new mongoose.Types.ObjectId(),
    type: SubscriptionTypes.HOBBY,
    key_limit: 2,
    is_active: true,
    usage_limit: 5000,
    usage_count: 0,
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    type: SubscriptionTypes.PRO,
    key_limit: 5,
    is_active: true,
    usage_limit: 15000,
    usage_count: 15000,
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    type: SubscriptionTypes.TEAMS,
    key_limit: 10,
    is_active: true,
    usage_limit: 50000,
    usage_count: 0,
    updatedAt: new Date(),
  },
];

const MOCK_USERS = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John Doe",
    email: "johndoe@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: UserType.CUSTOMER,
    is_verified: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John Doe",
    email: "johndoe1@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: UserType.CUSTOMER,
    is_verified: true,
    subscription_id: new mongoose.Types.ObjectId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John Doe",
    email: "johndoe2@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: UserType.ADMIN,
    is_verified: true,
    subscription_id: new mongoose.Types.ObjectId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John Doe",
    email: "johndoe3@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: UserType.OPERATOR,
    is_verified: true,
    subscription_id: new mongoose.Types.ObjectId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Guest User",
    email: "guestuser@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: UserType.GUEST,
    is_verified: true,
    subscription_id: new mongoose.Types.ObjectId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const MOCK_USERTOKENS = [
  {
    _id: new mongoose.Types.ObjectId(),
    token: "bc65754f9175483ab9a186eee3161ae7",
    user_id: "user@1",
    type: UserTokenTypes.VERIFY,
    is_deleted: false,
    expireAt: new Date(Date.now() + 24 * 3600),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    token: "08ebea71113b4deda583d563dc640347",
    user_id: "user@2",
    type: UserTokenTypes.VERIFY,
    is_deleted: false,
    expireAt: new Date(Date.now() - 1),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    token: "19d096ae0c5b4ce2b4efd2858c8bcdfd",
    user_id: "user@3",
    type: UserTokenTypes.VERIFY,
    is_deleted: false,
    expireAt: new Date(Date.now() + 24 * 3600),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    token: "cf8aaabcead347baa35be08e8dd9963e",
    user_id: "user@3",
    type: UserTokenTypes.VERIFY,
    is_deleted: false,
    expireAt: new Date(Date.now() - 1),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    token: "123e4567e89b12d3a456426614174000",
    user_id: "user@4",
    type: UserTokenTypes.VERIFY,
    is_deleted: true,
    expireAt: new Date(Date.now() - 1),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    token: "a8f1b3c4e17f492abac541a6e2d37391",
    user_id: "user@5",
    type: UserTokenTypes.FORGOT,
    is_deleted: true,
    expireAt: new Date(Date.now() - 1),
  },
];

const MOCK_KEYS = [
  {
    user: new mongoose.Types.ObjectId(),
    key: "28482DNDO483ND3",
    key_description: "API-KEY-0",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    user: new mongoose.Types.ObjectId(),
    key: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    key_description: "API-KEY-1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    api_key: "G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8",
    key_description: "API-KEY-2",
    updated_at: new Date("2024-12-01T08:15:00Z"),
    subscription_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
    expires_at: new Date("2025-03-31T23:59:59Z"),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    api_key: "3fa85f64-5717-4562-a2fd-2c963f66afa6",
    key_description: "API-KEY-3",
    updated_at: new Date("2024-11-28T16:20:00Z"),
    subscription_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"),
  },
];

const MOCK_ANALYTICS_DATA_INPUT = [
  {
    title: "Users",
    value: 10,
  },
  {
    title: "Keys",
    value: 20,
  },

  {
    title: "Requests",
    value: 30,
  },
  {
    title: "ContactUs",
    value: 10,
  },
  {
    title: "Hits",
    value: 40,
  },
  {
    title: "Images",
    value: 28,
  },
];

const MOCK_ANALYTICS_DATA_OUTPUT = [
  {
    title: "Users",
    value: 10,
  },
  {
    title: "Keys",
    value: 20,
  },

  {
    title: "Requests",
    value: 40,
  },
  {
    title: "Hits",
    value: 40,
  },
  {
    title: "Images",
    value: 28,
  },
];

const MOCK_IMAGES = [
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[2]._id,
    company_uri: "https://example.com/google",
    company_name: "GOOGLE.png",
    image_size: 1024,
    is_deleted: false,
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[0]._id,
    company_uri: "https://example.com/microsoft",
    company_name: "MICROSOFT.png",
    image_size: 2048,
    is_deleted: false,
    updatedAt: new Date("2025-05-12T10:00:00Z"),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[1]._id,
    company_uri: "https://example.com/amazon",
    company_name: "AMAZON.png",
    image_size: 512,
    is_deleted: true,
    updatedAt: new Date("2025-04-18T15:30:00Z"),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[3]._id,
    company_uri: "https://example.com/apple",
    company_name: "APPLE.png",
    image_size: 3072,
    is_deleted: false,
    updatedAt: new Date("2025-02-01T08:45:00Z"),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[4]._id,
    company_uri: "https://example.com/meta",
    company_name: "META.png",
    image_size: 4096,
    is_deleted: false,
    updatedAt: new Date(),
  },
];

const MOCK_REQUESTS = [
  {
    _id: "123",
    user_id: MOCK_USERS[0]._id,
    companyUrl: "https://google.com",
    operator_id: "op1",
    status: "PENDING",
    comment: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "456",
    user_id: MOCK_USERS[1]._id,
    companyUrl: "https://microsoft.com",
    operator_id: "op2",
    status: "RESOLVED",
    comment: "Resolved by operator",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "789",
    user_id: MOCK_USERS[0]._id,
    companyUrl: "https://google.com",
    operator_id: "op3",
    status: "REJECTED",
    comment: "Rejected by operator",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_PRESIGNED_REQUEST_UPLOAD = [
  {
    body: {
      companyUri: "https://google.com/",
      extension: "png",
      type: "upload",
    },
  },
];

const MOCK_PRESIGNED_REQUEST_UPDATE = [
  {
    body: {
      companyUri: "https://google.com/",
      extension: "png",
      type: "update",
    },
  },
];

const MOCK_REQUESTS_LIST = [
  {
    data: [MOCK_REQUESTS[0], MOCK_REQUESTS[1]],
    total: 2,
    page: 1,
    limit: 10,
  },
];

const MOCK_CONTACTUS_FORM_DATA = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John Doe",
    email: "johndoe@example.com",
    message: "This is a test message",
    status: "PENDING",
    reply: "Pending",
    assignedTo: "dev",
    activityStatus: true,
    operatorId: "123",
    createdAt: new Date(),
    closedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John Doe",
    email: "johndoe@example.com",
    message: "This is a test message",
    status: "REJECTED",
    reply: "Rejected by operator",
    assignedTo: "dev",
    activityStatus: false,
    operatorId: "123",
    comment: "Rejected by operator",
    createdAt: new Date(),
    closedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "John Doe",
    email: "johndoe@example.com",
    message: "This is a test message",
    status: "RESOLVED",
    reply: "Resolved by operator",
    assignedTo: "dev",
    activityStatus: false,
    operatorId: "123",
    comment: "Resolved by operator",
    createdAt: new Date(),
    closedAt: new Date(),
  },
];

module.exports = {
  MOCK_SUBSCRIPTION,
  MOCK_USERS,
  MOCK_USERTOKENS,
  MOCK_KEYS,
  MOCK_ANALYTICS_DATA_INPUT,
  MOCK_ANALYTICS_DATA_OUTPUT,
  MOCK_IMAGES,
  MOCK_REQUESTS,
  MOCK_PRESIGNED_REQUEST_UPLOAD,
  MOCK_PRESIGNED_REQUEST_UPDATE,
  MOCK_REQUESTS_LIST,
  MOCK_CONTACTUS_FORM_DATA,
};

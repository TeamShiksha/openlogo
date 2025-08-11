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
    key_description: "API-KEY-1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
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
];

module.exports = {
  MOCK_SUBSCRIPTION,
  MOCK_USERS,
  MOCK_USERTOKENS,
  MOCK_KEYS,
  MOCK_ANALYTICS_DATA_INPUT,
  MOCK_ANALYTICS_DATA_OUTPUT,
  MOCK_IMAGES,
};

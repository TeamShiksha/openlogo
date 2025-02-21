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
];

module.exports = { MOCK_SUBSCRIPTION, MOCK_USERS, MOCK_USERTOKENS };

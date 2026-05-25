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
    _id: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
    key: "28482DNDO483ND3",
    keyDescription: "ZEROAPIKEY",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
    key: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    keyDescription: "FIRSTAPIKEY",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    key: "G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8",
    keyDescription: "SECONDAPIKEY",
    updated_at: new Date("2024-12-01T08:15:00Z"),
    expires_at: new Date("2025-03-31T23:59:59Z"),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    key: "3fa85f64-5717-4562-a2fd-2c963f66afa6",
    keyDescription: "API-KEY-3",
    updated_at: new Date("2024-11-28T16:20:00Z"),
    subscription_id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439014"),
  },
];

const MOCK_KEYS_VALIDITY_PERIOD = [
  {
    oneWeek: 7,
    oneMonth: 30,
    threeMonths: 90,
    sixMonths: 180,
    oneYear: 365,
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

const MOCK_LOGO_REQUESTS = [
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[0]._id,
    key_id: MOCK_KEYS[0]._id,
    image_id: MOCK_IMAGES[0]._id,
    response_size_bytes: 1024,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[1]._id,
    key_id: MOCK_KEYS[1]._id,
    image_id: MOCK_IMAGES[1]._id,
    response_size_bytes: 2048,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[0]._id,
    key_id: MOCK_KEYS[0]._id,
    image_id: MOCK_IMAGES[2]._id,
    response_size_bytes: 3072,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_WEEKLY_STATS = {
  period: "week",
  startDate: "2025-11-24",
  endDate: "2025-12-01",
  summary: {
    totalCount: 15,
    totalKB: "45.50",
  },
  data: [
    { date: "2025-11-24", count: 2, totalKB: 5.25 },
    { date: "2025-11-25", count: 3, totalKB: 8.75 },
    { date: "2025-11-26", count: 4, totalKB: 12 },
  ],
};

const MOCK_MONTHLY_STATS = {
  period: "month",
  startDate: "2025-11-01",
  endDate: "2025-12-01",
  summary: {
    totalCount: 50,
    totalKB: "150.75",
  },
  data: [
    { date: "2025-11-01", count: 5, totalKB: 15.25 },
    { date: "2025-11-05", count: 8, totalKB: 24.5 },
    { date: "2025-11-10", count: 12, totalKB: 36 },
  ],
};

const MOCK_SESSION_ID = "a".repeat(128);

const MOCK_USER_SESSIONS = [
  {
    sessionId: MOCK_SESSION_ID,
    userId: MOCK_USERS[0],
    token: "validToken",
    usedAt: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    sessionId: MOCK_SESSION_ID,
    userId: MOCK_USERS[1],
    token: "validToken",
    usedAt: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    sessionId: MOCK_SESSION_ID,
    userId: MOCK_USERS[2],
    token: "validToken",
    usedAt: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    sessionId: MOCK_SESSION_ID,
    userId: MOCK_USERS[3],
    token: "validToken",
    usedAt: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

// ImageService Mock Data
const MOCK_IMAGE_DETAIL = {
  _id: new mongoose.Types.ObjectId(),
  user_id: MOCK_USERS[2]._id,
  company_name: "GOOGLE.png",
  company_uri: "https://example.com/google",
  image_size: 1024,
  is_published: true,
  is_deleted: false,
  extension: "png",
  updated_at: new Date(),
};

const MOCK_IMAGE_DETAILS_LIST = [
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[2]._id,
    company_name: "GOOGLE.png",
    company_uri: "https://example.com/google",
    image_size: 1024,
    is_published: true,
    is_deleted: false,
    extension: "png",
    updated_at: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[0]._id,
    company_name: "MICROSOFT.png",
    company_uri: "https://example.com/microsoft",
    image_size: 2048,
    is_published: true,
    is_deleted: false,
    extension: "png",
    updated_at: new Date("2025-05-12T10:00:00Z"),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[1]._id,
    company_name: "AMAZON.png",
    company_uri: "https://example.com/amazon",
    image_size: 512,
    is_published: true,
    is_deleted: false,
    extension: "png",
    updated_at: new Date("2025-04-18T15:30:00Z"),
  },
];

const MOCK_CLOUDFRONT_URLS = [
  "https://cdn.myapp.com/png/GOOGLE.png?v=1755253230000",
  "https://cdn.myapp.com/png/MICROSOFT.png?v=1755253230001",
  "https://cdn.myapp.com/png/AMAZON.png?v=1755253230002",
];

const MOCK_IMAGE_URL_RESPONSE =
  "https://cdn.myapp.com/png/GOOGLE.png?v=1755253230000";

const MOCK_DATA_LIST_RESPONSE = [
  {
    companyName: "GOOGLE",
    image: "https://cdn.myapp.com/png/GOOGLE.png?v=1755253230000",
  },
  {
    companyName: "MICROSOFT",
    image: "https://cdn.myapp.com/png/MICROSOFT.png?v=1755253230001",
  },
  {
    companyName: "AMAZON",
    image: "https://cdn.myapp.com/png/AMAZON.png?v=1755253230002",
  },
];

const MOCK_IMAGES_PAGINATED_RESPONSE = {
  data: MOCK_IMAGE_DETAILS_LIST,
  total: 3,
  currentPage: 1,
  totalPages: 1,
};

const MOCK_IMAGES_COUNT = 3;

const MOCK_PRESIGNED_URL_RESPONSE = {
  presignedUrl: "https://openlogo-bucket.s3.amazonaws.com/presigned-url",
  key: "mockBucketKey/png/GOOGLE.png",
};

// Reward System Mock Data
const MOCK_REWARD_VALIDATION_RESPONSES = {
  hobbyUserNonEligible: {
    is_reward_eligible: false,
    reward_eligibility_reason: "HOBBY_USER",
  },
  selfUsageNonEligible: {
    is_reward_eligible: false,
    reward_eligibility_reason: "SELF_USAGE",
  },
  duplicateUsageNonEligible: {
    is_reward_eligible: false,
    reward_eligibility_reason: "DUPLICATE_USAGE",
  },
  validProUserEligible: {
    is_reward_eligible: true,
    reward_eligibility_reason: "VALID",
  },
};

const MOCK_REWARD_VALIDATION_REQUEST = {
  imageId: new mongoose.Types.ObjectId(),
  userId: new mongoose.Types.ObjectId(),
  creatorId: new mongoose.Types.ObjectId(),
  keyId: new mongoose.Types.ObjectId(),
  subscriptionId: new mongoose.Types.ObjectId(),
  userAgent: "Mozilla/5.0",
};

const MOCK_PROCESS_REWARDS_SINGLE_MILESTONE = {
  success: true,
  newMilestones: [{ milestone: 5, points: 10 }],
};

const MOCK_PROCESS_REWARDS_MULTIPLE_MILESTONES = {
  success: true,
  newMilestones: [
    { milestone: 5, points: 10 },
    { milestone: 10, points: 10 },
    { milestone: 15, points: 10 },
  ],
};

const MOCK_PROCESS_REWARDS_NO_DUPLICATE = {
  success: true,
  newMilestones: [{ milestone: 10, points: 10 }],
};

const MOCK_USER_REWARD_DATA = {
  userId: new mongoose.Types.ObjectId(),
  currentRewardPoints: 100,
  lifetimeRewardPoints: 500,
};

const MOCK_REWARDS_LEADERBOARD = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Creator 5",
    reward_points_lifetime: 500,
    rank: 1,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Creator 4",
    reward_points_lifetime: 400,
    rank: 2,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Creator 3",
    reward_points_lifetime: 300,
    rank: 3,
  },
];

const MOCK_REVERSE_TRANSACTION_RESPONSE = {
  success: true,
  pointsReversed: 10,
  transactionId: new mongoose.Types.ObjectId(),
};

// Reward Transaction Mock Data
const MOCK_REWARD_TRANSACTION = {
  _id: new mongoose.Types.ObjectId(),
  user_id: MOCK_USERS[0]._id,
  image_id: MOCK_IMAGES[0]._id,
  creator_id: MOCK_USERS[2]._id,
  points_earned: 10,
  points_type: "USAGE_REWARD",
  is_reversed: false,
  reversed_at: null,
  reversal_reason: null,
  transaction_date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_REWARD_TRANSACTIONS_LIST = [
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[0]._id,
    image_id: MOCK_IMAGES[0]._id,
    creator_id: MOCK_USERS[2]._id,
    points_earned: 10,
    points_type: "USAGE_REWARD",
    is_reversed: false,
    transaction_date: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[1]._id,
    image_id: MOCK_IMAGES[1]._id,
    creator_id: MOCK_USERS[0]._id,
    points_earned: 15,
    points_type: "MILESTONE_REWARD",
    is_reversed: false,
    transaction_date: new Date(Date.now() - 172800000),
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    user_id: MOCK_USERS[2]._id,
    image_id: MOCK_IMAGES[2]._id,
    creator_id: MOCK_USERS[1]._id,
    points_earned: 20,
    points_type: "BONUS_POINTS",
    is_reversed: false,
    transaction_date: new Date(Date.now() - 259200000),
    createdAt: new Date(Date.now() - 259200000),
  },
];

const MOCK_USER_TRANSACTION_STATS = {
  userId: MOCK_USERS[0]._id,
  totalPointsEarned: 150,
  totalPointsReversed: 10,
  currentBalance: 140,
  totalTransactions: 15,
  totalMilestones: 3,
  averagePointsPerTransaction: 10,
  lastTransactionDate: new Date(),
};

const MOCK_BONUS_POINTS_AWARD = {
  success: true,
  userId: MOCK_USERS[0]._id,
  pointsAwarded: 50,
  reason: "Referral bonus",
  transactionId: new mongoose.Types.ObjectId(),
  newBalance: 190,
};

const MOCK_IMAGE_TRANSACTION_SUMMARY = {
  imageId: MOCK_IMAGES[0]._id,
  totalRewardsEarned: 100,
  creatorEarnings: 100,
  usageCount: 10,
  averagePointsPerUsage: 10,
  milestones: [
    { milestone: 5, pointsAwarded: 50, achievedAt: new Date() },
    { milestone: 10, pointsAwarded: 50, achievedAt: new Date() },
  ],
};

const MOCK_AUDIT_TRAIL_ENTRY = {
  _id: new mongoose.Types.ObjectId(),
  transactionId: new mongoose.Types.ObjectId(),
  action: "POINTS_AWARDED",
  actor: MOCK_USERS[3]._id,
  details: "Awarded 10 points for usage",
  timestamp: new Date(),
  userAgent: "Mozilla/5.0",
};

const MOCK_AUDIT_TRAIL_LIST = [
  {
    _id: new mongoose.Types.ObjectId(),
    transactionId: new mongoose.Types.ObjectId(),
    action: "POINTS_AWARDED",
    actor: MOCK_USERS[3]._id,
    details: "Awarded 10 points for usage",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    transactionId: new mongoose.Types.ObjectId(),
    action: "TRANSACTION_REVERSED",
    actor: MOCK_USERS[3]._id,
    details: "Reversed transaction due to abuse",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    transactionId: new mongoose.Types.ObjectId(),
    action: "BONUS_AWARDED",
    actor: MOCK_USERS[3]._id,
    details: "Awarded 50 bonus points",
    timestamp: new Date(Date.now() - 10800000),
  },
];

const MOCK_TRANSACTION_SEARCH_RESPONSE = {
  data: MOCK_REWARD_TRANSACTIONS_LIST,
  total: 3,
  page: 1,
  limit: 10,
  totalPages: 1,
};

// Reward Tracking Service Mock Factories
const createMockLogoRequestLogEntry = () => ({
  _id: new mongoose.Types.ObjectId(),
  user_id: "user123",
  key_id: "key123",
  image_id: "image123",
  user_agent: "Mozilla/5.0",
  response_size_bytes: 1024,
  user_plan: SubscriptionTypes.PRO,
  is_reward_eligible: true,
  reward_eligibility_reason: "VALID",
  createdAt: new Date(),
});

const createValidRewardTrackingParams = () => ({
  imageId: "image123",
  userId: "user123",
  creatorId: "creator456",
  keyId: "key123",
  subscriptionId: "sub123",
  subscription: { type: SubscriptionTypes.PRO },
  userAgent: "Mozilla/5.0",
  response_size_bytes: 1024,
});

const MOCK_REWARD_TRACKING_SCENARIOS = {
  hobbyUser: {
    params: {
      imageId: "image123",
      userId: "user123",
      creatorId: "creator456",
      keyId: "key123",
      subscriptionId: "sub123",
      subscription: { type: SubscriptionTypes.HOBBY },
      userAgent: "Mozilla/5.0",
    },
    expected: {
      is_reward_eligible: false,
      reward_eligibility_reason: "HOBBY_USER",
    },
  },
  selfUsage: {
    params: {
      imageId: "image123",
      userId: "user123",
      creatorId: "user123",
      keyId: "key123",
      subscriptionId: "sub123",
      subscription: { type: SubscriptionTypes.PRO },
      userAgent: "Mozilla/5.0",
    },
    expected: {
      is_reward_eligible: false,
      reward_eligibility_reason: "SELF_USAGE",
    },
  },
  duplicateUsage: {
    params: {
      imageId: "image123",
      userId: "user123",
      creatorId: "creator456",
      keyId: "key123",
      subscriptionId: "sub123",
      subscription: { type: SubscriptionTypes.PRO },
      userAgent: "Mozilla/5.0",
    },
    expected: {
      is_reward_eligible: false,
      reward_eligibility_reason: "DUPLICATE_USAGE",
    },
  },
  validProUser: {
    params: {
      imageId: "image123",
      userId: "user123",
      creatorId: "creator456",
      keyId: "key123",
      subscriptionId: "sub123",
      subscription: { type: SubscriptionTypes.PRO },
      userAgent: "Mozilla/5.0",
    },
    expected: {
      is_reward_eligible: true,
      reward_eligibility_reason: "VALID",
    },
  },
};
const REWARD_TEST_IMAGE_ID = new mongoose.Types.ObjectId();
const REWARD_TEST_CREATOR_ID = new mongoose.Types.ObjectId();

const REWARD_TEST_PRO_USER_IDS_10 = Array.from(
  { length: 10 },
  () => new mongoose.Types.ObjectId()
);
const REWARD_TEST_PRO_USER_IDS_15 = Array.from(
  { length: 15 },
  () => new mongoose.Types.ObjectId()
);

const createMockRewardRecordEmpty = () => ({
  _id: new mongoose.Types.ObjectId(),
  image_id: REWARD_TEST_IMAGE_ID,
  user_id: REWARD_TEST_CREATOR_ID,
  unique_pro_users: [],
  unique_pro_users_count: 0,
  milestones_achieved: [],
  total_points_awarded: 0,
});
const createMockRewardRecord5Achieved = () => ({
  _id: new mongoose.Types.ObjectId(),
  image_id: REWARD_TEST_IMAGE_ID,
  user_id: REWARD_TEST_CREATOR_ID,
  unique_pro_users: [...REWARD_TEST_PRO_USER_IDS_10.slice(0, 5)],
  unique_pro_users_count: 5,
  milestones_achieved: [
    { milestone: 5, achieved_at: new Date(), points_awarded: 10 },
  ],
  total_points_awarded: 10,
});

const MOCK_ELIGIBLE_LOG_ENTRIES_5 = REWARD_TEST_PRO_USER_IDS_10.slice(0, 5).map(
  (userId) => ({
    _id: new mongoose.Types.ObjectId(),
    user_id: userId,
    image_id: REWARD_TEST_IMAGE_ID,
    user_plan: SubscriptionTypes.PRO,
    is_reward_eligible: true,
    reward_eligibility_reason: "VALID",
    createdAt: new Date(),
  })
);

const MOCK_ELIGIBLE_LOG_ENTRIES_5_SECOND = REWARD_TEST_PRO_USER_IDS_10.slice(
  5,
  10
).map((userId) => ({
  _id: new mongoose.Types.ObjectId(),
  user_id: userId,
  image_id: REWARD_TEST_IMAGE_ID,
  user_plan: SubscriptionTypes.PRO,
  is_reward_eligible: true,
  reward_eligibility_reason: "VALID",
  createdAt: new Date(),
}));
const MOCK_ELIGIBLE_LOG_ENTRIES_15 = REWARD_TEST_PRO_USER_IDS_15.map(
  (userId) => ({
    _id: new mongoose.Types.ObjectId(),
    user_id: userId,
    image_id: REWARD_TEST_IMAGE_ID,
    user_plan: SubscriptionTypes.PRO,
    is_reward_eligible: true,
    reward_eligibility_reason: "VALID",
    createdAt: new Date(),
  })
);

const MOCK_REWARD_CREATOR_USER = {
  _id: REWARD_TEST_CREATOR_ID,
  name: "Creator User",
  email: "creator@example.com",
  reward_points_current: 0,
  reward_points_lifetime: 0,
};

const MOCK_REWARD_USER_WITH_POINTS = {
  _id: new mongoose.Types.ObjectId(),
  name: "Rewards User",
  email: "rewards@example.com",
  reward_points_current: 100,
  reward_points_lifetime: 500,
};

const MOCK_USER_REWARD_RECORDS = [
  {
    _id: new mongoose.Types.ObjectId(),
    image_id: MOCK_IMAGES[0]._id,
    user_id: MOCK_REWARD_USER_WITH_POINTS._id,
    unique_pro_users: Array.from(
      { length: 10 },
      () => new mongoose.Types.ObjectId()
    ),
    total_points_awarded: 20,
    milestones_achieved: [
      { milestone: 5, achieved_at: new Date(), points_awarded: 10 },
      { milestone: 10, achieved_at: new Date(), points_awarded: 10 },
    ],
  },
];

const MOCK_LOG_ENTRY_HOBBY = {
  _id: new mongoose.Types.ObjectId(),
  user_plan: SubscriptionTypes.HOBBY,
  response_size_bytes: 0,
  is_reward_eligible: false,
  reward_eligibility_reason: "HOBBY_USER",
  createdAt: new Date(),
};

const MOCK_LOG_ENTRY_SELF_USAGE = {
  _id: new mongoose.Types.ObjectId(),
  user_plan: SubscriptionTypes.PRO,
  response_size_bytes: 0,
  is_reward_eligible: false,
  reward_eligibility_reason: "SELF_USAGE",
  createdAt: new Date(),
};

const MOCK_LOG_ENTRY_DUPLICATE = {
  _id: new mongoose.Types.ObjectId(),
  user_plan: SubscriptionTypes.PRO,
  response_size_bytes: 0,
  is_reward_eligible: false,
  reward_eligibility_reason: "DUPLICATE_USAGE",
  createdAt: new Date(),
};

const MOCK_LOG_ENTRY_VALID = {
  _id: new mongoose.Types.ObjectId(),
  user_plan: SubscriptionTypes.PRO,
  response_size_bytes: 1024,
  is_reward_eligible: true,
  reward_eligibility_reason: "VALID",
  createdAt: new Date(),
};
const MOCK_UNREVERSED_TRANSACTION = {
  _id: new mongoose.Types.ObjectId(),
  image_id: MOCK_IMAGES[0]._id,
  user_id: MOCK_USERS[0]._id,
  transaction_type: "MILESTONE_REWARD",
  points_awarded: 10,
  is_reversed: false,
  description: "Milestone 5 reached",
};

const MOCK_REVERSED_TRANSACTION = {
  ...MOCK_UNREVERSED_TRANSACTION,
  is_reversed: true,
  reversed_at: new Date(),
  reversal_reason: "Abuse detected",
};
const MOCK_PAGINATED_REWARDS_FOR_LEADERBOARD = {
  data: [
    {
      user_id: {
        _id: MOCK_USERS[0]._id,
        name: "Creator A",
        email: "a@example.com",
      },
      image_id: MOCK_IMAGES[0]._id,
      unique_pro_users: Array.from(
        { length: 15 },
        () => new mongoose.Types.ObjectId()
      ),
      total_points_awarded: 30,
      milestones_achieved: [
        { milestone: 5, achieved_at: new Date(), points_awarded: 10 },
        { milestone: 10, achieved_at: new Date(), points_awarded: 10 },
        { milestone: 15, achieved_at: new Date(), points_awarded: 10 },
      ],
    },
    {
      user_id: {
        _id: MOCK_USERS[1]._id,
        name: "Creator B",
        email: "b@example.com",
      },
      image_id: MOCK_IMAGES[1]._id,
      unique_pro_users: Array.from(
        { length: 10 },
        () => new mongoose.Types.ObjectId()
      ),
      total_points_awarded: 20,
      milestones_achieved: [
        { milestone: 5, achieved_at: new Date(), points_awarded: 10 },
        { milestone: 10, achieved_at: new Date(), points_awarded: 10 },
      ],
    },
    {
      user_id: {
        _id: MOCK_USERS[2]._id,
        name: "Creator C",
        email: "c@example.com",
      },
      image_id: MOCK_IMAGES[2]._id,
      unique_pro_users: Array.from(
        { length: 5 },
        () => new mongoose.Types.ObjectId()
      ),
      total_points_awarded: 10,
      milestones_achieved: [
        { milestone: 5, achieved_at: new Date(), points_awarded: 10 },
      ],
    },
  ],
  total: 3,
  currentPage: 1,
  totalPages: 1,
};

// Integration scenario factories
const createMockIntegrationValidProScenario = () => {
  const userId = new mongoose.Types.ObjectId();
  const creatorId = new mongoose.Types.ObjectId();
  const params = {
    imageId: "logo-apple",
    userId,
    creatorId,
    keyId: "key-123",
    subscriptionId: "sub-pro-001",
    subscription: { type: SubscriptionTypes.PRO },
  };
  return {
    params,
    mockLogEntry: {
      _id: new mongoose.Types.ObjectId(),
      user_id: userId,
      key_id: params.keyId,
      image_id: params.imageId,
      user_plan: SubscriptionTypes.PRO,
      is_reward_eligible: true,
      reward_eligibility_reason: "VALID",
    },
  };
};

const createMockIntegrationSelfUsageScenario = () => ({
  params: {
    imageId: "logo-apple",
    userId: "user123",
    creatorId: "user123",
    keyId: "key-123",
    subscriptionId: "sub-pro-001",
    subscription: { type: SubscriptionTypes.PRO },
  },
  mockLogEntry: {
    _id: new mongoose.Types.ObjectId(),
    is_reward_eligible: false,
    reward_eligibility_reason: "SELF_USAGE",
  },
});

const createMockIntegrationObjectIdScenario = () => {
  const userId = new mongoose.Types.ObjectId();
  const creatorId = new mongoose.Types.ObjectId();
  const params = {
    imageId: "apple-logo-2024",
    userId,
    creatorId,
    keyId: "api-key-abc123",
    subscriptionId: "sub-pro-xyz",
    subscription: { type: SubscriptionTypes.PRO },
  };
  return {
    params,
    mockLogEntry: {
      _id: new mongoose.Types.ObjectId(),
      user_id: userId,
      key_id: params.keyId,
      image_id: params.imageId,
      user_plan: SubscriptionTypes.PRO,
      is_reward_eligible: true,
      reward_eligibility_reason: "VALID",
    },
  };
};

// const createValidRewardTrackingParams = () => ({
//   imageId: "image123",
//   userId: "user123",
//   creatorId: "creator456",
//   keyId: "key123",
//   subscriptionId: "sub123",
//   subscription: { type: SubscriptionTypes.PRO },
// });

const MOCK_MILESTONE_CONFIG = {
  _id: new mongoose.Types.ObjectId(),
  name: "Q1 2026 Campaign",
  thresholds: [
    { at: 5, points: 10 },
    { at: 10, points: 10 },
    { at: 15, points: 10 },
    { at: 20, points: 10 },
    { at: 25, points: 10 },
    { at: 50, points: 20 },
    { at: 100, points: 50 },
  ],
  is_active: true,
  is_deleted: false,
  created_by: MOCK_USERS[2]._id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_MILESTONE_CONFIG_INACTIVE = {
  _id: new mongoose.Types.ObjectId(),
  name: "Q2 2026 Campaign",
  thresholds: [
    { at: 10, points: 15 },
    { at: 25, points: 30 },
    { at: 50, points: 75 },
  ],
  is_active: false,
  is_deleted: false,
  created_by: MOCK_USERS[2]._id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
module.exports = {
  MOCK_SUBSCRIPTION,
  MOCK_USERS,
  MOCK_USERTOKENS,
  MOCK_KEYS,
  MOCK_KEYS_VALIDITY_PERIOD,
  MOCK_ANALYTICS_DATA_INPUT,
  MOCK_ANALYTICS_DATA_OUTPUT,
  MOCK_IMAGES,
  MOCK_REQUESTS,
  MOCK_PRESIGNED_REQUEST_UPLOAD,
  MOCK_PRESIGNED_REQUEST_UPDATE,
  MOCK_REQUESTS_LIST,
  MOCK_CONTACTUS_FORM_DATA,
  MOCK_LOGO_REQUESTS,
  MOCK_WEEKLY_STATS,
  MOCK_MONTHLY_STATS,
  MOCK_SESSION_ID,
  MOCK_USER_SESSIONS,
  MOCK_IMAGE_DETAIL,
  MOCK_IMAGE_DETAILS_LIST,
  MOCK_CLOUDFRONT_URLS,
  MOCK_IMAGE_URL_RESPONSE,
  MOCK_DATA_LIST_RESPONSE,
  MOCK_IMAGES_PAGINATED_RESPONSE,
  MOCK_IMAGES_COUNT,
  MOCK_PRESIGNED_URL_RESPONSE,
  MOCK_REWARD_VALIDATION_RESPONSES,
  MOCK_REWARD_VALIDATION_REQUEST,
  MOCK_PROCESS_REWARDS_SINGLE_MILESTONE,
  MOCK_PROCESS_REWARDS_MULTIPLE_MILESTONES,
  MOCK_PROCESS_REWARDS_NO_DUPLICATE,
  MOCK_USER_REWARD_DATA,
  MOCK_REWARDS_LEADERBOARD,
  MOCK_REVERSE_TRANSACTION_RESPONSE,
  MOCK_REWARD_TRANSACTION,
  MOCK_REWARD_TRANSACTIONS_LIST,
  MOCK_USER_TRANSACTION_STATS,
  MOCK_BONUS_POINTS_AWARD,
  MOCK_IMAGE_TRANSACTION_SUMMARY,
  MOCK_AUDIT_TRAIL_ENTRY,
  MOCK_AUDIT_TRAIL_LIST,
  MOCK_TRANSACTION_SEARCH_RESPONSE,
  createMockLogoRequestLogEntry,
  createValidRewardTrackingParams,
  createMockIntegrationValidProScenario,
  createMockIntegrationSelfUsageScenario,
  createMockIntegrationObjectIdScenario,
  MOCK_REWARD_TRACKING_SCENARIOS,
  REWARD_TEST_IMAGE_ID,
  REWARD_TEST_CREATOR_ID,
  createMockRewardRecordEmpty,
  createMockRewardRecord5Achieved,
  MOCK_ELIGIBLE_LOG_ENTRIES_5,
  MOCK_ELIGIBLE_LOG_ENTRIES_5_SECOND,
  MOCK_ELIGIBLE_LOG_ENTRIES_15,
  MOCK_REWARD_CREATOR_USER,
  MOCK_REWARD_USER_WITH_POINTS,
  MOCK_USER_REWARD_RECORDS,
  MOCK_LOG_ENTRY_HOBBY,
  MOCK_LOG_ENTRY_SELF_USAGE,
  MOCK_LOG_ENTRY_DUPLICATE,
  MOCK_LOG_ENTRY_VALID,
  MOCK_UNREVERSED_TRANSACTION,
  MOCK_REVERSED_TRANSACTION,
  MOCK_PAGINATED_REWARDS_FOR_LEADERBOARD,
  MOCK_MILESTONE_CONFIG,
  MOCK_MILESTONE_CONFIG_INACTIVE,
};

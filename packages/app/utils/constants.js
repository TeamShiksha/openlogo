/**
 * @readonly
 * @enum {string}
 **/

const EmailValidationRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

const UserTokenTypes = {
  FORGOT: "FORGOT",
  VERIFY: "VERIFY",
};

const TokenExpiry = {
  [UserTokenTypes.VERIFY]: { unit: "day", value: 1 },
  [UserTokenTypes.FORGOT]: { unit: "minute", value: 10 },
};

const UserType = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  OPERATOR: "OPERATOR",
  GUEST: "GUEST",
};

const SubscriptionTypes = {
  HOBBY: "HOBBY",
  PRO: "PRO",
  TEAMS: "TEAMS",
};

const StatusTypes = {
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  RESOLVED: "RESOLVED",
};

const TAB_OPTIONS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
};

const DefaultSubscriptionPlan = {
  type: SubscriptionTypes.HOBBY,
  key_limit: 2,
  usage_limit: 500,
  usage_count: 0,
  is_active: true,
};

const ProSubscriptionPlan = {
  type: SubscriptionTypes.PRO,
  key_limit: 5,
  usage_limit: 15000,
  is_active: true,
};

const Messages = {
  INVALID_USER_ID: "Invalid user id.",
  EMAIL_EXISTS: "Email already exists.",
  EMAIL_DOESNT_EXISTS: "Email doesn't exists.",
  ACCOUNT_DOESNT_EXISTS: "Account does not exist.",
  USER_NOT_FOUND: "User not found.",
  DATA_NOT_FOUND: "User data not found.",
  SOMETHING_WENT_WRONG:
    "We're experiencing high demand. Please try again later.",
  INCORRECT_EMAIL_PASS: "Incorrect email or password.",
  EMAIL_NOT_VERIFIED: "Email not verified",
  SESSION_FAIL: "User session validation failed.",
  INVALID_TOKEN: "Invalid token.",
  EXPIRED_TOKEN: "Token expired.",
  VERIFICATION_FAIL: "Verification failed.",
  EMAIL_ALREADY_VERIFIED:
    "This email has already been verified. You can sign in to your account.",
  PASS_FAILED: "Failed to update password.",
  IMAGE_REQUIRED: "Image not found in request.",
  NAME_AND_EXT_SAME: "Name and extension should be same.",
  UPLOAD_FAILED: "Image upload failed.",
  IMAGE_ALREADY_EXISTS: "Image already exists.",
  UPDATE_IMAGE_FAILED: "Failed to update image record.",
  UPLOAD_SUCCESS: "Image updated successfully.",
  INVALID_KEY: "Invalid API key.",
  LIMIT_REACHED: "Limit reached. Consider upgrading your plan.",
  LOGO_NOT_FOUND: "Logo not found.",
  FETCH_ALL_MESSAGE: "Fetched all contact us messages.",
  MESSAGE_NOT_FOUND: "Message not found.",
  IMAGE_NOT_EXIST: "Image does not exist",
  ALREADY_SEND_RESPOND: "Already sent the response.",
  UPDATE_SUCCESS: "Responded successfully.",
  INCORRECT_PASSWORD: "Current password is incorrect",
  SAME_PASSWORD: "Current password is same as old password",
  INTERNAL_SERVER_ERROR:
    "An unexpected error occurred. Please try again later.",
  FORM_ALREADY_SUBMITTED: "Form already submitted, try again later",
  USER_CREATED: "User created successfully. Please verify your email.",
  EMAIL_REQUIRED: "Email is required",
  NAME_REQUIRED: "Name is required",
  INVALID_EMAIL: "Invalid email",
  UNSUPPORTED_ROLE: "Only admin and operator roles are allowed",
  FORM_SUBMITTED: "Form submitted, our team will get in touch shortly",
  FETCH_ALL_REQUESTS: "Fetched all logo requests",
  LOGO_REQUEST_NOT_FOUND: "Logo request not found",
  LOGO_REQUEST_ALREADY_PROCESSED: "Request already processed",
  LOGO_REQUEST_CREATED: "Logo request created successfully",
  USER_ALREADY_HAS_PENDING: "You already have a pending request.",
  COMPANY_URL_ALREADY_PENDING: "This company url is already under review.",
  TRY_AGAIN: "Try again after 24 hours.",
  FAILED_UPDATE_TOKEN: "Failed to update token.",
  RESEND_EMAIL: "Resent a new Verification Email.",
  RESEND_EMAIL_FAILED: "Failed to resend verification email.",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
  SENT_FORGOT_PASSWORD_EMAIL: "Email sent to reset password.",
  LOGO_ALREADY_CREATED_AND_PENDING:
    "Logo has already been created and is currently pending.",
  CREATED_LOGO_NOT_FOUND: "Created logo not found",
  API_KEY_EXPIRED: "This Key has got expired.",
  UPDATE_API_KEY: "This Key needs an update.",
  MFA_FAILED: "Failed to enable/disable MFA",
  INCORRECT_PIN: "Incorrect pin. Please try again.",
  SUBSCRIPTION_NOT_FOUND: "Subscription not found.",
  PLAN_ALREADY_ACTIVE: "User is already on this plan.",
  PLAN_CHANGE_SUCCESS: "Subscription plan updated successfully.",
  SESSION_NOT_FOUND: "Session not found.",
  CANNOT_REVOKE_CURRENT_SESSION:
    "Cannot revoke current session. Use signout instead.",
  SESSION_LIMIT_EXCEEDED: "Maximum number of active sessions exceeded.",
  INVALID_ID: "Invalid ID format.",
};

const MAX_SESSIONS_PER_USER = 5;

const RewardMessages = {
  IMAGE_ID_REQUIRED: "Image ID is required",
  IMAGE_NOT_FOUND: "No reward data found for this image",
  TRANSACTION_NOT_FOUND: "Transaction not found",
  TRANSACTION_ID_REQUIRED: "Transaction ID is required",
  MISSING_BONUS_FIELDS: "Missing required fields: imageId, userId, points",
  POINTS_MUST_BE_POSITIVE: "Points must be greater than 0",
  BONUS_AWARDED: "Bonus points awarded successfully",
  REVERSAL_REASON_REQUIRED: "Reversal reason is required",
  TRANSACTION_REVERSED: "Transaction reversed successfully",
  MISSING_REQUEST_FIELDS:
    "Missing required fields: imageId, userId, creatorId, keyId, subscription",
  REQUEST_LOGGED: "Request logged for reward eligibility",
  MILESTONE_NOT_FOUND: "MilestoneConfig not found",
  MILESTONE_CREATED: "MilestoneConfig created successfully",
  MILESTONE_UPDATED: "MilestoneConfig updated successfully",
  MILESTONE_DELETED: "MilestoneConfig deleted successfully",
  MILESTONE_ACTIVATED:
    "MilestoneConfig activated — takes effect on the next worker run",
  NAME_REQUIRED: "name is required",
  THRESHOLDS_REQUIRED: "thresholds must be a non-empty array",
  THRESHOLD_INVALID:
    'Each threshold must have positive numeric "at" and "points" values',
  NAME_OR_THRESHOLDS_REQUIRED:
    "At least one of name or thresholds must be provided",
  CONFIG_ALREADY_ACTIVE: "Config is already active",
};

const ExtractCompanyNameFromUrlRegex = /:\/\/(?:www\.)?([^./]+)\./i;

const CLOUD_FRONT_REGION = "us-east-1";

const getIsProduction = () =>
  process.env.NODE_ENV?.trim().toLowerCase() === "prod";

const USER_SAFE_FIELDS =
  "name email role is_verified subscription_id created_at is_deleted updated_at ";

const SESSION_ID_REGEX = /^[a-f0-9]{128}$/i;

const TEMPORARY_SESSION_TYPES = {
  PASSWORD_RESET: "PASSWORD_RESET",
  MFA: "MFA",
};

/**
 * OLD_RELEASES: Historical archived release data (pre-MongoDB era).
 *
 * @description
 * This array contains release data for versions published BEFORE the automated
 * GitHub → MongoDB release sync pipeline was implemented.
 *
 * ─── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 * The MongoDB `releases` collection is strictly for new releases synced from GitHub
 * via `scripts/syncReleases.js`. Historical releases lack required fields like
 * `githubReleaseId`, `githubReleaseUrl`, and `prNumber` — so they cannot be stored
 * in the database without violating the schema.
 *
 * ─── HOW IT IS SERVED ────────────────────────────────────────────────────────
 * • GET /api/releases       → included as `archivedReleases` in the response.
 *                             NOTE: Pagination does NOT apply to this array.
 * • GET /api/releases/:version → `ReleaseService.getReleaseByVersion()` checks
 *                             this array FIRST before querying MongoDB.
 *
 * ─── ADDING NEW RELEASES ──────────────────────────────────────────────────────
 * DO NOT add new releases here. All new releases should be published on GitHub
 * and synced to MongoDB via the sync script / GitHub Action.
 *
 * @readonly
 */
const OLD_RELEASES = [
  {
    version: "0.8.0 version",
    releaseDate: "May 2026",
    entries: [
      {
        title: "Revamp USER dashboard according to the design.",
        category: "Enhancement",
        contributor: {
          username: "AryaDharkar",
        },
      },
      {
        title: "Enhancing the UI of the admin dashboard.",
        category: "Enhancement",
        contributor: {
          username: "L-Tarun-Aditya",
        },
      },
      {
        title: "Add 2FA section in user settings.",
        category: "Enhancement",
        contributor: {
          username: "L-Tarun-Aditya",
        },
      },
      {
        title: "Implementing a dedicated settings page for MFA.",
        category: "Enhancement",
        contributor: {
          username: "L-Tarun-Aditya",
        },
      },
      {
        title: "Multi factor authentication.",
        category: "Enhancement",
        contributor: {
          username: "MukeshAbhi",
        },
      },
      {
        title: "Prevent Users From Reusing Old Password During Password Reset.",
        category: "Enhancement",
        contributor: {
          username: "rishang14",
        },
      },
      {
        title:
          "Fix bugs on createLogo page and allow users to access this page without authentication.",
        category: "Enhancement",
        contributor: {
          username: "AryaDharkar",
        },
      },
      {
        title: "Feature for user session management.",
        category: "Enhancement",
        contributor: {
          username: "kadamsahil2511",
        },
      },
      {
        title:
          "Feature to enforce branch & PR naming conventions via husky + GitHub Actions.",
        category: "Enhancement",
        contributor: {
          username: "Smayur0",
        },
      },
      {
        title: "Redesign documentation page.",
        category: "Enhancement",
        contributor: {
          username: "Dhirenderchoudhary",
        },
      },
      {
        title: "Revamp sign in and sign up form",
        category: "Enhancement",
        contributor: {
          username: "0-mstrmind",
        },
      },
    ],
  },
  {
    version: "0.7.0 version",
    releaseDate: "Mar 2026",
    entries: [
      {
        title:
          "Authentication has been migrated from JWT to a secure session-based system, improving overall security and simplifying token management.",
        category: "Enhancement",
        contributor: {
          username: "Mantu01",
        },
      },
      {
        title:
          "You can now switch between Light and Dark themes to personalize your experience.",
        category: "Enhancement",
        contributor: {
          username: "sachinkmrsin",
        },
      },
      {
        title:
          "Notifications are now available for important events such as API expiry and usage limit being reached, so you never miss critical updates.",
        category: "Enhancement",
        contributor: {
          username: "YashDevani-source",
        },
      },
      {
        title:
          "You can now create and use your own custom logo image directly within the platform.",
        category: "Enhancement",
        contributor: {
          username: "biplab-sutradhar",
        },
      },
      {
        title:
          "API keys are now securely hidden to prevent accidental exposure and enhance account security.",
        category: "Enhancement",
        contributor: {
          username: "L-Tarun-Aditya",
        },
      },
    ],
  },
  {
    version: "0.6.0 version",
    releaseDate: "Dec 2025",
    entries: [
      {
        title:
          "You can now view a simple graph on your dashboard that helps you understand how much you’re using the API, including how many requests you’ve made and how much data you’ve used.",
        category: "Enhancement",
        contributor: {
          username: "L-Tarun-Aditya",
        },
      },
      {
        title:
          "API keys now expire automatically to keep accounts more secure. Users can set a custom expiry date, and existing API keys will expire after one year by default.",
        category: "Enhancement",
        contributor: {
          username: "biplab-sutradhar",
        },
      },
      {
        title:
          "Catalogs are now created automatically, so you don’t need to set them up manually anymore.",
        category: "Enhancement",
        contributor: {
          username: "BansalAbhinav",
        },
      },
      {
        title:
          "A new Release Page is now available, where you can easily see what’s new in each version and who helped build it.",
        category: "Enhancement",
        contributor: {
          username: "abhishek-2k23",
        },
      },
      {
        title:
          "If you don’t receive your verification email, you can now resend it easily and continue without getting stuck.",
        category: "Enhancement",
        contributor: {
          username: "MukeshAbhi",
        },
      },
    ],
  },
  {
    version: "Previous version",
    releaseDate: "Oct 2024",
    entries: [
      {
        title:
          "Dates are now displayed in a consistent and clear format across the entire platform.",
        category: "Enhancement",
        contributor: {
          username: "Sumitgitup",
        },
      },
      {
        title:
          "You can now easily download a copy of your data from the platform whenever you need it.",
        category: "Enhancement",
        contributor: {
          username: "Sumitgitup",
        },
      },
      {
        title:
          "Navigation has been simplified by grouping Dashboard and Sign Out options under a single profile menu.",
        category: "Enhancement",
        contributor: {
          username: "abhishek-2k23",
        },
      },
      {
        title:
          "Updates made by admins now show up instantly, so users always see the latest content without delays.",
        category: "Enhancement",
        contributor: {
          username: "MukeshAbhi",
        },
      },
      {
        title:
          "Image uploads are now faster and more stable, especially when uploading large files.",
        category: "Enhancement",
        contributor: {
          username: "printgourav",
        },
      },
      {
        title:
          "If you miss the verification email, you can now resend it directly without any hassle.",
        category: "Enhancement",
        contributor: {
          username: "MukeshAbhi",
        },
      },
      {
        title:
          "Admins can now quickly see how many images are stored in the system from the dashboard.",
        category: "Enhancement",
        contributor: {
          username: "printgourav",
        },
      },
      {
        title:
          "The platform moved from Firebase to MongoDB to better support growth and handle data more efficiently.",
        category: "Enhancement",
        contributor: {
          username: "amankumarsingh77",
        },
      },
      {
        title:
          "Testing was improved by switching to a faster and more reliable testing setup.",
        category: "Enhancement",
        contributor: {
          username: "Ayushsanjdev",
        },
      },
      {
        title:
          "A new Operator dashboard was added to make it easier to manage and respond to customer queries.",
        category: "Enhancement",
        contributor: {
          username: "asharma991",
        },
      },
      {
        title:
          "Admins gained the ability to re-upload images with checks to ensure correct file names and formats.",
        category: "Enhancement",
        contributor: {
          username: "Soumava-221B",
        },
      },
      {
        title:
          "Subscription usage limits are now reset automatically every month, removing the need for manual updates.",
        category: "Enhancement",
        contributor: {
          username: "DeltaDynamo",
        },
      },
      {
        title:
          "Several visual and usability improvements were made across the footer, About page, and sign-in experience.",
        category: "Enhancement",
        contributor: {
          username: "AryaDharkar",
        },
      },
      {
        title:
          "A new logo search feature was added, making it easier to find and retrieve logos securely.",
        category: "Enhancement",
        contributor: {
          username: "DeltaDynamo",
        },
      },
      {
        title:
          "Navigation behavior was improved so pages smoothly return to the top when links are clicked.",
        category: "Enhancement",
        contributor: {
          username: "Asin-Junior-Honore",
        },
      },
      {
        title:
          "An extra confirmation step was added before deleting API keys to help prevent accidental deletions.",
        category: "Enhancement",
        contributor: {
          username: "anandbaraik",
        },
      },
      {
        title:
          "API keys can now be viewed or copied only once, improving overall account security.",
        category: "Enhancement",
        contributor: {
          username: "Sharathxct",
        },
      },
    ],
  },
];

module.exports = {
  OLD_RELEASES,
  EmailValidationRegex,
  ExtractCompanyNameFromUrlRegex,
  UserTokenTypes,
  TokenExpiry,
  UserType,
  SubscriptionTypes,
  StatusTypes,
  DefaultSubscriptionPlan,
  ProSubscriptionPlan,
  Messages,
  TAB_OPTIONS,
  CLOUD_FRONT_REGION,
  getIsProduction,
  USER_SAFE_FIELDS,
  SESSION_ID_REGEX,
  TEMPORARY_SESSION_TYPES,
  MAX_SESSIONS_PER_USER,
  RewardMessages,
};

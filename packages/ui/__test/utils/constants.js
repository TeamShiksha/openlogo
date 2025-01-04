const PLANS = [
  {
    index: 0,
    name: "HOBBY",
    pricing: 0,
    tagline: "Ideal for small teams and startups.",
    keypoints: [
      "Fortune 500 company logo",
      "500 API calls per month",
      "2 API keys",
      "Basic analytics",
      "48-72 hour of response time",
    ],
  },
  {
    index: 1,
    name: "PRO",
    pricing: 1500,
    tagline: "Growing teams up to 20 users.",
    keypoints: [
      "Fortune 500 company logo + private images",
      "10000 API calls per month",
      "5 API keys",
      "Advance analytics",
      "12-36 hours of response time",
    ],
  },
  {
    index: 2,
    name: "CUSTOM PRICING",
    pricing: null,
    tagline: "Large teams with unlimited users.",
    keypoints: [
      "Fortune 500 company logo + unlimited private logos",
      "Unlimited API calls per month",
      "50 API keys",
      "Advance analytics",
      "Priority support",
    ],
  },
];

export default PLANS;

export const SETTING = [
  {
    title: "Download account data",
    subtitle: "Download your account data and move to other device with ease.",
    buttontitle: "Download",
  },
  {
    title: "Delete account",
    subtitle:
      "This will permanently delete your account and all associated data.",
    buttontitle: "Delete Account",
  },
];

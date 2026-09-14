/**
 * Historical release data for the one-time MongoDB backfill.
 *
 * Source: GitHub release bodies and metadata.
 *
 * Missing historical PR numbers/contributors are intentionally represented
 * as null rather than inferred.
 *
 * This file is used by seedHistoricalReleases.js only.
 */

const historicalReleases = [
  {
    version: "0.1.0",
    tagName: "v1.0.0",
    releaseDate: new Date("2024-07-01T11:31:07Z"),
    githubReleaseId: 163328281,
    githubReleaseUrl:
      "https://github.com/TeamShiksha/openlogo/releases/tag/v1.0.0",

    entries: [
      {
        category: "Feature",
        prNumber: null,
        title: "Logo Retrieval API",
        description:
          "Fetch company logos in PNG format using the /api/business/logo endpoint.",
        contributors: null,
      },
      {
        category: "Feature",
        prNumber: null,
        title: "API Key Generation",
        description:
          "Users can generate and manage their API key through the dashboard.",
        contributors: null,
      },
      {
        category: "Feature",
        prNumber: null,
        title: "Company Logo Availability Search",
        description:
          "Users can check whether a company's logo is available by searching with the exact domain name.",
        contributors: null,
      },
      {
        category: "Feature",
        prNumber: null,
        title: "Admin Image Upload",
        description:
          "Admins can upload their own images through the admin page using drag and drop.",
        contributors: null,
      },
      {
        category: "Feature",
        prNumber: null,
        title: "Authentication",
        description:
          "Includes signup, sign in, logout, and forgot-password functionality.",
        contributors: null,
      },
      {
        category: "Feature",
        prNumber: null,
        title: "Profile Management",
        description:
          "Users can update profile details, update their password, and delete their account.",
        contributors: null,
      },
    ],
  },

  {
    version: "0.2.0",
    tagName: "1.1.0",
    releaseDate: new Date("2024-10-05T16:02:52Z"),
    githubReleaseId: 178529582,
    githubReleaseUrl:
      "https://github.com/TeamShiksha/openlogo/releases/tag/1.1.0",

    entries: [
      {
        category: "Bug Fix",
        prNumber: 339,
        title: "Navigation links scroll to top on click",
        description: "",
        contributors: [{ username: "Asin-Junior-Honore" }],
      },
      {
        category: "Feature",
        prNumber: 344,
        title: "Show confirmation modal on click of delete API key button",
        description: "",
        contributors: [{ username: "anandbaraik" }],
      },
      {
        category: "Other",
        prNumber: 345,
        title: "Migrate database from Firestore to MongoDB",
        description: "",
        contributors: [{ username: "amankumarsingh77" }],
      },
      {
        category: "Enhancement",
        prNumber: 350,
        title: "Made usageCount functional",
        description: "",
        contributors: [{ username: "amankumarsingh77" }],
      },
      {
        category: "Feature",
        prNumber: 347,
        title: "One-time API Key View/Copy",
        description: "",
        contributors: [{ username: "Sharathxct" }],
      },
      {
        category: "Other",
        prNumber: 358,
        title:
          "Add Automated Script to Reset Subscription Usage Count Every 30 Days",
        description: "",
        contributors: [{ username: "DeltaDynamo" }],
      },
      {
        category: "Bug Fix",
        prNumber: 360,
        title:
          "NaN in usageCount on user dashboard and remove duplicate userId in API response",
        description: "",
        contributors: [{ username: "amankumarsingh77" }],
      },
      {
        category: "Bug Fix",
        prNumber: 363,
        title: "Reset and forget password API",
        description: "",
        contributors: [{ username: "amankumarsingh77" }],
      },
      {
        category: "Feature",
        prNumber: 365,
        title: "Admin Image Re-upload with Name & Extension Verification",
        description: "",
        contributors: [{ username: "Soumava-221B" }],
      },
      {
        category: "Feature",
        prNumber: 357,
        title: "Operator UI + APIs",
        description: "",
        contributors: [{ username: "asharma991" }],
      },
      {
        category: "Feature",
        prNumber: 366,
        title: "Logo Search API",
        description: "",
        contributors: [{ username: "DeltaDynamo" }],
      },
      {
        category: "Other",
        prNumber: 376,
        title: "Updates client test cases from Jest to Vitest",
        description: "",
        contributors: [{ username: "Ayushsanjdev" }],
      },
      {
        category: "Enhancement",
        prNumber: 373,
        title: "Footer, Sign-in Card, and About Section UI Improvements",
        description: "",
        contributors: [{ username: "AryaDharkar" }],
      },
    ],
  },

  {
    version: "0.3.0",
    tagName: "0.3.0",
    releaseDate: new Date("2025-09-01T18:07:42Z"),
    githubReleaseId: 243938725,
    githubReleaseUrl:
      "https://github.com/TeamShiksha/openlogo/releases/tag/0.3.0",

    entries: [
      {
        category: "Other",
        prNumber: 389,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "sujal111" }],
      },
      {
        category: "Other",
        prNumber: 397,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "ayush19sinha" }],
      },
      {
        category: "Other",
        prNumber: 413,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Katsuya21" }],
      },
      {
        category: "Other",
        prNumber: 415,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Hariom01010" }],
      },
      {
        category: "Other",
        prNumber: 448,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "001AM" }],
      },
      {
        category: "Other",
        prNumber: 462,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "abhishek-2k23" }],
      },
      {
        category: "Other",
        prNumber: 456,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Chandanadsc" }],
      },
      {
        category: "Other",
        prNumber: 463,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "akshayaparida" }],
      },
      {
        category: "Other",
        prNumber: 450,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Ruchita3429" }],
      },
      {
        category: "Other",
        prNumber: 495,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "mridxl" }],
      },
      {
        category: "Other",
        prNumber: 515,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "tanwarAalok" }],
      },
      {
        category: "Other",
        prNumber: 518,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "shafat730" }],
      },
      {
        category: "Other",
        prNumber: 546,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "iamalhera" }],
      },
      {
        category: "Other",
        prNumber: 611,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Drshnnn" }],
      },
      {
        category: "Other",
        prNumber: 597,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "farhan294sha" }],
      },
      {
        category: "Other",
        prNumber: 613,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "GautamRaj-1200" }],
      },
      {
        category: "Other",
        prNumber: 612,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "theboyofdream" }],
      },
      {
        category: "Other",
        prNumber: 619,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "strawHat121" }],
      },
      {
        category: "Other",
        prNumber: 622,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "anshika282" }],
      },
      {
        category: "Other",
        prNumber: 638,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "dependabot[bot]" }],
      },
      {
        category: "Other",
        prNumber: 658,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Idontnol" }],
      },
      {
        category: "Other",
        prNumber: 664,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Allan2000-Git" }],
      },
      {
        category: "Other",
        prNumber: 642,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "keshrinandan99" }],
      },
      {
        category: "Other",
        prNumber: 673,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "SushankSinha" }],
      },
      {
        category: "Other",
        prNumber: 676,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "RajeshPhayde" }],
      },
      {
        category: "Other",
        prNumber: 678,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "ShlokMane" }],
      },
      {
        category: "Other",
        prNumber: 688,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "printgourav" }],
      },
      {
        category: "Other",
        prNumber: 690,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Ravisukhwal76" }],
      },
      {
        category: "Other",
        prNumber: 667,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "Aniketvish0" }],
      },
      {
        category: "Other",
        prNumber: 782,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "biplab-sutradhar" }],
      },
      {
        category: "Other",
        prNumber: 781,
        title: "First Contribution",
        description: "",
        contributors: [{ username: "YashDevani-source" }],
      },
    ],
  },

  {
    version: "0.5.0",
    tagName: "0.5.0",
    releaseDate: new Date("2025-11-30T10:28:01Z"),
    githubReleaseId: 266182710,
    githubReleaseUrl:
      "https://github.com/TeamShiksha/openlogo/releases/tag/0.5.0",

    entries: [
      {
        category: "Bug Fix",
        prNumber: 864,
        title: "Date Format Consistency",
        description: "",
        contributors: [{ username: "Sumitgitup" }],
      },
      {
        category: "Feature",
        prNumber: 878,
        title: "Enabled download button & let user download their data",
        description: "",
        contributors: [{ username: "Sumitgitup" }],
      },
      {
        category: "Feature",
        prNumber: 879,
        title: "Dashboard & signout within a single dropdown",
        description: "",
        contributors: [{ username: "abhishek-2k23" }, { username: "nazibul7" }],
      },
      {
        category: "Enhancement",
        prNumber: 884,
        title: "Cache invalidation support",
        description: "",
        contributors: [{ username: "MukeshAbhi" }],
      },
      {
        category: "Other",
        prNumber: 851,
        title: "S3 upload flow update",
        description: "",
        contributors: [
          { username: "printgourav" },
          { username: "YashDevani-source" },
        ],
      },
      {
        category: "Feature",
        prNumber: 876,
        title: "Resend email verification",
        description: "",
        contributors: [{ username: "MukeshAbhi" }],
      },
      {
        category: "Feature",
        prNumber: 877,
        title: "Resend email verification",
        description: "",
        contributors: [{ username: "MukeshAbhi" }],
      },
      {
        category: "Enhancement",
        prNumber: 859,
        title: "Show total number of images available with admin",
        description: "",
        contributors: [{ username: "printgourav" }],
      },
    ],
  },

  {
    version: "0.6.0",
    tagName: "0.6.0",
    releaseDate: new Date("2026-01-02T16:38:02Z"),
    githubReleaseId: 271931742,
    githubReleaseUrl:
      "https://github.com/TeamShiksha/openlogo/releases/tag/0.6.0",

    entries: [
      {
        category: "Feature",
        prNumber: null,
        title: "API Usage Graph",
        description:
          "You can now view a simple graph on your dashboard that helps you understand how much you’re using the API, including how many requests you’ve made and how much data you’ve used.",
        contributors: [
          { username: "L-Tarun-Aditya" },
          { username: "sachinkmrsin" },
          { username: "YashDevani-source" },
        ],
      },
      {
        category: "Security",
        prNumber: null,
        title: "Automatic API Key Expiration",
        description:
          "API keys now expire automatically to keep accounts more secure. Users can set a custom expiry date, and existing API keys will expire after one year by default.",
        contributors: [
          { username: "biplab-sutradhar" },
          { username: "printgourav" },
        ],
      },
      {
        category: "Feature",
        prNumber: null,
        title: "Automatic Catalog Creation",
        description:
          "Catalogs are now created automatically, so you don’t need to set them up manually anymore.",
        contributors: [
          { username: "BansalAbhinav" },
          { username: "Saurabhupadhyay8170" },
        ],
      },
      {
        category: "Feature",
        prNumber: null,
        title: "Release Page",
        description:
          "A new Release Page is now available, where you can easily see what’s new in each version and who helped build it.",
        contributors: [{ username: "abhishek-2k23" }],
      },
      {
        category: "Enhancement",
        prNumber: null,
        title: "Resend Verification Email",
        description:
          "If you don’t receive your verification email, you can now resend it easily and continue without getting stuck.",
        contributors: [{ username: "MukeshAbhi" }],
      },
    ],
  },

  {
    version: "0.7.0",
    tagName: "0.7.0",
    releaseDate: new Date("2026-03-01T06:40:49Z"),
    githubReleaseId: 291754187,
    githubReleaseUrl:
      "https://github.com/TeamShiksha/openlogo/releases/tag/0.7.0",

    entries: [
      {
        category: "Security",
        prNumber: null,
        title:
          "Authentication migrated from JWT to a secure session-based system",
        description:
          "Authentication has been migrated from JWT to a secure session-based system, improving overall security and simplifying token management.",
        contributors: [
          { username: "Mantu01" },
          { username: "Smayur0" },
          { username: "printgourav" },
        ],
      },
      {
        category: "Enhancement",
        prNumber: null,
        title: "Dynamic Light and Dark themes",
        description:
          "You can now switch between Light and Dark themes to personalize your experience.",
        contributors: [{ username: "sachinkmrsin" }],
      },
      {
        category: "Enhancement",
        prNumber: null,
        title: "Notifications for API expiry and usage limits",
        description:
          "Notifications are now available for important events such as API expiry and usage limit being reached.",
        contributors: [
          { username: "YashDevani-source" },
          { username: "L-Tarun-Aditya" },
        ],
      },
      {
        category: "Feature",
        prNumber: null,
        title: "Custom Logo Creation",
        description:
          "You can now create and use your own custom logo image directly within the platform.",
        contributors: [
          { username: "biplab-sutradhar" },
          { username: "mridul-giri" },
        ],
      },
      {
        category: "Security",
        prNumber: null,
        title: "API Key Masking",
        description:
          "API keys are now securely hidden to prevent accidental exposure and enhance account security.",
        contributors: [{ username: "L-Tarun-Aditya" }],
      },
    ],
  },

  {
    version: "0.8.0",
    tagName: "0.8.0",
    releaseDate: new Date("2026-06-19T19:46:10Z"),
    githubReleaseId: 342105677,
    githubReleaseUrl:
      "https://github.com/TeamShiksha/openlogo/releases/tag/0.8.0",

    entries: [
      {
        category: "Enhancement",
        prNumber: null,
        title: "Revamp USER dashboard according to the design",
        description: "",
        contributors: [{ username: "AryaDharkar" }],
      },
      {
        category: "Enhancement",
        prNumber: null,
        title: "Enhancing the UI of the admin dashboard",
        description: "",
        contributors: [{ username: "L-Tarun-Aditya" }],
      },
      {
        category: "Security",
        prNumber: null,
        title: "Add 2FA section in user settings",
        description: "",
        contributors: [{ username: "L-Tarun-Aditya" }],
      },
      {
        category: "Security",
        prNumber: null,
        title: "Implementing a dedicated settings page for MFA",
        description: "",
        contributors: [{ username: "L-Tarun-Aditya" }],
      },
      {
        category: "Security",
        prNumber: null,
        title: "Multi factor authentication",
        description: "",
        contributors: [{ username: "MukeshAbhi" }],
      },
      {
        category: "Security",
        prNumber: null,
        title: "Prevent Users From Reusing Old Password During Password Reset",
        description: "",
        contributors: [{ username: "rishang14" }],
      },
      {
        category: "Feature",
        prNumber: null,
        title:
          "Fix bugs on createLogo page and allow users to access this page without authentication",
        description: "",
        contributors: [{ username: "AryaDharkar" }],
      },
      {
        category: "Security",
        prNumber: null,
        title: "Feature for user session management",
        description: "",
        contributors: [
          { username: "kadamsahil2511" },
          { username: "DeepAkdotcom" },
        ],
      },
      {
        category: "Other",
        prNumber: null,
        title:
          "Feature to enforce branch & PR naming conventions via husky + GitHub Actions",
        description: "",
        contributors: [{ username: "Smayur0" }],
      },
      {
        category: "Enhancement",
        prNumber: null,
        title: "Redesign documentation page",
        description: "",
        contributors: [{ username: "Dhirenderchoudhary" }],
      },
      {
        category: "Enhancement",
        prNumber: null,
        title: "Revamp sign in and sign up form",
        description: "",
        contributors: [{ username: "0-mstrmind" }, { username: "kunjesh360" }],
      },
    ],
  },
];

module.exports = historicalReleases;

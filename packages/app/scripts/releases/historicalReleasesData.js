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
        title: "User Authentication System",
        description:
          "Includes signup, sign in, logout, and forgot-password functionality.",
        contributors: null,
      },
      {
        category: "Feature",
        prNumber: null,
        title: "User Profile Management",
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
        title: "Navigation Links Scroll To Top",
        description:
          "Fixes page navigation behavior by automatically scrolling to the top whenever the route changes.",
        contributors: [{ username: "Asin-Junior-Honore" }],
      },
      {
        category: "Feature",
        prNumber: 344,
        title: "Delete API Key Confirmation Modal",
        description:
          "Adds a confirmation modal before deleting an API key, allowing users to confirm or cancel the deletion.",
        contributors: [{ username: "anandbaraik" }],
      },
      {
        category: "Enhancement",
        prNumber: 345,
        title: "Migrate Database From Firestore To MongoDB",
        description:
          "Migrates the application's database and services from Firestore to MongoDB, removes Firebase dependencies, updates the data models and services, and adds MongoDB setup documentation.",
        contributors: [{ username: "amankumarsingh77" }],
      },
      {
        category: "Enhancement",
        prNumber: 350,
        title: "Make Usage Count Functional",
        description:
          "Makes subscription usage tracking functional by maintaining usageCount, enforcing API usage limits, and displaying usage data from the subscription on the user dashboard.",
        contributors: [{ username: "amankumarsingh77" }],
      },
      {
        category: "Feature",
        prNumber: 347,
        title: "One-Time API Key View And Copy",
        description:
          "Changes API key handling so the generated key is displayed and available for copying only once, while removing stored API key values from subsequent dashboard responses.",
        contributors: [{ username: "Sharathxct" }],
      },
      {
        category: "Enhancement",
        prNumber: 358,
        title: "Automated Subscription Usage Reset Every 30 Days",
        description:
          "Adds a scheduled GitHub Actions workflow and MongoDB script that automatically resets subscription usage counts every 30 days based on the subscription creation date.",
        contributors: [{ username: "DeltaDynamo" }],
      },
      {
        category: "Bug Fix",
        prNumber: 360,
        title: "Fix Usage Count And Duplicate User ID",
        description:
          "Fixes usageCount displaying as NaN on the user dashboard and removes duplicated user information from key and subscription API responses.",
        contributors: [{ username: "amankumarsingh77" }],
      },
      {
        category: "Bug Fix",
        prNumber: 363,
        title: "Reset And Forgot Password API",
        description:
          "Fixes the reset and forgot password APIs by correctly deriving the user ID from the MongoDB user record and storing it in the reset-password session token.",
        contributors: [{ username: "amankumarsingh77" }],
      },
      {
        category: "Feature",
        prNumber: 365,
        title: "Admin Image Re-Upload With Verification",
        description:
          "Adds image re-upload functionality to the admin dashboard, allowing existing images to be replaced while enforcing matching image names and file extensions.",
        contributors: [{ username: "Soumava-221B" }],
      },
      {
        category: "Feature",
        prNumber: 357,
        title: "Operator UI And APIs",
        description:
          "Adds an operator interface with APIs for viewing customer queries, paginating results, and sending responses back to customers.",
        contributors: [{ username: "asharma991" }],
      },
      {
        category: "Feature",
        prNumber: 366,
        title: "Logo Search API",
        description:
          "Adds public and API-key-protected logo search endpoints that return logo URLs based on domain-name prefixes, with validation and test coverage.",
        contributors: [{ username: "DeltaDynamo" }],
      },
      {
        category: "Other",
        prNumber: 376,
        title: "Migrate Client Tests From Jest To Vitest",
        description:
          "Migrates the client-side test suite from Jest to Vitest and updates test mocks, assertions, dependencies, and configuration for the new test runner.",
        contributors: [{ username: "Ayushsanjdev" }],
      },
      {
        category: "Enhancement",
        prNumber: 373,
        title: "Footer Sign-In And About UI Improvements",
        description:
          "Improves the footer, sign-in form layout, and About page by reorganizing navigation elements, repositioning the forgot-password link, and restructuring content into cards.",
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
        category: "Enhancement",
        prNumber: 389,
        title: "Add Repository Layer For Models",
        description:
          "Introduces a reusable BaseRepository with model-specific repositories for common database operations. Also adds user-specific key lookup support.",
        contributors: [{ username: "sujal111" }],
      },
      {
        category: "Enhancement",
        prNumber: 397,
        title: "Add Documentation And Issue Templates",
        description:
          "Adds dedicated GitHub issue templates for documentation and other issues, making reports easier to structure and classify.",
        contributors: [{ username: "ayush19sinha" }],
      },
      {
        category: "Feature",
        prNumber: 413,
        title: "Add API Demo Section",
        description:
          "Adds a redesigned API demo section to the landing page with search-driven interaction and responsive styling.",
        contributors: [{ username: "Katsuya21" }],
      },
      {
        category: "Feature",
        prNumber: 415,
        title: "Add Responsive Pricing Section",
        description:
          "Introduces a responsive pricing section with plan cards, key benefits, pricing details, and mobile-friendly layouts.",
        contributors: [{ username: "Hariom01010" }],
      },
      {
        category: "Feature",
        prNumber: 448,
        title: "Add Site Footer Component",
        description:
          "Adds a responsive footer with navigation links, OpenLogo branding, copyright information, and TeamShiksha attribution.",
        contributors: [{ username: "001AM" }],
      },
      {
        category: "Enhancement",
        prNumber: 462,
        title: "Refine Features Section Layout",
        description:
          "Updates the Features section spacing, typography, icon styling, and responsive behavior to better match the landing-page design.",
        contributors: [{ username: "abhishek-2k23" }],
      },
      {
        category: "Enhancement",
        prNumber: 456,
        title: "Update Pricing Section UI",
        description:
          "Updates pricing cards with rupee pricing, new plan labels, improved styling, a pricing route, and homepage placement.",
        contributors: [{ username: "Chandanadsc" }],
      },
      {
        category: "Feature",
        prNumber: 463,
        title: "Add Contact Form Modal",
        description:
          "Introduces a Get In Touch modal with name, email, and message fields, validation, success feedback, and responsive styling.",
        contributors: [{ username: "akshayaparida" }],
      },
      {
        category: "Feature",
        prNumber: 450,
        title: "Add Signup Authentication Form",
        description:
          "Adds a responsive signup modal with input validation and backend API integration for account creation.",
        contributors: [{ username: "Ruchita3429" }],
      },
      {
        category: "Bug Fix",
        prNumber: 495,
        title: "Fix Get In Touch Overlay",
        description:
          "Fixes the Get In Touch dialog overlay by making the dialog position fixed so the modal displays correctly.",
        contributors: [{ username: "mridxl" }],
      },
      {
        category: "Enhancement",
        prNumber: 515,
        title: "Add Reusable Dashboard Card Wrapper",
        description:
          "Introduces a reusable CardWrapper component and shared styling to standardize dashboard card layouts across multiple sections.",
        contributors: [{ username: "tanwarAalok" }],
      },
      {
        category: "Other",
        prNumber: 518,
        title: "Add Hero And Footer Tests",
        description:
          "Adds Vitest and React Testing Library coverage for HeroSection and Footer rendering, interactions, links, and modal behavior.",
        contributors: [{ username: "shafat730" }],
      },
      {
        category: "Other",
        prNumber: 546,
        title: "Add Authentication Component Tests",
        description:
          "Adds Vitest and React Testing Library tests for Auth, Signin, and Signup rendering, modal interactions, validation, and submission behavior.",
        contributors: [{ username: "iamalhera" }],
      },
      {
        category: "Enhancement",
        prNumber: 611,
        title: "Smooth Authentication Form Toggle",
        description:
          "Improves the Sign In and Sign Up switch with a smoother fade transition and updates tests for the delayed toggle behavior.",
        contributors: [{ username: "Drshnnn" }],
      },
      {
        category: "Security",
        prNumber: 597,
        title: "Add API Rate Limiting",
        description:
          "Adds request-rate limiting for public API routes, with stricter controls for logo endpoints to reduce abuse and excessive traffic.",
        contributors: [{ username: "farhan294sha" }],
      },
      {
        category: "Bug Fix",
        prNumber: 613,
        title: "Fix Admin Catalog UI Consistency",
        description:
          "Aligns the admin Catalog and CatalogItem UI styling and adds coverage for search, pagination, image actions, and modal behavior.",
        contributors: [{ username: "GautamRaj-1200" }],
      },
      {
        category: "Feature",
        prNumber: 612,
        title: "Add Analytics Cards To Admin",
        description:
          "Adds responsive analytics cards to the admin dashboard, integrates them into the page, and covers the feature with automated tests.",
        contributors: [{ username: "theboyofdream" }],
      },
      {
        category: "Other",
        prNumber: 619,
        title: "Add Logo API Endpoint Tests",
        description:
          "Adds API tests for logo retrieval and upload, covering successful responses, missing users, upload failures, and server errors.",
        contributors: [{ username: "strawHat121" }],
      },
      {
        category: "Other",
        prNumber: 622,
        title: "Add Role And Logo Tests",
        description:
          "Adds endpoint tests for updating user roles and logos, including validation, error cases, and successful updates.",
        contributors: [{ username: "anshika282" }],
      },
      {
        category: "Enhancement",
        prNumber: 638,
        title: "Upgrade React Router Dependency",
        description:
          "Updates the UI package from React Router 7.1.1 to 7.5.2 to incorporate upstream patches and improvements.",
        contributors: [{ username: "dependabot[bot]" }],
      },
      {
        category: "Feature",
        prNumber: 658,
        title: "Add 404 Not Found Page",
        description:
          "Adds a dedicated 404 page for unmatched routes and a catch-all router entry with a link back to Home.",
        contributors: [{ username: "Idontnol" }],
      },
      {
        category: "Feature",
        prNumber: 664,
        title: "Integrate User Info Update API",
        description:
          "Connects the User Info Save action to the backend update API, adding request handling, loading state, and related tests.",
        contributors: [{ username: "Allan2000-Git" }],
      },
      {
        category: "Feature",
        prNumber: 642,
        title: "Add Forgot Password Flow",
        description:
          "Adds Forgot Password mode to the Sign In form with email validation, a password-reset API request, and a return-to-sign-in action.",
        contributors: [{ username: "keshrinandan99" }],
      },
      {
        category: "Security",
        prNumber: 673,
        title: "Remove Hardcoded Test Passwords",
        description:
          "Replaces hard-coded passwords across the test suite with cryptographically generated values using a shared password utility.",
        contributors: [{ username: "SushankSinha" }],
      },
      {
        category: "Bug Fix",
        prNumber: 676,
        title: "Fix Contact Form Textarea Overflow",
        description:
          "Constrains the Contact Us message field so it cannot grow beyond the viewport during vertical resizing across screen sizes.",
        contributors: [{ username: "RajeshPhayde" }],
      },
      {
        category: "Bug Fix",
        prNumber: 678,
        title: "Preserve Signup Data On Errors",
        description:
          "Prevents the signup form from resetting when the API request fails, preserving the user’s entered values for correction or retry.",
        contributors: [{ username: "ShlokMane" }],
      },
      {
        category: "Bug Fix",
        prNumber: 688,
        title: "Fix Footer Branding And Toast Tests",
        description:
          "Restores visible footer branding and fixes the Toast test infinite loop by improving timer handling and cleanup.",
        contributors: [{ username: "printgourav" }],
      },
      {
        category: "Enhancement",
        prNumber: 690,
        title: "Highlight Active Navigation Page",
        description:
          "Adds active-state styling to desktop and mobile navigation so the current route or page section is clearly highlighted.",
        contributors: [{ username: "Ravisukhwal76" }],
      },
      {
        category: "Enhancement",
        prNumber: 667,
        title: "Improve API Key Management Modals",
        description:
          "Adds a modal to display newly generated API keys and a confirmation modal before users delete existing keys.",
        contributors: [{ username: "Aniketvish0" }],
      },
      {
        category: "Other",
        prNumber: 782,
        title: "Document Authentication And User API Flows",
        description:
          "Adds Mermaid flow diagrams to the API documentation, covering authentication and user-management endpoint flows.",
        contributors: [{ username: "biplab-sutradhar" }],
      },
      {
        category: "Other",
        prNumber: 781,
        title: "Add Logo Controller Unit Tests",
        description:
          "Adds unit tests for the logo retrieval and search controllers, covering validation, authorization, limits, success, and error cases.",
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
        title: "Standardize Dashboard Date Formatting",
        description:
          "Fixes inconsistent date formatting between the admin and operator dashboards by introducing and reusing a common date formatting helper.",
        contributors: [{ username: "Sumitgitup" }],
      },
      {
        category: "Feature",
        prNumber: 878,
        title: "Add User Data Download",
        description:
          "Adds a user data export feature that collects profile, generation history, usage statistics, and API key information and downloads it as a JSON file.",
        contributors: [{ username: "Sumitgitup" }],
      },
      {
        category: "Feature",
        prNumber: 879,
        title: "Add Dashboard And Sign-Out Dropdown",
        description:
          "Adds a profile dropdown that combines Dashboard and Sign Out actions for authenticated users, with equivalent options in the mobile navigation menu.",
        contributors: [{ username: "abhishek-2k23" }, { username: "nazibul7" }],
      },
      {
        category: "Bug Fix",
        prNumber: 884,
        title: "Invalidate CloudFront Cache On Image Update",
        description:
          "Automatically invalidates the CloudFront cache after an existing logo is updated, ensuring the latest image is served and adding the required AWS permissions.",
        contributors: [{ username: "MukeshAbhi" }],
      },
      {
        category: "Feature",
        prNumber: 851,
        title: "Enable Direct S3 Image Uploads",
        description:
          "Introduces presigned S3 URL uploads so admins and operators can upload images directly to S3 without routing files through the backend, reducing server bandwidth usage. Also refactors upload handling, metadata persistence, and S3 configuration.",
        contributors: [
          { username: "printgourav" },
          { username: "YashDevani-source" },
        ],
      },
      {
        category: "Feature",
        prNumber: 876,
        title: "Add Resend Verification Email Backend",
        description:
          "Adds backend support for resending email verification messages with token refresh and a limit of three resend requests per day, integrated into sign-in and email verification flows.",
        contributors: [{ username: "MukeshAbhi" }],
      },
      {
        category: "Feature",
        prNumber: 877,
        title: "Add Resend Verification Email UI",
        description:
          "Integrates the resend verification flow into the frontend sign-in and verification screens with toast notifications, error handling, and updated request handling.",
        contributors: [{ username: "MukeshAbhi" }],
      },
      {
        category: "Feature",
        prNumber: 859,
        title: "Show Image Count In Admin Analytics",
        description:
          "Adds the total number of logos stored in the system to the admin analytics dashboard using a new image count service and repository method.",
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
        prNumber: 896,
        title: "API Usage Graph",
        description:
          "Added a dashboard graph showing API request usage over weekly and monthly periods, along with a refresh action.",
        contributors: [
          { username: "L-Tarun-Aditya" },
          { username: "sachinkmrsin" },
          { username: "YashDevani-source" },
        ],
      },
      {
        category: "Security",
        prNumber: 893,
        title: "Automatic API Key Expiration",
        description:
          "Added API key expiration with configurable validity for new keys and one-year validity handling for existing keys, including expiry enforcement.",
        contributors: [
          { username: "biplab-sutradhar" },
          { username: "printgourav" },
        ],
      },
      {
        category: "Feature",
        prNumber: 897,
        title: "Automatic Catalog Creation",
        description:
          "Added automatic catalog creation with web-search support, allowing missing logos to be fetched online and incorporated into the catalog.",
        contributors: [
          { username: "BansalAbhinav" },
          { username: "Saurabhupadhyay8170" },
        ],
      },
      {
        category: "Feature",
        prNumber: 891,
        title: "Release Page",
        description:
          "Introduced a dedicated release page with version timelines, release information, contributors, and structured release notes.",
        contributors: [{ username: "abhishek-2k23" }],
      },
      {
        category: "Enhancement",
        prNumber: 876,
        title: "Resend Verification Email",
        description:
          "Added backend support for resending verification emails, including token refresh, rate limiting, and integration with signin and verification flows.",
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
        prNumber: 947,
        title: "Migrate Authentication To Secure Sessions",
        description:
          "Authentication was migrated from JWT-based authentication to server-managed sessions, including session creation, validation, and invalidation.",
        contributors: [
          { username: "Mantu01" },
          { username: "Smayur0" },
          { username: "printgourav" },
        ],
      },
      {
        category: "Enhancement",
        prNumber: 934,
        title: "Dynamic Light And Dark Themes",
        description:
          "Added a dark-mode theme system with a toggle and theme context, allowing users to switch between light and dark experiences.",
        contributors: [{ username: "sachinkmrsin" }],
      },
      {
        category: "Enhancement",
        prNumber: 948,
        title: "Notifications For API Expiry And Usage Limits",
        description:
          "Added toast notifications for API usage thresholds, warning users as they approach and reach their usage limits.",
        contributors: [
          { username: "YashDevani-source" },
          { username: "L-Tarun-Aditya" },
        ],
      },
      {
        category: "Feature",
        prNumber: 935,
        title: "Custom Logo Creation",
        description:
          "Added a Fabric.js-based Create Logo editor with text, shapes, colors, image upload, layer controls, and export support.",
        contributors: [
          { username: "biplab-sutradhar" },
          { username: "mridul-giri" },
        ],
      },
      {
        category: "Security",
        prNumber: 946,
        title: "API Key Masking",
        description:
          "Removed the API key from the client-side user context so it could no longer be exposed through frontend state or console inspection.",
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
        prNumber: 965,
        title: "Revamp User Dashboard Design",
        description:
          "Completely redesigned the USER dashboard with updated layouts, headers, settings cards, charts, and responsive UI to match the new design.",
        contributors: [{ username: "AryaDharkar" }],
      },
      {
        category: "Enhancement",
        prNumber: 1000,
        title: "Enhance Admin Dashboard UI",
        description:
          "Updated the admin dashboard UI with the new design system, including refreshed analytics, catalog layouts, and image previews.",
        contributors: [{ username: "L-Tarun-Aditya" }],
      },
      {
        category: "Security",
        prNumber: 1010,
        title: "Add 2FA Section To User Settings",
        description:
          "Added Two-Factor Authentication controls to the user settings, allowing users to enable and disable 2FA.",
        contributors: [{ username: "L-Tarun-Aditya" }],
      },
      {
        category: "Security",
        prNumber: 1010,
        title: "Implement Dedicated MFA Settings Page",
        description:
          "Introduced a dedicated Settings page for account management and moved user-related controls out of the main dashboard.",
        contributors: [{ username: "L-Tarun-Aditya" }],
      },
      {
        category: "Security",
        prNumber: 954,
        title: "Multi-Factor Authentication",
        description:
          "Implemented TOTP-based multi-factor authentication with setup, verification, enable/disable flows, and login enforcement.",
        contributors: [{ username: "MukeshAbhi" }],
      },
      {
        category: "Security",
        prNumber: 977,
        title: "Prevent Password Reuse During Reset",
        description:
          "Prevented users from setting their new password to the same value as the existing password during password reset and password update.",
        contributors: [{ username: "rishang14" }],
      },
      {
        category: "Feature",
        prNumber: 979,
        title: "Fix CreateLogo Page And Authentication",
        description:
          "Fixed CreateLogo editing and upload issues and made the CreateLogo page publicly accessible while preserving the intended post-login redirect.",
        contributors: [{ username: "AryaDharkar" }],
      },
      {
        category: "Security",
        prNumber: 1016,
        title: "Implement User Session Management",
        description:
          "Added per-device session management with active-session viewing, session revocation, sign-out-other-devices, and supporting authentication changes.",
        contributors: [
          { username: "kadamsahil2511" },
          { username: "DeepAkdotcom" },
        ],
      },
      {
        category: "Other",
        prNumber: 992,
        title: "Enforce Branch And PR Naming Conventions",
        description:
          "Added Husky and GitHub Actions checks to enforce standardized branch names and pull request titles.",
        contributors: [{ username: "Smayur0" }],
      },
      {
        category: "Enhancement",
        prNumber: 1020,
        title: "Redesign Documentation Page",
        description:
          "Redesigned the documentation experience with improved endpoint presentation, quickstart sections, layout, and responsive styling.",
        contributors: [{ username: "Dhirenderchoudhary" }],
      },
      {
        category: "Enhancement",
        prNumber: 974,
        title: "Revamp Sign-In And Sign-Up Forms",
        description:
          "Revamped the sign-in and sign-up UI, including improved layouts and real-time password-strength feedback for registration.",
        contributors: [{ username: "0-mstrmind" }, { username: "kunjesh360" }],
      },
    ],
  },
];

module.exports = historicalReleases;

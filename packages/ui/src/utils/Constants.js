import searchIcon from "../assets/searchIcon.svg";
import curvedArrow from "../assets/curvedArrow.svg";
import rapidLogo from "../assets/rapid.svg";
import searchLogo from "../assets/search.svg";
import databaseLogo from "../assets/database.svg";
import dragAndDropBg from "../assets/DragAndDropBg.svg";
import notion from "../assets/notion.png";
import slack from "../assets/slack.png";
import google_drive from "../assets/google_drive.png";
import whatsapp from "../assets/whatsapp.png";
import g_calendar from "../assets/g_calendar.png";
import mailchimp from "../assets/mailchimp.png";
import zapier from "../assets/zapier.png";
import zendesk from "../assets/zendesk.png";
import stripe from "../assets/stripe.png";
import jira from "../assets/jira.png";
import intercom from "../assets/intercom.png";
import figma from "../assets/figma.png";
import discord from "../assets/discord.png";
import bitbucket from "../assets/bitbucket.png";
import confluence from "../assets/confluence.png";
import dropbox from "../assets/dropbox.png";
import jsLogo from "../assets/js.png";
import pythonLogo from "../assets/python.png";
import javaLogo from "../assets/java.png";
import tick from "../assets/tick.png";
import copycodeicon from "../assets/copy-code-icon.png";

export const SVGS = {
  searchIcon,
  curvedArrow,
  amazon: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg",
  apple:
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  adobe:
    "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
  google:
    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  microsoft:
    "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  dragAndDropBg,
};

export const COMPANIES = [
  {
    id: 1,
    name: "Amazon",
    logo: SVGS.amazon,
  },
  {
    id: 2,
    name: "Apple",
    logo: SVGS.apple,
  },
  {
    id: 3,
    name: "Adobe",
    logo: SVGS.adobe,
  },
  {
    id: 4,
    name: "Google",
    logo: SVGS.google,
  },
  {
    id: 5,
    name: "Microsoft",
    logo: SVGS.microsoft,
  },
];

export const FEATURES = {
  heading: "Features",
  summary:
    "With Openlogo, integrate fresh, up-to-date company logos effortlessly and leverage smart search insights for professional branding.",
  items: [
    {
      icon: databaseLogo,
      title: "Comprehensive Database",
      content:
        "Tap into a vast logo library with thousands of brands, continuously refreshed and expanding.",
    },
    {
      icon: searchLogo,
      title: "Customizable Search Insights",
      content:
        "Gain insights on search patterns to spot missing logos and keep collections comprehensive.",
    },
    {
      icon: rapidLogo,
      title: "Fast & Reliable API Access",
      content:
        "Access logos instantly with fast, dependable APIs built to minimize downtime and maximize efficiency.",
    },
  ],
};

export const HEADER_ITEMS = [
  {
    name: "home",
    title: "Home",
    url: "/",
  },
  {
    name: "docs",
    title: "Docs",
    url: "/docs",
  },
  {
    name: "features",
    title: "Features",
    url: "/#features",
  },
  {
    name: "pricing",
    title: "Pricing",
    url: "/#pricing",
  },
  {
    name: "about",
    title: "About",
    url: "/#about",
  },
];

export const LOGGEDIN_ITEMS = [
  {
    name: "home",
    title: "Home",
    url: "/",
  },
  {
    name: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    name: "docs",
    title: "Docs",
    url: "/docs",
  },
  {
    name: "features",
    title: "Features",
    url: "/#features",
  },
  {
    name: "pricing",
    title: "Pricing",
    url: "/#pricing",
  },
  {
    name: "about",
    title: "About",
    url: "/#about",
  },
];

export const FOOTER_ITEMS = [
  {
    name: "about",
    title: "About",
    url: "/#about",
  },
  {
    name: "privacy",
    title: "Privacy",
    url: "/privacy#privacy",
  },
  {
    name: "terms&conditions",
    title: "Terms",
    url: "/privacy#terms",
  },
];
export const companies = [
  {
    id: "A1B2C3D4E5",
    companyImage: "Amazon.png",
    createdAt: "15 Sep 2023",
    updatedAt: "17 Sep 2023",
  },
  {
    id: "F6G7H8I9J0",
    companyImage: "Apple.png",
    createdAt: "01 Oct 2024",
    updatedAt: "12 Oct 2024",
  },
  {
    id: "K1L2M3N4O5",
    companyImage: "Google.png",
    createdAt: "11 Aug 2024",
    updatedAt: "12 Aug 2024",
  },
  {
    id: "P6Q7R8S9T0",
    companyImage: "Microsoft.png",
    createdAt: "22 Jul 2023",
    updatedAt: "23 Jul 2023",
  },
  {
    id: "U1V2W3X4Y5",
    companyImage: "Tesla.png",
    createdAt: "09 Feb 2024",
    updatedAt: "18 Feb 2024",
  },
  {
    id: "Z6A7B8C9D0",
    companyImage: "Meta.png",
    createdAt: "13 Dec 2023",
    updatedAt: "15 Dec 2023",
  },
  {
    id: "E1F2G3H4I5",
    companyImage: "JohnsonAndJohnson.png",
    createdAt: "27 Nov 2024",
    updatedAt: "30 Nov 2024",
  },
  {
    id: "J6K7L8M9N0",
    companyImage: "JPMorganChase.png",
    createdAt: "04 Apr 2024",
    updatedAt: "08 Apr 2024",
  },
  {
    id: "O1P2Q3R4S5",
    companyImage: "Walmart.png",
    createdAt: "19 Jun 2024",
    updatedAt: "23 Jun 2024",
  },
  {
    id: "T6U7V8W9X0",
    companyImage: "BerkshireHathaway.png",
    createdAt: "01 Mar 2024",
    updatedAt: "10 Mar 2024",
  },
];

export const ANALYTIC_CARDS = [
  { title: "Users", api: 5.2 },
  { title: "Keys", api: -6.8 },
  { title: "Hits", api: 9.2 },
  { title: "Requests", api: -5.3 },
];

export const PASSWORD_VALIDATION_MESSAGES = {
  required: "Password is required",
  minLength: (minLength) => `Password must be at least ${minLength} characters`,
  maxLength: (maxLength) => `Password cannot exceed ${maxLength} characters`,
  uppercase: "Password must have an uppercase letter",
  lowercase: "Password must have a lowercase letter",
  digit: "Password must have a digit.",
  specialChar: "Password must have a special character",
  generalError: "Password is not secure",
};

export const ABOUT = {
  TITLE: "What is Openlogo",
  DESCRIPTION:
    "From startups to enterprises, our platform offers an extensive collection of company logos, enabling smooth integration and consistent branding. Our APIs are designed to make logo retrieval effortless, providing scalable solutions that adapt to your business's evolving branding requirements.",
  INTEGRATIONS: [
    { id: 1, src: notion, alt: "Notion" },
    { id: 2, src: slack, alt: "Slack" },
    { id: 3, src: google_drive, alt: "Google Drive" },
    { id: 4, src: intercom, alt: "Intercom" },
    { id: 5, src: stripe, alt: "Stripe" },
    { id: 6, src: dropbox, alt: "Dropbox" },
    { id: 7, src: jira, alt: "Jira" },
    { id: 8, src: zapier, alt: "Zapier" },
    { id: 9, src: figma, alt: "Figma" },
    { id: 10, src: confluence, alt: "Confluence" },
    { id: 11, src: mailchimp, alt: "Mailchimp" },
    { id: 12, src: zendesk, alt: "Zendesk" },
    { id: 13, src: g_calendar, alt: "Google Calendar" },
    { id: 14, src: whatsapp, alt: "WhatsApp" },
    { id: 15, src: discord, alt: "Discord" },
    { id: 16, src: bitbucket, alt: "Bitbucket" },
  ],
};

export const FAQ = {
  TITLE: "Frequently asked questions",
  QAS: [
    {
      question: "Why should I use Openlogo?",
      answer:
        "Openlogo makes it easy to retrieve logos quickly and reliably with seamless API integration, flexible pricing, and scalable access to a growing logo library. Logo not found, no worries raise a request to add your logo.",
    },
    {
      question: "How do I get started with Openlogo?",
      answer:
        "Getting started is easy! Sign up to create your account and generate a unique API key. With your key, explore our API features to retrieve logos or search logos using prefixs, all the provided images will be in PNG. Use our comprehensive documentation to guide your integration and testing process.",
    },
    {
      question: "What payment methods do you support?",
      answer:
        "Currently, our plans are in a free trial period, and you can use the API at no cost. We're continuously expanding our library by adding new logos every day. In the future, we plan to introduce a variety of payment methods to suit your convenience.",
    },
  ],
};

export const PRICING = {
  heading: "Compare our plans and find yours",
  summary:
    "Simple, transparent pricing that grows with you. Try any plan free for 30 days.",
  plans: [
    {
      index: 0,
      name: "HOBBY",
      pricing: 0,
      tagline: "Try for free for individuals",
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
      tagline: "Grow with pro plan.",
      keypoints: [
        "Hobby plan plus",
        "10000 API calls per month",
        "5 API keys",
        "Advance analytics",
        "12-36 hours of response time",
      ],
    },
  ],
};

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

export const USER_INFO_FIELDS = [
  { type: "text", name: "name", label: "Username" },
  { type: "email", name: "email", label: "Email" },
];

export const HAMBURGER = {
  src: "hamburger.svg",
  alt: "Hamburger Icon",
};

export const CROSS = {
  src: "close-icon.svg",
  alt: "Close Icon",
};

export const BUTTON_TEXT = {
  getStarted: "Get started",
  gotoDashboard: "Go to Dashboard",
  active: "Active",
  commingSoon: "Coming Soon",
  documentation: "Documentation",
  signUp: "Sign Up",
  signIn: "Sign In",
  forgotPassword: "Forgot Password ?",
  cross: `×`,
  sendMessage: "Send message",
  delete: "Delete",
};

export const BRANDING = {
  imageSrc: "openlogo.svg",
  brandName: "Openlogo",
  poweredByText: "Powered by TeamShiksha",
  poweredByLink: "https://team.shiksha",
};

export const CODEBLOCK = {
  jsLogo,
  pythonLogo,
  javaLogo,
  tick,
  copycodeicon,
};

export const TABLE_DATA = {
  headers: ["Parameter", "Type", "Description", "Required"],
  logoRows: [
    ["key", "string", "The domain name of the company.", "Yes"],
    ["API_KEY", "string", "Generated API Key from the dashboard.", "Yes"],
  ],
  searchRows: [
    ["key", "string", "Prefix of the domain name to filter logos.", "Yes"],
    ["API_KEY", "string", "Generated API Key from the dashboard.", "Yes"],
  ],
};

export const HERO_SECTION = {
  tagLine: "Access hundreds of logos with just one line of code",
  summary:
    "A collection of APIs designed to simplify the process of obtaining company logos. Generate API keys in seconds.",
  illustractionSrc: "logo-images.png",
  illustractionSrcAlt: "illustraction",
};

export const PRIVACY_AND_TERMS = [
  {
    HEADLINE: "Privacy and Terms",
    DATA_ID: "#",
    TEXTS: [
      "Thank you for choosing Openlogo! Before using our services, please review our Terms of Service carefully. This agreement is a crucial contract between us and our users. We've provided a concise summary followed by the complete legal terms.",
    ],
  },
  {
    HEADLINE: "Privacy Policy",
    DATA_ID: "privacy",
    TEXTS: [
      "This Privacy Policy explains how Openlogo collects, uses, and protects your personal information when you use our website and services. By using Openlogo's services, you agree to the terms of this Privacy Policy. Your privacy is important to us, and we are committed to safeguarding your personal information.",
      "Openlogo collects personal information such as your name, email address, and other details when you register for an account or use specific features on our platform. We also gather usage data about how you interact with our website and services, including pages viewed, features used, and your activity within our platform. If you contact us for support or inquiries, we may collect and store those communications.",
      "The information collected is used to provide and enhance our services, manage your account, communicate with you about updates, offers, and newsletters, and perform business analysis to optimize site performance and security. We may also use your information to personalize your experience on Openlogo and improve our services based on your preferences.",
      "Openlogo uses cookies and similar tracking technologies to enhance your browsing experience, improve website functionality, and analyze site traffic. These technologies help us understand how users interact with our platform, allowing us to optimize performance, provide seamless navigation, and offer a more personalized experience tailored to your preferences.",
      "We utilize different types of cookies, including essential cookies that enable core website functions such as authentication and security, as well as performance and analytics cookies that help us measure traffic and analyze usage trends. Functional cookies store your preferences, such as language settings, to make your interactions with our platform smoother. Additionally, marketing and advertising cookies assist in delivering relevant promotions and personalized content based on your interests.",
      "You can manage your cookie preferences through your browser settings. However, please note that disabling certain cookies may affect website functionality and limit access to some features.",
      "We take reasonable precautions to protect your personal data from unauthorized access, disclosure, alteration, and destruction. However, no method of data transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. We retain your personal data only as long as necessary to fulfill its purpose or as required by law.",
      "Openlogo's services are not intended for children under 13. We do not knowingly collect personal information from anyone under this age. If you believe that we have inadvertently collected personal information from a child under 13, please contact us immediately, and we will take steps to delete such data.",
      "We may update this Privacy Policy periodically to reflect changes in our practices, services, or legal requirements. When updates are made, they will be posted on the website, and the effective date will be updated accordingly. We encourage you to review this policy regularly to stay informed about how we are protecting your personal information.",
    ],
  },
  {
    HEADLINE: "Terms of Services",
    DATA_ID: "terms",
    TEXTS: [
      "By using Openlogo's website and services, you agree to comply with the following terms and conditions. You must abide by all applicable laws and regulations while using our services. You are responsible for maintaining the confidentiality of your account credentials, including your password, and for all activities that occur under your account.",
      "Openlogo reserves the right to modify or discontinue services, in whole or in part, at any time without prior notice. We are not liable for any direct or indirect damages resulting from the use of our services, including but not limited to loss of data, loss of revenue, or business interruption.",
      "Openlogo may, from time to time, offer promotional codes, discounts, or special offers that are subject to additional terms and conditions. We reserve the right to cancel or modify any offers at our discretion. These offers may be available for limited periods and are subject to availability.",
      "You agree not to misuse Openlogo's services, including but not limited to engaging in illegal activities, spamming, or violating the intellectual property rights of others. Failure to comply with these terms may result in the suspension or termination of your account.",
      "Openlogo is not responsible for any third-party services or websites linked to our platform. Please read their respective privacy policies and terms before engaging with them.",
      "If you have any questions about this Privacy Policy or our Terms and Conditions, please contact us through our contact page. We are here to help you understand and navigate our policies.",
    ],
  },
];

export const SIGNUP = {
  title: "Sign up for free",
  fields: [
    { type: "text", name: "name", label: "Name" },
    { type: "email", name: "email", label: "Email" },
    { type: "password", name: "password", label: "Password" },
    { type: "password", name: "confirmPassword", label: "Confirm Password" },
  ],
  footerText: "Already have an account ?",
  initialValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};

export const SIGNIN = {
  title: "Go to dashboard",
  fields: [
    { type: "email", name: "email", label: "Email" },
    { type: "password", name: "password", label: "Password" },
  ],
  footerText: "Don't have an account ?",
  initialValues: { email: "", password: "" },
};

export const CONTACT = {
  title: "Contact Us",
  fields: [
    { type: "text", name: "name", label: "Name" },
    { type: "email", name: "email", label: "Email" },
  ],
  intialValues: {
    name: "",
    email: "",
    message: "",
  },
};

const CODE_EXAMPLE_SEARCH = {
  javascript: `// use fetch to send GET request
fetch("/api/logo/search?key={prefix}&API_KEY={YOUR_API_KEY}", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})`,

  python: `# import package
import requests
# send GET request
response = requests.get("api/logo/search",
  params={
    "key": "{prefix}",
    "API_KEY": '{YOUR_API_KEY}'
  },
  headers={
    "Content-Type": "application/json"
  }
)`,

  java: `// create http client instance
HttpClient client = HttpClient.newHttpClient();
// build http request
HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("/api/logo/search?key={prefix}&API_KEY={YOUR_API_KEY}"))
  .header("Content-Type", "application/json")
  .GET()
  .build();  
// send GET request
HttpResponse<String> response = client.send(request, 
  HttpResponse.BodyHandlers.ofString());`,
};

const CODE_EXAMPLE = {
  javascript: `// use fetch to send GET request
fetch("/api/logo?key={domain}&API_KEY={YOUR_API_KEY}", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})`,

  python: `# import package
import requests
# send GET request
response = requests.get("api/logo",
  params={
    "domain": "{domain}",
    "API_KEY": "{YOUR_API_KEY}"
  },
  headers={
    "Content-Type": "application/json"
  }
)`,

  java: `// create http client instance
HttpClient client = HttpClient.newHttpClient();
// build http request
HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("/api/logo?key={domain}&API_KEY={YOUR_API_KEY}"))
  .header("Content-Type", "application/json")
  .GET()
  .build();  
// send GET request
HttpResponse<String> response = client.send(request, 
  HttpResponse.BodyHandlers.ofString());`,
};

export const DOCUMENTATION = {
  introduction: {
    heading: "Introduction",
    text: "The documentation provides a comprehensive guide to our logo retrieval API, detailing endpoints for fetching company logos by domain name and searching logos by domain prefixes. We offer features like exact search, bulk logo retrieval, high-resolution logos, request logo with easy integration. Whether you need a logo for branding or marketing, we’re here to help. Contact us anytime!",
  },
  tableDataHeaders: ["Parameter", "Type", "Description", "Required"],
  apiDocs: [
    {
      heading: "Logo Retrieval",
      text: "Integrate this API for precise logo searches using a company's domain name. This free API allows up to 500 calls per month and returns logos in PNG format. Support for additional formats will be available in the future.",
      endPoint: "Endpoint: /logo?key=google&API_KEY=YOUR_API_KEY",
      tableDataContent: [
        ["key", "string", "The domain name of the company.", "Yes"],
        ["API_KEY", "string", "Generated API Key from the dashboard.", "Yes"],
      ],
      codeExample: CODE_EXAMPLE,
    },
    {
      heading: "Search (Now Available)",
      text: "The Logo Search API allows users to retrieve a list of logo URLs that begin with specified characters, making it useful for identifying logos based on a domain name's prefix. This service is currently free but will be subject to charges in the future. The API has a monthly usage limit of 5000 requests.",
      endPoint: "Endpoint: /logo/search?key=go&API_KEY=YOUR_API_KEY",
      tableDataContent: [
        ["key", "string", "Prefix of the domain name to filter logos.", "Yes"],
        ["API_KEY", "string", "Generated API Key from the dashboard.", "Yes"],
      ],
      codeExample: CODE_EXAMPLE_SEARCH,
    },
  ],
  customerSupportText: [
    "If you're unable to find the logo you need, please don't hesitate to ",
    ". Our team will be happy to assist you in locating the appropriate logo. Additionally, you can refer to the provided examples for guidance. If you still require further support, our dedicated support team is available to help with any additional questions or concerns.",
  ],
  localUrl: "Base URL: http://localhost:5000/api",
  baseStageUrl: "Base URL: https://api-stage-openlogo.fyi/api",
  baseProdUrl: "Base URL: https://api-openlogo.fyi/api",
};

export const API_KEY_TABLE = {
  headers: ["Description", "Created", "Action"],
  emptyMessage:
    "Your api keys will be visible here, click on generate key to add new api key",
};

export const DASHBOARD_CARDS_TITLE = [
  "Usage",
  "Generate New API Key",
  "Plan",
  "User Info",
  "Change Password",
  "Setting",
];
export const MOCK_USER_DATA = {
  name: "John Doe",
  email: "john@example.com",
  subscription: {
    usage_count: 42,
    usage_limit: 100,
    type: "HOBBY",
  },
  keys: [
    {
      key_description: "Testing Environment Key",
      updated_at: "2023-10-30T11:20:00.000Z",
    },
    {
      key_description: "Analytics Service Key",
      updated_at: "2023-11-10T13:10:00.000Z",
    },
  ],
};

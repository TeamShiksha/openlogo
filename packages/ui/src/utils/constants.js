import searchIcon from '../assets/searchIcon.svg'
import curvedArrow from '../assets/curvedArrow.svg'
import rapidLogo from "../assets/rapid.svg";
import searchLogo from "../assets/search.svg";
import databaseLogo from "../assets/database.svg";

export const SVGS = {
  searchIcon,
  curvedArrow,
  amazon: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
  apple: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  adobe: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png',
  google: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  microsoft: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
}

export const COMPANIES = [
  {
    id: 1,
    name: 'Amazon',
    logo: SVGS.amazon
  },
  {
    id: 2,
    name: 'Apple',
    logo: SVGS.apple
  },
  {
    id: 3,
    name: 'Adobe',
    logo: SVGS.adobe
  },
  {
    id: 4,
    name: 'Google',
    logo: SVGS.google
  },
  {
    id: 5,
    name: 'Microsoft',
    logo: SVGS.microsoft
  }
];

export const featureItems = [
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
];

export const headerItems = [
  {
    name: "demo",
    title: "Demo",
    url: "/demo",
  },
  {
    name: "docs",
    title: "Docs",
    url: "/docs",
  },
  {
    name: "features",
    title: "Features",
    url: "/features",
  },
  {
    name: "pricing",
    title: "Pricing",
    url: "/pricing",
  },
  {
    name: "about",
    title: "About Us",
    url: "/about",
  },
]

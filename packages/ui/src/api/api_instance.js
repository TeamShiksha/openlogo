import axios from "axios";

const VITE_BASE_URL = "https://api.openlogo.fyi";

export const instance = axios.create({
  baseURL: `${VITE_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

import axios from "axios";

const VITE_BASE_URL = process.env.VITE_BASE_URL;

export const instance = axios.create({
  baseURL: `${process.env.VITE_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

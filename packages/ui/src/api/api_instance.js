import axios from "axios";

export const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

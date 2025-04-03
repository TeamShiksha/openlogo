import axios from "axios";

export const instance = axios.create({
  // baseURL: import.meta.env.BASE_URL,
  baseURL:"http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

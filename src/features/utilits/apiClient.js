import axios from "axios";
import { getRawToken } from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://nexacircuit-hrms.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getRawToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


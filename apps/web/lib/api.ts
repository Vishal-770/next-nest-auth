import axios from "axios";
import { config } from "./config";

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: config.api.url,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: config.api.timeout,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here later
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "An error occurred";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response
      return Promise.reject(
        new Error(
          `Cannot connect to server. Please ensure the backend is running on ${config.api.url}`
        )
      );
    } else {
      // Something else happened
      return Promise.reject(
        new Error(error.message || "An unexpected error occurred")
      );
    }
  }
);

import axios from "axios";
import {
  AppError,
  ErrorCode,
  HttpStatusCode,
  AuthenticationError,
} from "../types/error";

// Create axios instance with optimized settings
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor with optimized token handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) =>
    Promise.reject(
      new AppError(
        ErrorCode.NETWORK_ERROR,
        "Failed to make request",
        HttpStatusCode.SERVICE_UNAVAILABLE
      )
    )
);

// Response interceptor with optimized refresh flow
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === HttpStatusCode.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new AuthenticationError(
            ErrorCode.TOKEN_EXPIRED,
            "No refresh token found"
          );
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { token: refreshToken },
          { timeout: 3000 }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
        throw new AuthenticationError(
          ErrorCode.TOKEN_EXPIRED,
          "Session expired. Please log in again."
        );
      }
    }

    // Optimized error handling
    if (axios.isAxiosError(error)) {
      const response = error.response?.data;
      throw new AppError(
        response?.error?.code || ErrorCode.INTERNAL_ERROR,
        response?.error?.message || "An unexpected error occurred",
        error.response?.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
        response?.error?.details
      );
    }

    throw error;
  }
);

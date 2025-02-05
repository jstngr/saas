import { useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiErrorResponse, ErrorCode, HttpStatusCode } from "../types/error";
import axios from "axios";

interface ErrorHandlerOptions {
  shouldRedirect?: boolean;
  shouldShowNotification?: boolean;
  retryCount?: number;
  fallbackPath?: string;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    shouldRedirect = true,
    shouldShowNotification = true,
    fallbackPath = "/",
  } = options;

  const handleError = useCallback(
    async (error: unknown) => {
      console.log("error in handleError", error);
      let errorResponse: ApiErrorResponse["error"];

      if (axios.isAxiosError(error)) {
        errorResponse = error.response?.data?.error || {
          code: ErrorCode.INTERNAL_ERROR,
          message: "An unexpected error occurred",
        };
      } else if (error instanceof Error) {
        errorResponse = {
          code: ErrorCode.INTERNAL_ERROR,
          message: error.message,
        };
      } else {
        errorResponse = {
          code: ErrorCode.INTERNAL_ERROR,
          message: "An unexpected error occurred",
        };
      }

      console.log("errorResponse 2", errorResponse);

      // Handle based on status code
      const status = axios.isAxiosError(error) ? error.response?.status : null;
      console.log("🚀 ~ status:", status);
      switch (status) {
        case HttpStatusCode.UNAUTHORIZED:
          if (shouldRedirect) {
            //await logout();
            // todo: do the logout.
            navigate("/auth/login");
          }
          break;

        case HttpStatusCode.FORBIDDEN:
          if (shouldRedirect) {
            navigate(fallbackPath);
          }
          break;

        case HttpStatusCode.NOT_FOUND:
          if (shouldRedirect) {
            navigate("/404");
          }
          break;

        case HttpStatusCode.TOO_MANY_REQUESTS:
          // Could implement retry logic here
          break;

        case HttpStatusCode.SERVICE_UNAVAILABLE:
          // Could implement offline detection here
          break;
      }

      console.log("errorResponse 3", errorResponse);
      // Show notification if enabled
      if (shouldShowNotification) {
        notifications.show({
          title: getErrorTitle(errorResponse.code),
          message: errorResponse.message,
          color: getErrorColor(status || HttpStatusCode.INTERNAL_SERVER_ERROR),
        });
      }
      console.log("errorResponse", errorResponse);
      return errorResponse;
    },
    [navigate, logout, shouldRedirect, shouldShowNotification, fallbackPath]
  );

  return { handleError };
};

// Helper functions
function getErrorTitle(code: string): string {
  switch (code) {
    case ErrorCode.INVALID_CREDENTIALS:
      return "Invalid Credentials";
    case ErrorCode.TOKEN_EXPIRED:
      return "Session Expired";
    case ErrorCode.ACCOUNT_LOCKED:
      return "Account Locked";
    case ErrorCode.RATE_LIMIT_EXCEEDED:
      return "Too Many Requests";
    case ErrorCode.NETWORK_ERROR:
      return "Connection Error";
    default:
      return "Error";
  }
}

function getErrorColor(status: HttpStatusCode): string {
  if (status === HttpStatusCode.TOO_MANY_REQUESTS) return "yellow";
  if (status >= 500) return "red";
  if (status >= 400) return "orange";
  return "red";
}

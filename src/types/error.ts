// Generic API Error Response
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  path: string;
}

// HTTP Error Codes
export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// Error Codes for specific error scenarios
export enum ErrorCode {
  // Authentication Errors
  INVALID_CREDENTIALS = "AUTH001",
  TOKEN_EXPIRED = "AUTH002",
  INVALID_TOKEN = "AUTH003",
  ACCOUNT_LOCKED = "AUTH004",

  // Validation Errors
  INVALID_INPUT = "VAL001",
  MISSING_REQUIRED_FIELD = "VAL002",
  INVALID_FORMAT = "VAL003",

  // Resource Errors
  RESOURCE_NOT_FOUND = "RES001",
  RESOURCE_ALREADY_EXISTS = "RES002",
  RESOURCE_CONFLICT = "RES003",

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = "RATE001",

  // Server Errors
  INTERNAL_ERROR = "SRV001",
  SERVICE_UNAVAILABLE = "SRV002",
  DATABASE_ERROR = "SRV003",

  // Network Errors
  NETWORK_ERROR = "NET001",
  TIMEOUT_ERROR = "NET002",
}

// Custom Error Classes
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status: HttpStatusCode,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthenticationError extends AppError {
  constructor(
    code: ErrorCode = ErrorCode.INVALID_CREDENTIALS,
    message: string = "Authentication failed",
    details?: Record<string, any>
  ) {
    super(code, message, HttpStatusCode.UNAUTHORIZED, details);
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends AppError {
  constructor(
    code: ErrorCode = ErrorCode.INVALID_INPUT,
    message: string = "Validation failed",
    details?: Record<string, any>
  ) {
    super(code, message, HttpStatusCode.BAD_REQUEST, details);
    this.name = "ValidationError";
  }
}

export class NetworkError extends AppError {
  constructor(
    code: ErrorCode = ErrorCode.NETWORK_ERROR,
    message: string = "Network error occurred",
    details?: Record<string, any>
  ) {
    super(code, message, HttpStatusCode.SERVICE_UNAVAILABLE, details);
    this.name = "NetworkError";
  }
}

// Error Handler Configuration Type
export interface ErrorHandlerConfig {
  shouldRedirect?: boolean;
  shouldShowNotification?: boolean;
  retryCount?: number;
  fallbackPath?: string;
}

// Error Context Type
export interface ErrorContextType {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  clearError: () => void;
}

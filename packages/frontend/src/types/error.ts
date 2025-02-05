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

// Base Error class
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Authentication specific error
export class AuthenticationError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, HttpStatusCode.UNAUTHORIZED);
    this.name = "AuthenticationError";
  }
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

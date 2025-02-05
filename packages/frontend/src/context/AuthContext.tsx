import { createContext, useContext, useState, useEffect } from "react";
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  sub: string;
  email: string;
}

// Create axios instance with default config
const api = axios.create();

// Add axios interceptors to handle auth headers and token refresh
api.interceptors.request.use(async (config) => {
  // Skip token check for auth endpoints
  if (
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register")
  ) {
    return config;
  }

  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      // Check if token is expired
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token is expired, try to refresh
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const response = await axios.post("/api/auth/refresh-token", {
              refreshToken,
            });
            const newAccessToken = response.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            config.headers.Authorization = `Bearer ${newAccessToken}`;
          } catch (error) {
            // Refresh failed, clear tokens and trigger logout
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.dispatchEvent(new Event("auth-logout"));
          }
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Invalid token format, clear it
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.dispatchEvent(new Event("auth-logout"));
    }
  }
  return config;
});

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  sendMagicLink: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerificationCode: (email: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();

    // Listen for logout events from other tabs
    const handleLogout = () => {
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    };

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && !e.newValue) {
        handleLogout();
      }
    };

    window.addEventListener("auth-logout", handleLogout);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("auth-logout", handleLogout);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return;
      }

      const { data: userData } = await api.get("/api/auth/user");
      setState({
        isAuthenticated: true,
        user: userData,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      // Use axios directly for login to bypass interceptor
      const { data: response } = await axios.post(
        "/api/auth/login",
        credentials
      );

      // Debug the response structure
      console.log("Login response:", response);

      // Access tokens from the nested data structure
      const accessToken = response.data?.access_token;
      const refreshToken = response.data?.refresh_token;

      if (!accessToken || !refreshToken) {
        console.error("Invalid token structure:", response);
        throw new Error("Invalid response from server: missing tokens");
      }

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Get user data using the api instance with the new token
      const { data: userData } = await api.get("/api/auth/user");

      setState({
        isAuthenticated: true,
        user: userData,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await axios.post("/api/auth/register", credentials);
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.get("/api/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Dispatch logout event for other tabs
      window.dispatchEvent(new Event("auth-logout"));
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  const sendMagicLink = async (email: string) => {
    await axios.post("/api/auth/magic-link", { email });
  };

  const forgotPassword = async (email: string) => {
    await axios.post("/api/auth/forgot-password", { email });
  };

  const resetPassword = async (token: string, password: string) => {
    await axios.post("/api/auth/reset-password", { token, password });
  };

  const verifyEmail = async (code: string) => {
    await axios.post("/api/auth/verify-email", { code });
  };

  const resendVerificationCode = async (email: string) => {
    await axios.post("/api/auth/resend-verification", { email });
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    await axios.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
  };

  const deleteAccount = async () => {
    await axios.delete("/api/auth/account");
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loginWithGoogle,
        sendMagicLink,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerificationCode,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

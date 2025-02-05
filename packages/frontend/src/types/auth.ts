export interface User {
  id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstname?: string;
  lastname?: string;
  confirmPassword: string;
}

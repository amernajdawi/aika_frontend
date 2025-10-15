export interface User {
  username: string;
  password: string;
  displayName: string;
}

export interface StoredUser {
  username: string;
  displayName: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: StoredUser | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: StoredUser;
}

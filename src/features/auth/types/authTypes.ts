// ─────────────────────────────────────────────
// Domain types
// ─────────────────────────────────────────────

export type Role = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export interface AdminProfile {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// ─────────────────────────────────────────────
// Reducer actions
// ─────────────────────────────────────────────

export type AuthAction =
  | { type: "AUTH_INIT" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "REFRESH_USER"; payload: User }
  | { type: "CLEAR_ERROR" };

// ─────────────────────────────────────────────
// Context value
// ─────────────────────────────────────────────

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}
// ─────────────────────────────────────────────
// Domain types
// ─────────────────────────────────────────────

export type Role = "admin" | "editor" | "viewer" | "unknown";
export type MfaStep = "enroll" | "verify" | null;

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
  mfaStep: MfaStep;
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
  | { type: "CLEAR_ERROR" }
  | { type: "MFA_REQUIRED"; payload: "enroll" | "verify" };

// ─────────────────────────────────────────────
// Context value
// ─────────────────────────────────────────────

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  verifyMfa: (code: string, factorId?: string) => Promise<void>;
}
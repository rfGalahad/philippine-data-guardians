import type { Session } from "@supabase/supabase-js";
import { AuthApiError } from "@supabase/supabase-js";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { useToast } from "@/components/Toast";

import {
  getSession,
  signInWithPassword, 
  signOut,
  getCurrentUser,
  onAuthStateChange,
  getAdminProfile
} from "@/lib/supabase/auth";

import { AuthContext } from "../context/AuthContext";
import { authReducer } from "../reducer/authReducer";
import { notifyPendingSignInSuccess, toAuthSuccessPayload } from "../utils/authHelpers";
import type { AuthContextValue, AuthState } from "../types/authTypes";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AuthProviderProps {
  children: React.ReactNode;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const PENDING_SIGNIN_KEY = "auth:pending_signin";

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true, 
  error: null,
};

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

export const AuthProvider = ({ children }: AuthProviderProps ) => {

  const toast = useToast();
  const [state, dispatch] = useReducer(authReducer, initialState);

  const applySession = useCallback(async (session: Session | null) => {
    if (!session) {
      dispatch({ type: "AUTH_LOGOUT" });
      return;
    }

    const adminProfile = await getAdminProfile(session.user.id);

    if (!adminProfile) {
      await signOut(); 
      dispatch({ type: "AUTH_LOGOUT" });
      sessionStorage.removeItem(PENDING_SIGNIN_KEY);
      toast.error("You do not have admin access.");
      return;
    }

    dispatch({ 
      type: "AUTH_SUCCESS", 
      payload: toAuthSuccessPayload(session, adminProfile) 
    });

    notifyPendingSignInSuccess(toast);
  }, [toast]);

  useEffect(() => {
    getSession().then(applySession).catch(() => dispatch({ type: "AUTH_LOGOUT" }));

    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => subscription.unsubscribe();
  }, [applySession]);


  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: "AUTH_INIT" });
    sessionStorage.setItem("auth:pending_signin", "1");
    try {
      await signInWithPassword(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      dispatch({ type: "AUTH_FAILURE", payload: message });
      if (err instanceof TypeError) {
        toast.error("Unable to connect. Please check your internet connection.");
      } else if (err instanceof AuthApiError && err.status === 400) {
        toast.error("Incorrect email or password.");
      } else {
        console.error(err);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }, [toast]);

  const logout = useCallback(async () => {
    await signOut();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      dispatch({ type: "REFRESH_USER", payload: user });
    } catch (err) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: err instanceof Error 
                  ? err.message 
                  : "Failed to refresh user",
      });
    }
  }, []);

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: !!state.user && !!state.token,
      login,
      logout,
      refreshUser,
      clearError,
    }),
    [state, login, logout, refreshUser, clearError]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
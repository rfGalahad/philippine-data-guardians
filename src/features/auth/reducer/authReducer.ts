import type { AuthAction, AuthState } from "../types/authTypes";

export const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
  mfaStep: null,
}; 

export const authReducer = (
  state: AuthState, 
  action: AuthAction
): AuthState => {
  
  switch (action.type) {
    case "AUTH_INIT":
      return { ...state, isLoading: true, error: null };

    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        mfaStep: null
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload,
        mfaStep: null
      };

    case "AUTH_LOGOUT":
      return { ...initialState, isLoading: false };

    case "REFRESH_USER":
      return { ...state, user: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "MFA_REQUIRED":
      return { 
        ...state, 
        user: null, 
        token: null, 
        isLoading: false, 
        error: null, 
        mfaStep: action.payload 
      };


    default:
      return state;
  }
}
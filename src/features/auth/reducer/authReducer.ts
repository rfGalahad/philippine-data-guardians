import type { AuthAction, AuthState } from "../types/authTypes";

export const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
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
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case "AUTH_LOGOUT":
      return { ...initialState, isLoading: false };

    case "REFRESH_USER":
      return { ...state, user: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
}
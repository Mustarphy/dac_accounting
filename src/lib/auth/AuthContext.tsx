"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { login as loginRequest, logout as logoutRequest, registerAccount, getCurrentUser } from "./api";
import { isApiConfigured, refreshAccessToken } from "@/lib/api/client";
import { setAccessToken } from "./token-store";
import { onSessionExpired } from "./session-events";
import type { AuthUser, LoginRequest, RegisterRequest } from "./types";

export type AuthStatus = "initializing" | "authenticated" | "unverified" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
};

type Action = { type: "SET_SESSION"; user: AuthUser } | { type: "CLEAR_SESSION" };

function statusForUser(user: AuthUser): AuthStatus {
  return user.emailVerifiedAt ? "authenticated" : "unverified";
}

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "SET_SESSION":
      return { status: statusForUser(action.user), user: action.user };
    case "CLEAR_SESSION":
      return { status: "unauthenticated", user: null };
    default:
      return state;
  }
}

type AuthContextValue = AuthState & {
  login: (payload: LoginRequest) => Promise<AuthUser>;
  signup: (payload: RegisterRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    status: "initializing",
    user: null,
  });

  // Rehydrate the session on load: the access token lives only in memory
  // and is gone after a refresh, so we attempt a silent refresh using the
  // HttpOnly cookie (if Laravel issued one) before deciding the user is
  // logged out.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!isApiConfigured()) {
        dispatch({ type: "CLEAR_SESSION" });
        return;
      }

      try {
        await refreshAccessToken();
        const { user } = await getCurrentUser();
        if (!cancelled) dispatch({ type: "SET_SESSION", user });
      } catch {
        if (!cancelled) dispatch({ type: "CLEAR_SESSION" });
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => onSessionExpired(() => dispatch({ type: "CLEAR_SESSION" })), []);

  const login = useCallback(async (payload: LoginRequest) => {
    const { user, accessToken } = await loginRequest(payload);
    setAccessToken(accessToken);
    dispatch({ type: "SET_SESSION", user });
    return user;
  }, []);

  const signup = useCallback(async (payload: RegisterRequest) => {
    const { user, accessToken } = await registerAccount(payload);
    setAccessToken(accessToken);
    dispatch({ type: "SET_SESSION", user });
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // The session may already be invalid server-side; clear local state regardless.
    } finally {
      setAccessToken(null);
      dispatch({ type: "CLEAR_SESSION" });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const { user } = await getCurrentUser();
    dispatch({ type: "SET_SESSION", user });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, signup, logout, refreshUser }),
    [state, login, signup, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}

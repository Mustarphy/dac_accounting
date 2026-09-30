/**
 * Centralized auth endpoint paths — the single source of truth so no
 * component hardcodes an API path. Appended to NEXT_PUBLIC_API_URL.
 * Keep in sync with docs/auth-api-contract.md.
 */
export const AUTH_ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  me: "/auth/me",
  verifyEmail: "/auth/email/verify",
  resendVerification: "/auth/email/resend",
  forgotPassword: "/auth/password/forgot",
  resetPassword: "/auth/password/reset",
} as const;

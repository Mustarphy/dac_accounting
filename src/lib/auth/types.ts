/**
 * Frontend contract for the DAC Accounting authentication API. The Laravel
 * backend does not exist yet — these types describe what the frontend
 * expects it to implement. See docs/auth-api-contract.md for the full
 * request/response/HTTP-status contract.
 */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: string | null;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type RegisterResponse = {
  user: AuthUser;
  accessToken: string;
  accessTokenExpiresAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  accessTokenExpiresAt: string;
};

export type RefreshResponse = {
  accessToken: string;
  accessTokenExpiresAt: string;
};

export type AuthUserResponse = {
  user: AuthUser;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordRequest = {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type VerifyEmailResponse = {
  message: string;
  user: AuthUser;
};

export type ResendVerificationRequest = {
  email: string;
};

export type ResendVerificationResponse = {
  message: string;
};

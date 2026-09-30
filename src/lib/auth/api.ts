import { apiRequest } from "@/lib/api/client";
import { AUTH_ENDPOINTS } from "./endpoints";
import type {
  AuthUserResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./types";

export function registerAccount(payload: RegisterRequest) {
  return apiRequest<RegisterResponse>(AUTH_ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function login(payload: LoginRequest) {
  return apiRequest<LoginResponse>(AUTH_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function logout() {
  return apiRequest<void>(AUTH_ENDPOINTS.logout, { method: "POST" });
}

export function getCurrentUser() {
  return apiRequest<AuthUserResponse>(AUTH_ENDPOINTS.me, { method: "GET" });
}

export function verifyEmail(payload: VerifyEmailRequest) {
  return apiRequest<VerifyEmailResponse>(AUTH_ENDPOINTS.verifyEmail, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function resendVerificationEmail(payload: ResendVerificationRequest) {
  return apiRequest<ResendVerificationResponse>(AUTH_ENDPOINTS.resendVerification, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function requestPasswordReset(payload: ForgotPasswordRequest) {
  return apiRequest<ForgotPasswordResponse>(AUTH_ENDPOINTS.forgotPassword, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function resetPassword(payload: ResetPasswordRequest) {
  return apiRequest<ResetPasswordResponse>(AUTH_ENDPOINTS.resetPassword, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

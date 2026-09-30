"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/auth/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { getPasswordError } from "@/lib/auth/validation";
import PasswordField from "@/components/auth/PasswordField";

type Status = "idle" | "loading" | "success" | "unavailable" | "invalid" | "error";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const isLoading = status === "loading";

  if (!token || !email) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center"
      >
        <AlertCircle className="size-8 text-red-600" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-ink">Invalid reset link</h3>
        <p className="text-sm text-muted">
          This password reset link is missing or malformed. Please request a new one.
        </p>
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark">
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const passwordError = getPasswordError(password);
    if (passwordError) {
      setFieldError(passwordError);
      return;
    }
    if (password !== passwordConfirmation) {
      setFieldError("Passwords do not match.");
      return;
    }
    setFieldError(null);

    setStatus("loading");
    try {
      // Non-null: the component returns early above when either is missing.
      // TypeScript doesn't carry that narrowing into this hoisted function
      // declaration's body.
      await resetPassword({ email: email!, token: token!, password, passwordConfirmation });
      setStatus("success");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
      } else if (error instanceof ApiError && (error.status === 400 || error.status === 422)) {
        setStatus("invalid");
      } else {
        setStatus("error");
      }
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-primary-light p-8 text-center"
      >
        <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-ink">Password updated</h3>
        <p className="text-sm text-muted">You can now sign in with your new password.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Go to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <PasswordField
        id="password"
        label="New password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        disabled={isLoading}
        required
      />
      <PasswordField
        id="passwordConfirmation"
        label="Confirm new password"
        value={passwordConfirmation}
        onChange={(event) => setPasswordConfirmation(event.target.value)}
        autoComplete="new-password"
        disabled={isLoading}
        required
      />

      {fieldError && (
        <p role="alert" className="text-sm text-red-600">
          {fieldError}
        </p>
      )}

      {status === "invalid" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          This reset link is invalid or has expired. Please request a new one.
        </p>
      )}

      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Password reset isn&apos;t available yet.
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isLoading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

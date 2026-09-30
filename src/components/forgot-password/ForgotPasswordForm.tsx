"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { requestPasswordReset } from "@/lib/auth/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import { isValidEmail } from "@/lib/auth/validation";

type Status = "idle" | "loading" | "sent" | "unavailable" | "error";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const isLoading = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    if (!email.trim() || !isValidEmail(email)) {
      setFieldError("Please enter a valid email address.");
      return;
    }
    setFieldError(null);

    setStatus("loading");
    try {
      // Always resolves to the same generic message below, regardless of
      // whether the email is on file — never confirm or deny an account
      // exists, to avoid account enumeration.
      await requestPasswordReset({ email: email.trim() });
      setStatus("sent");
    } catch (error) {
      setStatus(error instanceof ApiNotConfiguredError ? "unavailable" : "error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-primary-light p-8 text-center"
      >
        <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-ink">Check your email</h3>
        <p className="text-sm text-muted">
          If an account exists for {email}, we&apos;ll send instructions to reset your password.
        </p>
        <Link href="/login" className="text-sm font-medium text-primary hover:text-primary-dark">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
        />
      </div>

      {fieldError && (
        <p role="alert" className="text-sm text-red-600">
          {fieldError}
        </p>
      )}

      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Password reset isn&apos;t available yet. Please contact us if you need assistance.
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
        {isLoading ? "Sending..." : "Send reset link"}
      </button>

      <p className="text-center text-sm text-muted">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
          Sign in
        </Link>
      </p>
    </form>
  );
}

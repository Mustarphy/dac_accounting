"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { isValidEmail } from "@/lib/auth/validation";
import PasswordField from "@/components/auth/PasswordField";

type Status = "idle" | "loading" | "unavailable" | "error";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const isLoading = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    if (!email.trim() || !isValidEmail(email)) {
      setFieldError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setFieldError("Please enter your password.");
      return;
    }
    setFieldError(null);

    setStatus("loading");
    try {
      await login({ email: email.trim(), password, rememberMe });
      router.push(searchParams.get("redirect") || "/portal");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      if (error instanceof ApiError && error.status === 401) {
        setErrorMessage("The email or password you entered is incorrect.");
      } else {
        setErrorMessage("We couldn't sign you in. Please try again.");
      }
      setStatus("error");
    }
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

      <PasswordField
        id="password"
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        disabled={isLoading}
        required
      />

      <div className="flex items-center justify-between">
        <label htmlFor="remember-me" className="flex items-center gap-2 text-sm text-ink">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isLoading}
            className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          Remember me
        </label>

        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark">
          Forgot password?
        </Link>
      </div>

      {fieldError && (
        <p role="alert" className="text-sm text-red-600">
          {fieldError}
        </p>
      )}

      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          The client portal isn&apos;t available yet. Please check back soon,
          or contact us if you need assistance.
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:text-primary-dark">
          Sign up
        </Link>
      </p>
    </form>
  );
}

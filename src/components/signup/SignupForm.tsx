"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { getPasswordError, isValidEmail } from "@/lib/auth/validation";
import PasswordField from "@/components/auth/PasswordField";

type Fields = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

type Status = "idle" | "loading" | "unavailable" | "error";

const initialFields: Fields = { name: "", email: "", password: "", passwordConfirmation: "" };

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.name.trim()) errors.name = "Please enter your full name.";
  if (!fields.email.trim() || !isValidEmail(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }

  const passwordError = getPasswordError(fields.password);
  if (passwordError) errors.password = passwordError;

  if (fields.passwordConfirmation !== fields.password) {
    errors.passwordConfirmation = "Passwords do not match.";
  }

  return errors;
}

export default function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();

  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoading = status === "loading";

  function handleChange(field: keyof Fields) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    try {
      await signup(fields);
      router.push("/portal");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      if (error instanceof ApiError && error.fieldErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(error.fieldErrors).map(([key, messages]) => [key, messages[0]])
          )
        );
        setStatus("idle");
        return;
      }
      if (error instanceof ApiError && error.status === 409) {
        setErrorMessage("An account with this email already exists.");
      } else {
        setErrorMessage("We couldn't create your account. Please try again.");
      }
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={fields.name}
          onChange={handleChange("name")}
          disabled={isLoading}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

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
          value={fields.email}
          onChange={handleChange("email")}
          disabled={isLoading}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <PasswordField
        id="password"
        label="Password"
        value={fields.password}
        onChange={handleChange("password")}
        autoComplete="new-password"
        disabled={isLoading}
        required
        error={errors.password}
      />

      <PasswordField
        id="passwordConfirmation"
        label="Confirm password"
        value={fields.passwordConfirmation}
        onChange={handleChange("passwordConfirmation")}
        autoComplete="new-password"
        disabled={isLoading}
        required
        error={errors.passwordConfirmation}
      />

      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Account creation isn&apos;t available yet. Please check back soon.
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
        {isLoading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
          Sign in
        </Link>
      </p>
    </form>
  );
}

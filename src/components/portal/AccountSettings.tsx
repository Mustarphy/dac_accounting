"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { changePassword, updateProfile } from "@/lib/client/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { getPasswordError } from "@/lib/auth/validation";
import PasswordField from "@/components/auth/PasswordField";

type SaveStatus = "idle" | "saving" | "saved" | "unavailable" | "error";

export default function AccountSettings() {
  const { user, refreshUser } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Account</h1>
        <p className="mt-1 text-sm text-muted">Manage your profile and password.</p>
      </div>

      <ProfileForm name={user?.name ?? ""} email={user?.email ?? ""} onSaved={refreshUser} />
      <PasswordForm />
    </div>
  );
}

function ProfileForm({ name: initialName, email, onSaved }: { name: string; email: string; onSaved: () => void }) {
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;

    setStatus("saving");
    try {
      await updateProfile(name.trim());
      await onSaved();
      setStatus("saved");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : "Couldn't update your profile.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-lg flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-ink">Profile</h2>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-muted"
        />
        <p className="mt-1.5 text-xs text-muted">Email changes aren&apos;t supported yet — contact OAC Accounting if yours has changed.</p>
      </div>

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
          Full name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={status === "saving"}
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
        />
      </div>

      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Profile updates aren&apos;t available yet.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}
      {status === "saved" && (
        <p role="status" className="flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Profile updated.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving" || !name.trim()}
        className="inline-flex items-center justify-center gap-2 self-start rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "saving" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {status === "saving" ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      setFieldError(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setFieldError("New passwords do not match.");
      return;
    }
    setFieldError(null);

    setStatus("saving");
    try {
      await changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus("saved");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      setErrorMessage(
        error instanceof ApiError ? error.message : "Couldn't update your password. Please try again."
      );
      setStatus("error");
    }
  }

  const isSaving = status === "saving";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-lg flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-ink">Password</h2>

      <PasswordField
        id="currentPassword"
        label="Current password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        autoComplete="current-password"
        disabled={isSaving}
        required
      />
      <PasswordField
        id="newPassword"
        label="New password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        autoComplete="new-password"
        disabled={isSaving}
        required
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        disabled={isSaving}
        required
      />

      {fieldError && (
        <p role="alert" className="text-sm text-red-600">
          {fieldError}
        </p>
      )}
      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Password changes aren&apos;t available yet.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}
      {status === "saved" && (
        <p role="status" className="flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Password updated.
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
        className="inline-flex items-center justify-center gap-2 self-start rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isSaving ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

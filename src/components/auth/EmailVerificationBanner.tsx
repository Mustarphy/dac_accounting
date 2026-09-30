"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { resendVerificationEmail } from "@/lib/auth/api";
import { ApiNotConfiguredError } from "@/lib/api/client";

type Status = "idle" | "loading" | "sent" | "unavailable" | "error";

export default function EmailVerificationBanner({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleResend() {
    setStatus("loading");
    try {
      await resendVerificationEmail({ email });
      setStatus("sent");
    } catch (error) {
      setStatus(error instanceof ApiNotConfiguredError ? "unavailable" : "error");
    }
  }

  return (
    <div
      role="status"
      className="mb-6 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"
    >
      <span className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Please verify your email address to unlock all portal features.
      </span>

      {status === "sent" ? (
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="size-4" aria-hidden="true" /> Verification email sent
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          disabled={status === "loading"}
          className="inline-flex items-center gap-1.5 font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700 disabled:opacity-60"
        >
          {status === "loading" && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
          Resend email
        </button>
      )}

      {status === "unavailable" && <span className="text-xs">Not available yet.</span>}
      {status === "error" && <span className="text-xs">Something went wrong. Try again.</span>}
    </div>
  );
}

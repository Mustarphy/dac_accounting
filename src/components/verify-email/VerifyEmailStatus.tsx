"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { verifyEmail } from "@/lib/auth/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";

type Status = "verifying" | "success" | "already-verified" | "invalid" | "unavailable" | "error";

export default function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser, status: authStatus } = useAuth();
  const [status, setStatus] = useState<Status>(token ? "verifying" : "invalid");

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        await verifyEmail({ token: token! });
        if (cancelled) return;
        setStatus("success");
        if (authStatus === "authenticated" || authStatus === "unverified") {
          void refreshUser();
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiNotConfiguredError) {
          setStatus("unavailable");
        } else if (error instanceof ApiError && error.status === 409) {
          setStatus("already-verified");
        } else if (error instanceof ApiError && [400, 404, 422].includes(error.status)) {
          setStatus("invalid");
        } else {
          setStatus("error");
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
    // Intentionally re-run only when the token changes — re-running on
    // authStatus/refreshUser identity changes would re-trigger verification.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === "verifying") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-8 text-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted">Verifying your email…</p>
      </div>
    );
  }

  if (status === "success" || status === "already-verified") {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-ink">
          {status === "already-verified" ? "Email already verified" : "Email verified"}
        </h3>
        <p className="text-sm text-muted">You can now access all portal features.</p>
        <Link href="/portal" className="text-sm font-medium text-primary hover:text-primary-dark">
          Go to portal
        </Link>
      </div>
    );
  }

  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-8 text-center">
      <AlertCircle className="size-8 text-red-600" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-ink">
        {status === "unavailable" ? "Verification isn't available yet" : "We couldn't verify your email"}
      </h3>
      <p className="text-sm text-muted">
        {status === "invalid"
          ? "This verification link is invalid or has expired."
          : status === "unavailable"
            ? "Please check back soon."
            : "Something went wrong. Please try again."}
      </p>
      <Link href="/portal" className="text-sm font-medium text-primary hover:text-primary-dark">
        Return to portal
      </Link>
    </div>
  );
}

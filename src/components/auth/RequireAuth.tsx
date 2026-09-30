"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Client-side gate for pages under an authenticated area. This is a UX
 * convenience, not the security boundary — Laravel must authorize every
 * API request on its own regardless of what this component decides to
 * render. See docs/auth-api-contract.md.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "authenticated" || status === "unverified") {
    return <>{children}</>;
  }

  return (
    <div role="status" className="flex flex-1 items-center justify-center py-24">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading your session…</span>
    </div>
  );
}

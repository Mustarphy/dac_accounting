"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Client-side gate for the admin panel — checks BOTH "is logged in" and
 * "is staff/admin". Same caveat as RequireAuth: this is a UX convenience,
 * not the security boundary. Every /api/v1/staff/* request is
 * independently authorized server-side by the `role:admin,staff`
 * middleware regardless of what this component decides to render — a
 * client who inspects devtools and flips local state still gets 403s
 * from the backend. See app/Http/Middleware/EnsureUserHasRole.php.
 */
export default function RequireStaff({ children }: { children: ReactNode }) {
  const { status, isStaffMember } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if ((status === "authenticated" || status === "unverified") && !isStaffMember) {
      router.replace("/portal");
    }
  }, [status, isStaffMember, router]);

  if ((status === "authenticated" || status === "unverified") && isStaffMember) {
    return <>{children}</>;
  }

  return (
    <div role="status" className="flex flex-1 items-center justify-center py-24">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

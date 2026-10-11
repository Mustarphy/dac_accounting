"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import RequireAuth from "@/components/auth/RequireAuth";
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";
import { useAuth } from "@/lib/auth/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * The authenticated portal's persistent frame — sidebar + topbar, used by
 * every /portal/* page. Replaces the old placeholder PortalView. Auth
 * gating (RequireAuth) happens inside, same loading-state convention as
 * before: nothing in here is the real security boundary, the backend is.
 */
export default function PortalShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-primary-light">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <UnverifiedBanner />
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}

function UnverifiedBanner() {
  const { user } = useAuth();
  if (!user || user.emailVerifiedAt) return null;

  return (
    <div className="mb-6">
      <EmailVerificationBanner email={user.email} />
    </div>
  );
}

export function PortalLoading() {
  return (
    <div role="status" className="flex flex-1 items-center justify-center py-24">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

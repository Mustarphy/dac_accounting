"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import RequireAuth from "@/components/auth/RequireAuth";
import EmailVerificationBanner from "@/components/auth/EmailVerificationBanner";
import { useAuth } from "@/lib/auth/AuthContext";

export default function PortalView() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col bg-primary-light">
        <RequireAuth>
          <PortalContent />
        </RequireAuth>
      </main>
      <Footer />
    </>
  );
}

function PortalContent() {
  const { user, logout } = useAuth();

  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        {user && !user.emailVerifiedAt && <EmailVerificationBanner email={user.email} />}

        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Welcome back{user ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-2 text-sm text-muted">
          This is a placeholder for the DAC Accounting client portal. Account tools and
          documents will appear here once the Laravel backend is connected.
        </p>

        <button
          type="button"
          onClick={() => logout()}
          className="mt-8 inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
        >
          Sign out
        </button>
      </div>
    </Container>
  );
}

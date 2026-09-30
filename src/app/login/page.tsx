import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import LoginForm from "@/components/login/LoginForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Client Login",
  "Sign in to the DAC Accounting client portal."
);

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center bg-primary-light">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8 flex flex-col gap-2 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Client Login
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                Welcome back
              </h1>
              <p className="text-sm text-muted">
                Sign in to access your DAC Accounting client portal.
              </p>
            </div>

            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

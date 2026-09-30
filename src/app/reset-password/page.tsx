import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import ResetPasswordForm from "@/components/reset-password/ResetPasswordForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Reset Password",
  "Choose a new password for your DAC Accounting account."
);

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center bg-primary-light">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8 flex flex-col gap-2 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Reset Password
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-ink">Choose a new password</h1>
            </div>

            <Suspense fallback={null}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

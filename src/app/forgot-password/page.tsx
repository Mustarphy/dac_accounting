import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import ForgotPasswordForm from "@/components/forgot-password/ForgotPasswordForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Forgot Password",
  "Reset your DAC Accounting client portal password."
);

export default function ForgotPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center bg-primary-light">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8 flex flex-col gap-2 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Forgot Password
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-ink">Reset your password</h1>
              <p className="text-sm text-muted">
                Enter the email associated with your account and we&apos;ll send you a link to
                reset your password.
              </p>
            </div>

            <ForgotPasswordForm />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import SignupForm from "@/components/signup/SignupForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Create Account",
  "Create your DAC Accounting client portal account."
);

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center bg-primary-light">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8 flex flex-col gap-2 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Create Account
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-ink">Get started</h1>
              <p className="text-sm text-muted">Create your DAC Accounting client portal account.</p>
            </div>

            <SignupForm />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

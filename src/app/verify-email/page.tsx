import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import VerifyEmailStatus from "@/components/verify-email/VerifyEmailStatus";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Verify Email",
  "Verify your DAC Accounting account email address."
);

export default function VerifyEmailPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center bg-primary-light">
        <Container className="flex justify-center py-16 lg:py-24">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <Suspense fallback={null}>
              <VerifyEmailStatus />
            </Suspense>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

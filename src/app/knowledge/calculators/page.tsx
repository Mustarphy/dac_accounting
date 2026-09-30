import { AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import CalculatorNav from "@/components/calculators/CalculatorNav";
import FuelCalculator from "@/components/calculators/FuelCalculator";
import PropertyCalculator from "@/components/calculators/PropertyCalculator";
import VatCalculator from "@/components/calculators/VatCalculator";
import PayeCalculator from "@/components/calculators/PayeCalculator";
import FinalCTA from "@/components/home/FinalCTA";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Calculators",
  "Free Nigerian fuel, property stamp duty, VAT and payslip calculators from DAC Accounting."
);

export default function CalculatorsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          eyebrow="Knowledge"
          title="Calculators"
          description="Use our practical calculators to estimate everyday business, tax, property and personal finance figures. Enter your details to get an instant estimate, and contact DAC Accounting for professional advice tailored to your circumstances."
        />

        <Container className="py-16 lg:py-20">
          <CalculatorNav />

          <div className="mt-8 flex max-w-3xl items-start gap-3 rounded-lg border border-slate-200 bg-white p-5 text-sm text-muted">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p>
              These calculators produce <strong>estimates only</strong>, based on the figures you
              enter and the Nigerian rules and assumptions documented under each one. They are not a
              substitute for professional accounting or tax advice, and results can change if your
              circumstances, the applicable rules, or effective dates differ from what&apos;s
              assumed here. All amounts are shown in Nigerian Naira (₦).
            </p>
          </div>
        </Container>

        <FuelCalculator />
        <PropertyCalculator />
        <VatCalculator />
        <PayeCalculator />

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

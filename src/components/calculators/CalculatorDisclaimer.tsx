import Button from "@/components/ui/Button";

export default function CalculatorDisclaimer() {
  return (
    <div className="mt-6 flex flex-col items-start gap-4 rounded-lg border border-dashed border-slate-300 p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs leading-relaxed text-muted">
        This is an estimate based on the information you supply and the rules and assumptions
        noted above. It is not tax, accounting, or legal advice and should not be relied on for
        filing, payroll, or transaction decisions. Contact DAC Accounting for guidance specific
        to your circumstances.
      </p>
      <Button href="/contact" variant="outline" className="shrink-0">
        Contact DAC
      </Button>
    </div>
  );
}

import Link from "next/link";
import { Fuel, Home, Receipt, Wallet } from "lucide-react";

const items = [
  {
    id: "fuel",
    label: "Fuel Calculator",
    description: "Estimate annual, monthly and weekly fuel spend.",
    icon: Fuel,
  },
  {
    id: "property",
    label: "Property Calculator",
    description: "Estimate federal stamp duty on a property transfer.",
    icon: Home,
  },
  {
    id: "vat",
    label: "VAT Calculator",
    description: "Add or extract Nigeria's 7.5% VAT from an amount.",
    icon: Receipt,
  },
  {
    id: "payslip",
    label: "Payslip Calculator",
    description: "Estimate PAYE, pension and take-home pay.",
    icon: Wallet,
  },
];

export default function CalculatorNav() {
  return (
    <nav aria-label="Calculators" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ id, label, description, icon: Icon }) => (
        <Link
          key={id}
          href={`#${id}`}
          className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-primary hover:bg-primary-light"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-light text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-ink">{label}</span>
          <span className="text-xs text-muted">{description}</span>
        </Link>
      ))}
    </nav>
  );
}

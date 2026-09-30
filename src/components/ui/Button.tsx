import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  showArrow?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary",
  secondary:
    "bg-primary-light text-primary-dark hover:bg-primary/10 focus-visible:outline-primary",
  outline:
    "border border-slate-300 text-ink hover:border-primary hover:text-primary focus-visible:outline-primary",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap";

export default function Button({
  variant = "primary",
  showArrow = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <Link
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
      {showArrow && <ArrowRight className="size-4" aria-hidden="true" />}
    </Link>
  );
}

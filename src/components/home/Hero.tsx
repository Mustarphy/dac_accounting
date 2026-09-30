import Image from "next/image";
import { FileCheck2, TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { primaryCta, secondaryCta } from "@/lib/site-config";

export default function Hero() {
  return (
    <Container
      as="section"
      className="grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28"
    >
      <div className="flex flex-col items-start gap-6">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          DAC Accounting
        </span>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Clear Financial Guidance for Your Business
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-muted">
          Professional accounting and financial support designed to help
          businesses stay organized, informed and ready for what comes next.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href={primaryCta.href} variant="primary" showArrow>
            {primaryCta.label}
          </Button>
          <Button href={secondaryCta.href} variant="outline">
            {secondaryCta.label}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Image
          src="/images/hero/heroBanner.jpg"
          alt="Two DAC Accounting professionals reviewing financial documents together at a desk"
          width={735}
          height={913}
          priority
          className="aspect-4/5 w-full rounded-2xl object-cover"
        />

        <div className="absolute -bottom-6 -left-6 hidden w-56 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 sm:flex">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <TrendingUp className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Informed decisions</p>
            <p className="text-xs text-muted">Backed by clear reporting</p>
          </div>
        </div>

        <div className="absolute -top-6 -right-4 hidden w-52 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 sm:flex">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <FileCheck2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Organized records</p>
            <p className="text-xs text-muted">Always up to date</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

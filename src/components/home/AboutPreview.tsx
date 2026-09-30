import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function AboutPreview() {
  return (
    <Container
      as="section"
      className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20"
    >
      <div className="flex flex-col items-start gap-6">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          About DAC Accounting
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Straightforward financial support, built around your business
        </h2>
        <p className="text-lg leading-relaxed text-muted">
          DAC Accounting works closely with businesses and individuals to keep
          their financial records organized and their decisions well
          informed. Our approach is clear, professional and focused on what
          matters to you.
        </p>
        <Button href="/about" variant="outline" showArrow>
          Learn More
        </Button>
      </div>

      <div className="relative">
        <Image
          src="/images/about/aboutBanner.jpg"
          alt="DAC Accounting team reviewing financial reports together around a table"
          width={736}
          height={736}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="aspect-4/3 w-full rounded-2xl object-cover object-top"
        />

        <div className="absolute -bottom-6 -right-6 hidden w-56 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 sm:flex">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <BadgeCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Client-focused</p>
            <p className="text-xs text-muted">Guidance built around you</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

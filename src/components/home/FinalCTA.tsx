import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { primaryCta } from "@/lib/site-config";

export default function FinalCTA() {
  return (
    <section className="bg-primary-dark">
      <Container className="flex flex-col items-center gap-6 py-16 text-center lg:py-20">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Let&apos;s make your financial work simpler.
        </h2>
        <p className="max-w-xl text-lg leading-relaxed text-white/80">
          Have questions about your accounting needs? Speak with the DAC
          Accounting team.
        </p>
        <Button href={primaryCta.href} variant="secondary" showArrow>
          {primaryCta.label}
        </Button>
      </Container>
    </section>
  );
}

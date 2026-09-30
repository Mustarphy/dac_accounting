import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ValueGrid from "@/components/ui/ValueGrid";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import FinalCTA from "@/components/home/FinalCTA";
import { values } from "@/lib/values";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | About Us",
  "Learn about DAC Accounting's approach to professional accounting and financial support."
);

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          eyebrow="About DAC Accounting"
          title="Who we are"
          description="DAC Accounting provides professional accounting and financial support for businesses and individuals, with a focus on clarity and reliability."
        />

        <Container className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Our approach
            </h2>
            <p className="text-lg leading-relaxed text-muted">
              We work closely with each client to understand their financial
              position and what they need from an accountant. Rather than a
              one-size-fits-all process, our approach is shaped around the
              individual business or person we&apos;re supporting.
            </p>
            <p className="text-lg leading-relaxed text-muted">
              Whether you need ongoing bookkeeping, support with your tax
              obligations, or guidance on a specific financial decision, we
              aim to communicate clearly and keep things straightforward.
            </p>
          </div>

          <PlaceholderImage
            label="Photo: DAC Accounting office or team"
            className="aspect-4/3 w-full"
          />
        </Container>

        <section className="bg-primary-light">
          <Container className="py-16 lg:py-20">
            <SectionHeading
              align="center"
              eyebrow="Our Values"
              title="How we work with clients"
              className="mx-auto"
            />
            <div className="mt-12">
              <ValueGrid values={values} />
            </div>
          </Container>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

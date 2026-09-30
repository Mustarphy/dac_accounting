import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ValueGrid from "@/components/ui/ValueGrid";
import { values } from "@/lib/values";

export default function TrustSection() {
  return (
    <section className="bg-primary-light">
      <Container className="py-16 lg:py-20">
        <SectionHeading
          align="center"
          title="Accounting support you can rely on"
          description="DAC Accounting takes a professional, considered approach to every client relationship, so you always know where your finances stand."
          className="mx-auto"
        />

        <div className="mt-12">
          <ValueGrid values={values} />
        </div>
      </Container>
    </section>
  );
}

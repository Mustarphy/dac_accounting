import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import ServiceCategorySection from "@/components/services/ServiceCategorySection";
import FinalCTA from "@/components/home/FinalCTA";
import { serviceCategories } from "@/lib/services";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Accounting & Financial Services",
  "An overview of DAC Accounting's business, personal and online accounting services."
);

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          eyebrow="Services"
          title="Accounting & financial services"
          description="Our services are organized around businesses, individuals and modern digital accounting."
        />

        <Container>
          {serviceCategories.map((category) => (
            <ServiceCategorySection key={category.id} {...category} />
          ))}
        </Container>

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

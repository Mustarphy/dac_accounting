import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Contact Us",
  "Get in touch with the DAC Accounting team about your accounting and financial needs."
);

const contactDetails = [
  { icon: Mail, label: "Email", value: siteConfig.email },
  { icon: Phone, label: "Phone", value: siteConfig.phone },
  { icon: MapPin, label: "Office", value: siteConfig.address },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          eyebrow="Contact Us"
          title="Talk to an expert"
          description="Have a question about your accounting or financial needs? Send us a message and the DAC Accounting team will get back to you."
        />

        <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16 lg:py-20">
          <div className="flex flex-col gap-6">
            {contactDetails.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <p className="text-sm text-muted">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <ContactForm />
        </Container>
      </main>
      <Footer />
    </>
  );
}

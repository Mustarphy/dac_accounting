import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { serviceCategories } from "@/lib/services";

export default function ServicesPreview() {
  return (
    <Container as="section" className="py-16 lg:py-20">
      <SectionHeading
        align="center"
        eyebrow="What We Do"
        title="Support across your accounting needs"
        description="Our services are organized around businesses, individuals and modern digital accounting."
        className="mx-auto"
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {serviceCategories.map(({ id, title, description, icon: Icon, services }) => (
          <Link
            key={id}
            href={`/services#${id}`}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6 transition-colors hover:border-primary/40"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary-light text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <p className="text-sm leading-relaxed text-muted">{description}</p>
            <ul className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm text-muted">
              {services.slice(0, 3).map((service) => (
                <li key={service.name}>{service.name}</li>
              ))}
              {services.length > 3 && <li>and more</li>}
            </ul>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button href="/services" variant="outline" showArrow>
          View All Services
        </Button>
      </div>
    </Container>
  );
}

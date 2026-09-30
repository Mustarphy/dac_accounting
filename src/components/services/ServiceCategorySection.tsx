import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import type { ServiceCategory } from "@/lib/services";

export default function ServiceCategorySection({ id, title, description, services }: ServiceCategory) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-200 py-16 first:border-t-0 lg:py-20">
      <SectionHeading title={title} description={description} />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.name} {...service} />
        ))}
      </div>
    </section>
  );
}

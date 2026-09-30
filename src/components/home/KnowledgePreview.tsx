import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { knowledgeCategories } from "@/lib/knowledge";

export default function KnowledgePreview() {
  return (
    <Container as="section" className="py-16 lg:py-20">
      <SectionHeading
        align="center"
        eyebrow="Knowledge"
        title="Insights and useful information"
        description="Practical guidance for businesses and individuals, organized by topic. Articles are coming soon."
        className="mx-auto"
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {knowledgeCategories.map(({ id, title, description, icon: Icon }) => (
          <div
            key={id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 p-6 text-center items-center"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary-light text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-base font-semibold text-ink">{title}</h3>
            <p className="text-sm leading-relaxed text-muted">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button href="/knowledge" variant="outline" showArrow>
          Visit Knowledge Hub
        </Button>
      </div>
    </Container>
  );
}

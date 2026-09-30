import { Newspaper } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import ArticleCard from "@/components/knowledge/ArticleCard";
import FinalCTA from "@/components/home/FinalCTA";
import { articles, knowledgeCategories } from "@/lib/knowledge";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(
  "DAC Accounting | Knowledge",
  "Practical accounting, tax, business and finance guidance from DAC Accounting."
);

export default function KnowledgePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          eyebrow="Knowledge"
          title="Insights and useful information"
          description="Practical guidance for businesses and individuals, organized by topic."
        />

        <Container className="py-16 lg:py-20">
          <div className="flex flex-wrap justify-center gap-3">
            {knowledgeCategories.map(({ id, title, icon: Icon }) => (
              <span
                key={id}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-ink"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {title}
              </span>
            ))}
          </div>

          {articles.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  category={knowledgeCategories.find((c) => c.id === article.categoryId)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-300 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary-light text-primary">
                <Newspaper className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-xl font-semibold text-ink">Articles are coming soon</h2>
              <p className="max-w-md text-sm leading-relaxed text-muted">
                We&apos;re building our knowledge library on tax, accounting,
                business and finance. Check back soon, or get in touch if you
                have a question in the meantime.
              </p>
            </div>
          )}
        </Container>

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

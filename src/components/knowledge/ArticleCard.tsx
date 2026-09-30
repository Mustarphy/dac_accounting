import Image from "next/image";
import type { Article, KnowledgeCategory } from "@/lib/knowledge";

type ArticleCardProps = {
  article: Article;
  category?: KnowledgeCategory;
};

export default function ArticleCard({ article, category }: ArticleCardProps) {
  const formattedDate = new Date(article.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200">
      {article.image && (
        <div className="relative aspect-16/9 w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-6">
        {category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {category.title}
          </span>
        )}
        <h3 className="text-lg font-semibold text-ink">{article.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{article.excerpt}</p>
        <div className="mt-2 flex items-center justify-between text-sm">
          <time dateTime={article.date} className="text-muted">
            {formattedDate}
          </time>
          <span className="font-semibold text-primary">Read More</span>
        </div>
      </div>
    </article>
  );
}

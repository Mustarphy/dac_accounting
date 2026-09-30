import type { LucideIcon } from "lucide-react";
import { Briefcase, LineChart, ReceiptText, BookOpenCheck } from "lucide-react";

export type KnowledgeCategory = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "tax",
    title: "Tax",
    description: "Guidance on tax obligations, deadlines and planning.",
    icon: ReceiptText,
  },
  {
    id: "accounting",
    title: "Accounting",
    description: "Practical accounting and bookkeeping fundamentals.",
    icon: BookOpenCheck,
  },
  {
    id: "business",
    title: "Business",
    description: "Support for running and growing your business.",
    icon: Briefcase,
  },
  {
    id: "finance",
    title: "Finance",
    description: "Insight to help you understand your finances.",
    icon: LineChart,
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  categoryId: string;
  image?: string;
};

/**
 * No DAC-authored articles have been published yet, so this stays empty
 * rather than shipping placeholder content dressed up as real insights.
 * The Knowledge page and its homepage preview both render an honest
 * "coming soon" state while this is empty, and will switch to real
 * article cards the moment it's populated — from this array directly,
 * or later from the Laravel API via the same shape.
 */
export const articles: Article[] = [];

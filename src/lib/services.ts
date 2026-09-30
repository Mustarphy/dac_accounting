import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  BookOpenCheck,
  Briefcase,
  Building2,
  Cloud,
  FileBarChart,
  HardHat,
  PiggyBank,
  ReceiptText,
  Rocket,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export type Service = {
  name: string;
  description: string;
  icon: LucideIcon;
};

export type ServiceCategory = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  services: Service[];
};

/**
 * Real service list supplied by DAC Accounting. Descriptions are short,
 * neutral summaries based on the service name only — replace with DAC's
 * own wording whenever available.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: "business",
    title: "Business Services",
    description: "Support to help keep your business's finances organized and compliant.",
    icon: Briefcase,
    services: [
      {
        name: "Accounts",
        description: "Preparation of accurate annual accounts for your business.",
        icon: Banknote,
      },
      {
        name: "Bookkeeping & Management",
        description: "Ongoing bookkeeping and management accounts to keep your records current.",
        icon: BookOpenCheck,
      },
      {
        name: "Reporting",
        description: "Clear financial reporting to support informed decision-making.",
        icon: FileBarChart,
      },
      {
        name: "Business Start-up",
        description: "Guidance and setup support for businesses just getting started.",
        icon: Rocket,
      },
      {
        name: "Construction",
        description: "Accounting support tailored to the construction sector.",
        icon: HardHat,
      },
      {
        name: "Corporate Tax & Strategic Planning",
        description: "Corporate tax preparation alongside longer-term strategic planning.",
        icon: Building2,
      },
      {
        name: "VAT",
        description: "VAT registration, returns and ongoing compliance support.",
        icon: ReceiptText,
      },
    ],
  },
  {
    id: "personal",
    title: "Personal Services",
    description: "Guidance for your personal tax and financial planning.",
    icon: UserCheck,
    services: [
      {
        name: "Self-assessment",
        description: "Preparation and filing support for self-assessment tax returns.",
        icon: UserCheck,
      },
      {
        name: "Personal Tax Planning",
        description: "Practical guidance to help you plan your personal tax position.",
        icon: PiggyBank,
      },
      {
        name: "Investment & Finance",
        description: "Support to help you understand your personal investment and finance position.",
        icon: TrendingUp,
      },
    ],
  },
  {
    id: "online",
    title: "Online Accounting",
    description: "Modern, digital-first accounting support.",
    icon: Cloud,
    services: [
      {
        name: "Digital Account",
        description: "Cloud-based accounting so you can manage your finances online.",
        icon: Cloud,
      },
    ],
  },
];

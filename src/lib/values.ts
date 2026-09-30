import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Timer, Users } from "lucide-react";

export type ValuePoint = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const values: ValuePoint[] = [
  {
    title: "Professional",
    description: "A considered, detail-oriented approach to every engagement.",
    icon: ShieldCheck,
  },
  {
    title: "Reliable",
    description: "Consistent support you can count on as your needs evolve.",
    icon: Timer,
  },
  {
    title: "Client-focused",
    description: "Guidance shaped around your business, not a one-size-fits-all process.",
    icon: Users,
  },
];

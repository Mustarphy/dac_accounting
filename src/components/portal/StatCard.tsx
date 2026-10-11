import type { ComponentType } from "react";

type StatCardProps = {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  tone?: "default" | "warning";
};

export default function StatCard({ label, value, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <span
        className={
          tone === "warning"
            ? "flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700"
            : "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary"
        }
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

type ResultRowProps = {
  label: string;
  value: string;
  emphasis?: boolean;
  hint?: string;
};

export default function ResultRow({ label, value, emphasis, hint }: ResultRowProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-2.5", emphasis && "mt-1 border-t border-slate-300 pt-4")}>
      <div>
        <p className={cn("text-sm", emphasis ? "font-semibold text-ink" : "text-muted")}>{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
      <p
        className={cn(
          "shrink-0 text-right tabular-nums",
          emphasis ? "text-lg font-bold text-primary" : "text-sm font-medium text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}

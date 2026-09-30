import type { ValuePoint } from "@/lib/values";

type ValueGridProps = {
  values: ValuePoint[];
};

export default function ValueGrid({ values }: ValueGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {values.map(({ title, description, icon: Icon }) => (
        <div key={title} className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <p className="max-w-xs text-sm leading-relaxed text-muted">{description}</p>
        </div>
      ))}
    </div>
  );
}

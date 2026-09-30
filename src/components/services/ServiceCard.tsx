import type { Service } from "@/lib/services";

export default function ServiceCard({ name, description, icon: Icon }: Service) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6 transition-colors hover:border-primary/40">
      <span className="flex size-11 items-center justify-center rounded-full bg-primary-light text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold text-ink">{name}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}

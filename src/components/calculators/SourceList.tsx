import type { RuleSource } from "@/lib/calculators/rules/types";

export default function SourceList({ sources }: { sources: RuleSource[] }) {
  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-ink">Rules and sources used</h4>
      <ul className="mt-3 flex flex-col gap-4">
        {sources.map((source) => (
          <li key={source.id} className="text-xs leading-relaxed text-muted">
            <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
              {source.name}
              {source.confidence === "provisional" && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                  Provisional — confirm before relying on this
                </span>
              )}
            </p>
            <p className="mt-0.5">
              {source.jurisdiction} &middot; Effective {source.effectiveFrom} &middot; {source.legalBasis}
            </p>
            <p className="mt-1">{source.notes}</p>
            <p className="mt-1">
              Source:{" "}
              <a
                href={source.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary-dark"
              >
                {source.sourceUrl}
              </a>{" "}
              (verified {source.verifiedOn})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

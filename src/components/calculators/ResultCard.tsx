import type { ReactNode } from "react";

export default function ResultCard({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="rounded-xl border border-slate-200 bg-primary-light p-6">
      {children}
    </div>
  );
}

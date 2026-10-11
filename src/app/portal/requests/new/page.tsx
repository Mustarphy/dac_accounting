import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import NewRequestForm from "@/components/portal/NewRequestForm";

export const metadata = buildMetadata("DAC Accounting | New Request", "Submit a new accounting request.");

export default function NewRequestPage() {
  return (
    <PortalShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">New Request</h1>
          <p className="mt-1 text-sm text-muted">Tell us what you need and we&apos;ll get started.</p>
        </div>
        <NewRequestForm />
      </div>
    </PortalShell>
  );
}

import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import RequestsList from "@/components/portal/RequestsList";

export const metadata = buildMetadata("OAC Accounting | Completed Work", "Your concluded accounting requests.");

export default function CompletedWorkPage() {
  return (
    <PortalShell>
      <RequestsList
        title="Completed Work"
        description="Requests OAC Accounting has concluded, with their final deliverables."
        fixedStatus="concluded"
      />
    </PortalShell>
  );
}

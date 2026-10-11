import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import RequestsList from "@/components/portal/RequestsList";

export const metadata = buildMetadata("DAC Accounting | My Requests", "Your accounting requests.");

export default function RequestsPage() {
  return (
    <PortalShell>
      <RequestsList
        title="My Requests"
        description="View, search and filter all of your accounting requests."
      />
    </PortalShell>
  );
}

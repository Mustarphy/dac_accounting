import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import InformationRequestsList from "@/components/portal/InformationRequestsList";

export const metadata = buildMetadata("OAC Accounting | Information Requests", "Respond to requests for information.");

export default function InformationRequestsPage() {
  return (
    <PortalShell>
      <InformationRequestsList />
    </PortalShell>
  );
}

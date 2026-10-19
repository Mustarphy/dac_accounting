import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import DashboardOverview from "@/components/portal/DashboardOverview";

export const metadata = buildMetadata("OAC Accounting | Client Portal", "Your OAC Accounting client portal.");

export default function PortalPage() {
  return (
    <PortalShell>
      <DashboardOverview />
    </PortalShell>
  );
}

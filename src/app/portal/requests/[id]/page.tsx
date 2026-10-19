import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import RequestDetailView from "@/components/portal/RequestDetailView";

export const metadata = buildMetadata("OAC Accounting | Request Details", "View your accounting request.");

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PortalShell>
      <RequestDetailView requestId={id} />
    </PortalShell>
  );
}

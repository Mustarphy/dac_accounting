import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import DocumentCentre from "@/components/portal/DocumentCentre";

export const metadata = buildMetadata("OAC Accounting | Document Centre", "All your accounting documents in one place.");

export default function DocumentsPage() {
  return (
    <PortalShell>
      <DocumentCentre />
    </PortalShell>
  );
}

import { buildMetadata } from "@/lib/metadata";
import PortalView from "@/components/portal/PortalView";

export const metadata = buildMetadata("DAC Accounting | Client Portal", "Your DAC Accounting client portal.");

export default function PortalPage() {
  return <PortalView />;
}

import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import AccountSettings from "@/components/portal/AccountSettings";

export const metadata = buildMetadata("DAC Accounting | Account", "Manage your DAC Accounting account.");

export default function AccountPage() {
  return (
    <PortalShell>
      <AccountSettings />
    </PortalShell>
  );
}

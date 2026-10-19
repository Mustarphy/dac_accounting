import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import AccountSettings from "@/components/portal/AccountSettings";

export const metadata = buildMetadata("OAC Accounting | Account", "Manage your OAC Accounting account.");

export default function AccountPage() {
  return (
    <PortalShell>
      <AccountSettings />
    </PortalShell>
  );
}

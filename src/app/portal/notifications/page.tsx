import { buildMetadata } from "@/lib/metadata";
import PortalShell from "@/components/portal/PortalShell";
import NotificationsList from "@/components/portal/NotificationsList";

export const metadata = buildMetadata("OAC Accounting | Notifications", "Your OAC Accounting notifications.");

export default function NotificationsPage() {
  return (
    <PortalShell>
      <NotificationsList />
    </PortalShell>
  );
}

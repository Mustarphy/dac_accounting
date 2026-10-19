import { buildMetadata } from "@/lib/metadata";
import AdminShell from "@/components/admin/AdminShell";
import AdminRequestsList from "@/components/admin/AdminRequestsList";

export const metadata = buildMetadata("Requests | OAC Admin", "Browse and filter every accounting request.");

export default function AdminRequestsPage() {
  return (
    <AdminShell>
      <AdminRequestsList />
    </AdminShell>
  );
}

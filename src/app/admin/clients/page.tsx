import { buildMetadata } from "@/lib/metadata";
import AdminShell from "@/components/admin/AdminShell";
import AdminClientsList from "@/components/admin/AdminClientsList";

export const metadata = buildMetadata("Clients | OAC Admin", "Browse and search OAC Accounting clients.");

export default function AdminClientsPage() {
  return (
    <AdminShell>
      <AdminClientsList />
    </AdminShell>
  );
}

import { buildMetadata } from "@/lib/metadata";
import AdminShell from "@/components/admin/AdminShell";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";

export const metadata = buildMetadata("DAC Accounting | Admin Panel", "Staff admin panel for DAC Accounting.");

export default function AdminPage() {
  return (
    <AdminShell>
      <AdminDashboardOverview />
    </AdminShell>
  );
}

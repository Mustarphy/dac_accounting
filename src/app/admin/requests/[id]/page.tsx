import { buildMetadata } from "@/lib/metadata";
import AdminShell from "@/components/admin/AdminShell";
import AdminRequestDetail from "@/components/admin/AdminRequestDetail";

export const metadata = buildMetadata("Request Details | DAC Admin", "Review and manage an accounting request.");

export default async function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminShell>
      <AdminRequestDetail requestId={id} />
    </AdminShell>
  );
}

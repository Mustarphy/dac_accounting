import { buildMetadata } from "@/lib/metadata";
import AdminShell from "@/components/admin/AdminShell";
import AdminClientDetail from "@/components/admin/AdminClientDetail";

export const metadata = buildMetadata("Client Details | DAC Admin", "View a client's requests and activity.");

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminShell>
      <AdminClientDetail clientId={id} />
    </AdminShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { getAdminRequest } from "@/lib/staff/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { formatDate, SERVICE_TYPE_LABELS } from "@/lib/client/format";
import type { RequestDocumentItem, RequestStatus } from "@/lib/client/types";
import type { AdminAccountingRequestDetail, InternalNoteItem } from "@/lib/staff/types";
import EmptyState from "@/components/portal/EmptyState";
import ErrorState from "@/components/portal/ErrorState";
import ActivityTimeline from "@/components/portal/ActivityTimeline";
import AdminStatusControl from "./AdminStatusControl";
import AdminDocumentTable from "./AdminDocumentTable";
import AdminDeliverableUploadForm from "./AdminDeliverableUploadForm";
import AdminInformationRequestForm from "./AdminInformationRequestForm";
import AdminInformationRequestsList from "./AdminInformationRequestsList";
import AdminInternalNotes from "./AdminInternalNotes";
import { AdminLoading } from "./AdminShell";

type Status = "loading" | "ready" | "unavailable" | "not-found" | "error";

export default function AdminRequestDetail({ requestId }: { requestId: string }) {
  const [request, setRequest] = useState<AdminAccountingRequestDetail | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    getAdminRequest(requestId)
      .then((data) => {
        if (cancelled) return;
        setRequest(data.request);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof ApiNotConfiguredError) {
          setStatus("unavailable");
        } else if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
          setStatus("not-found");
        } else {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  if (status === "loading") return <AdminLoading />;
  if (status === "unavailable") {
    return <ErrorState message="Request details aren't available yet. Please check back soon." />;
  }
  if (status === "not-found") {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Request not found"
        description="This request doesn't exist."
        action={
          <Link href="/admin/requests" className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark">
            ← Back to Requests
          </Link>
        }
      />
    );
  }
  if (status === "error" || !request) {
    return <ErrorState message="We couldn't load this request. Please try again." />;
  }

  function handleStatusUpdated(newStatus: RequestStatus) {
    setRequest((prev) =>
      prev ? { ...prev, status: newStatus, concludedAt: newStatus === "concluded" ? new Date().toISOString() : null } : prev
    );
  }

  function handleDocumentReviewed(updated: RequestDocumentItem) {
    setRequest((prev) =>
      prev ? { ...prev, documents: prev.documents.map((doc) => (doc.id === updated.id ? updated : doc)) } : prev
    );
  }

  function handleDeliverablePublished(document: RequestDocumentItem) {
    setRequest((prev) => (prev ? { ...prev, documents: [document, ...prev.documents] } : prev));
  }

  function handleInformationRequestCreated(informationRequest: AdminAccountingRequestDetail["informationRequests"][number]) {
    setRequest((prev) =>
      prev ? { ...prev, informationRequests: [informationRequest, ...prev.informationRequests] } : prev
    );
  }

  function handleNoteCreated(note: InternalNoteItem) {
    setRequest((prev) => (prev ? { ...prev, internalNotes: [note, ...prev.internalNotes] } : prev));
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Requests
        </Link>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">{request.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {request.reference} · {SERVICE_TYPE_LABELS[request.serviceType]} · Created {formatDate(request.createdAt)}
            </p>
            {request.client && (
              <p className="mt-1 text-sm">
                <Link href={`/admin/clients/${request.client.id}`} className="font-medium text-primary hover:text-primary-dark">
                  {request.client.name}
                </Link>
                <span className="text-muted"> · {request.client.email}</span>
              </p>
            )}
          </div>
          <AdminStatusControl requestId={request.id} status={request.status} onUpdated={handleStatusUpdated} />
        </div>

        {request.description && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink">{request.description}</p>}
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Documents</h2>
        <AdminDeliverableUploadForm requestId={request.id} onPublished={handleDeliverablePublished} />
        {request.documents.length > 0 ? (
          <AdminDocumentTable documents={request.documents} onReviewed={handleDocumentReviewed} />
        ) : (
          <p className="text-sm text-muted">No documents yet.</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Information requests</h2>
        <AdminInformationRequestForm requestId={request.id} onCreated={handleInformationRequestCreated} />
        <AdminInformationRequestsList informationRequests={request.informationRequests} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Internal notes</h2>
        <AdminInternalNotes requestId={request.id} notes={request.internalNotes} onCreated={handleNoteCreated} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Activity</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ActivityTimeline activity={request.activity} />
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { getAccountingRequest } from "@/lib/client/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { formatDate, SERVICE_TYPE_LABELS } from "@/lib/client/format";
import type { AccountingRequestDetail, RequestDocumentItem } from "@/lib/client/types";
import StatusBadge from "./StatusBadge";
import DocumentTable from "./DocumentTable";
import DocumentUploadForm from "./DocumentUploadForm";
import InformationRequestCard from "./InformationRequestCard";
import ActivityTimeline from "./ActivityTimeline";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import { PortalLoading } from "./PortalShell";

type Status = "loading" | "ready" | "unavailable" | "not-found" | "error";

export default function RequestDetailView({ requestId }: { requestId: string }) {
  const [request, setRequest] = useState<AccountingRequestDetail | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    // See the identical comment in DocumentCentre.tsx — resetting loading
    // state before a dependency-triggered refetch is the documented React
    // pattern, not an effect this rule's concern applies to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");

    getAccountingRequest(requestId)
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

  if (status === "loading") return <PortalLoading />;
  if (status === "unavailable") {
    return <ErrorState message="Request details aren't available yet. Please check back soon." />;
  }
  if (status === "not-found") {
    return (
      <EmptyState
        icon={FileText}
        title="Request not found"
        description="This request doesn't exist, or isn't associated with your account."
        action={
          <Link href="/portal/requests" className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark">
            ← Back to My Requests
          </Link>
        }
      />
    );
  }
  if (status === "error" || !request) {
    return <ErrorState message="We couldn't load this request. Please try again." />;
  }

  const pendingInfoRequests = request.informationRequests.filter((r) => r.status === "pending");
  const respondedInfoRequests = request.informationRequests.filter((r) => r.status === "responded");

  function handleDocumentUploaded(document: RequestDocumentItem) {
    setRequest((prev) => (prev ? { ...prev, documents: [document, ...prev.documents] } : prev));
  }

  function handleInformationRequestResponded(updated: AccountingRequestDetail["informationRequests"][number]) {
    setRequest((prev) =>
      prev
        ? {
            ...prev,
            informationRequests: prev.informationRequests.map((r) => (r.id === updated.id ? updated : r)),
          }
        : prev
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/portal/requests"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          My Requests
        </Link>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">{request.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {request.reference} · {SERVICE_TYPE_LABELS[request.serviceType]} · Created {formatDate(request.createdAt)}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {request.description && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink">{request.description}</p>}
      </div>

      {pendingInfoRequests.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Action needed</h2>
          {pendingInfoRequests.map((informationRequest) => (
            <InformationRequestCard
              key={informationRequest.id}
              informationRequest={informationRequest}
              onResponded={handleInformationRequestResponded}
            />
          ))}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Documents</h2>
        <DocumentUploadForm requestId={request.id} onUploaded={handleDocumentUploaded} />
        {request.documents.length > 0 ? (
          <DocumentTable documents={request.documents} />
        ) : (
          <p className="text-sm text-muted">No documents yet — upload one above.</p>
        )}
      </section>

      {respondedInfoRequests.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Resolved information requests</h2>
          {respondedInfoRequests.map((informationRequest) => (
            <InformationRequestCard
              key={informationRequest.id}
              informationRequest={informationRequest}
              onResponded={handleInformationRequestResponded}
            />
          ))}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Activity</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ActivityTimeline activity={request.activity} />
        </div>
      </section>
    </div>
  );
}

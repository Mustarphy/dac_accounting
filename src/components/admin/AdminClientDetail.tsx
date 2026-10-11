"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import { getClient } from "@/lib/staff/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { formatDate, SERVICE_TYPE_LABELS } from "@/lib/client/format";
import type { AdminAccountingRequestSummary, ClientSummary } from "@/lib/staff/types";
import StatusBadge from "@/components/portal/StatusBadge";
import EmptyState from "@/components/portal/EmptyState";
import ErrorState from "@/components/portal/ErrorState";
import { AdminLoading } from "./AdminShell";

type Status = "loading" | "ready" | "unavailable" | "not-found" | "error";

export default function AdminClientDetail({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<ClientSummary | null>(null);
  const [requests, setRequests] = useState<AdminAccountingRequestSummary[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    getClient(clientId)
      .then((data) => {
        if (cancelled) return;
        setClient(data.client);
        setRequests(data.requests);
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
  }, [clientId]);

  if (status === "loading") return <AdminLoading />;
  if (status === "unavailable") {
    return <ErrorState message="Client details aren't available yet. Please check back soon." />;
  }
  if (status === "not-found") {
    return (
      <EmptyState
        icon={Users}
        title="Client not found"
        description="This client doesn't exist."
        action={
          <Link href="/admin/clients" className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark">
            ← Back to Clients
          </Link>
        }
      />
    );
  }
  if (status === "error" || !client) {
    return <ErrorState message="We couldn't load this client. Please try again." />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Clients
        </Link>

        <div className="mt-3 flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-lg font-semibold text-primary">
            {client.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">{client.name}</h1>
            <p className="mt-1 text-sm text-muted">
              {client.email} · Joined {formatDate(client.createdAt)}
              {!client.emailVerifiedAt && " · Email unverified"}
            </p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Requests ({requests.length})</h2>

        {requests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No requests yet"
            description="This client hasn't submitted any accounting requests."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-200">
              {requests.map((request) => (
                <li key={request.id}>
                  <Link
                    href={`/admin/requests/${request.id}`}
                    className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{request.title}</p>
                      <p className="text-xs text-muted">
                        {request.reference} · {SERVICE_TYPE_LABELS[request.serviceType]}
                      </p>
                    </div>
                    <StatusBadge status={request.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

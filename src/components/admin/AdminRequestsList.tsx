"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ClipboardList, Search } from "lucide-react";
import { listAdminRequests } from "@/lib/staff/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import { SERVICE_TYPE_LABELS } from "@/lib/client/format";
import type { RequestStatus } from "@/lib/client/types";
import type { AdminAccountingRequestSummary } from "@/lib/staff/types";
import StatusBadge from "@/components/portal/StatusBadge";
import EmptyState from "@/components/portal/EmptyState";
import ErrorState from "@/components/portal/ErrorState";
import { AdminLoading } from "./AdminShell";

type Status = "loading" | "ready" | "unavailable" | "error";

const STATUS_TABS: { label: string; value: RequestStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Opened", value: "opened" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Concluded", value: "concluded" },
];

export default function AdminRequestsList() {
  const [activeStatus, setActiveStatus] = useState<RequestStatus | "all">("all");
  const [needsAttention, setNeedsAttention] = useState(false);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [requests, setRequests] = useState<AdminAccountingRequestSummary[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");

    listAdminRequests({
      status: activeStatus === "all" ? undefined : activeStatus,
      search: appliedSearch || undefined,
      needsAttention: needsAttention || undefined,
    })
      .then((data) => {
        if (cancelled) return;
        setRequests(data.requests);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(error instanceof ApiNotConfiguredError ? "unavailable" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [activeStatus, appliedSearch, needsAttention]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedSearch(search.trim());
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Requests</h1>
        <p className="mt-1 text-sm text-muted">Every accounting request, across every client.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveStatus(tab.value)}
              className={
                activeStatus === tab.value
                  ? "rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white"
                  : "rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink hover:border-primary hover:text-primary"
              }
            >
              {tab.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setNeedsAttention((prev) => !prev)}
            className={
              needsAttention
                ? "rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white"
                : "rounded-md border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-800 hover:border-amber-500"
            }
          >
            Needs attention
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, reference, client…"
            aria-label="Search requests"
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
        </form>
      </div>

      {status === "loading" && <AdminLoading />}
      {status === "unavailable" && <ErrorState message="Requests aren't available yet. Please check back soon." />}
      {status === "error" && <ErrorState message="We couldn't load requests. Please try again." />}

      {status === "ready" && requests.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No matching requests"
          description="Try a different search term or filter."
        />
      )}

      {status === "ready" && requests.length > 0 && (
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
                      {request.client ? ` · ${request.client.name}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {Boolean(request.pendingInformationRequestCount) && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        Awaiting client
                      </span>
                    )}
                    {Boolean(request.unreviewedDocumentCount) && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                        {request.unreviewedDocumentCount} to review
                      </span>
                    )}
                    <StatusBadge status={request.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

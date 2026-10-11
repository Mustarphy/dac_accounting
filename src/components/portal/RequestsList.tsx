"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ClipboardList, Plus, Search } from "lucide-react";
import { listAccountingRequests } from "@/lib/client/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import { SERVICE_TYPE_LABELS } from "@/lib/client/format";
import type { AccountingRequestSummary, RequestStatus } from "@/lib/client/types";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import { PortalLoading } from "./PortalShell";

type Status = "loading" | "ready" | "unavailable" | "error";

const STATUS_TABS: { label: string; value: RequestStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Opened", value: "opened" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Concluded", value: "concluded" },
];

type RequestsListProps = {
  title: string;
  description: string;
  /** Locks the page to one status (used by the Completed Work page) and hides the status tabs. */
  fixedStatus?: RequestStatus;
};

export default function RequestsList({ title, description, fixedStatus }: RequestsListProps) {
  const [activeStatus, setActiveStatus] = useState<RequestStatus | "all">(fixedStatus ?? "all");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [requests, setRequests] = useState<AccountingRequestSummary[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    // See the identical comment in DocumentCentre.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");

    listAccountingRequests({
      status: activeStatus === "all" ? undefined : activeStatus,
      search: appliedSearch || undefined,
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
  }, [activeStatus, appliedSearch]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedSearch(search.trim());
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <Link
          href="/portal/requests/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Request
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {!fixedStatus && (
          <div className="flex flex-wrap gap-2">
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
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or reference…"
            aria-label="Search requests"
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
        </form>
      </div>

      {status === "loading" && <PortalLoading />}
      {status === "unavailable" && <ErrorState message="Requests aren't available yet. Please check back soon." />}
      {status === "error" && <ErrorState message="We couldn't load your requests. Please try again." />}

      {status === "ready" && requests.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title={appliedSearch || activeStatus !== "all" ? "No matching requests" : "No requests yet"}
          description={
            appliedSearch || activeStatus !== "all"
              ? "Try a different search term or status filter."
              : "When you submit your first accounting request, it'll show up here."
          }
          action={
            !appliedSearch && activeStatus === "all" ? (
              <Link
                href="/portal/requests/new"
                className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Create your first request →
              </Link>
            ) : undefined
          }
        />
      )}

      {status === "ready" && requests.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-200">
            {requests.map((request) => (
              <li key={request.id}>
                <Link
                  href={`/portal/requests/${request.id}`}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{request.title}</p>
                    <p className="text-xs text-muted">
                      {request.reference} · {SERVICE_TYPE_LABELS[request.serviceType]}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {Boolean(request.pendingInformationRequestCount) && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        Action needed
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

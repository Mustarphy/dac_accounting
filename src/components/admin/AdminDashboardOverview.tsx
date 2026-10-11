"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ClipboardList, Eye, FolderClock } from "lucide-react";
import { getStaffDashboardSummary } from "@/lib/staff/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import { formatDateTime, SERVICE_TYPE_LABELS } from "@/lib/client/format";
import type { StaffDashboardSummary } from "@/lib/staff/types";
import StatCard from "@/components/portal/StatCard";
import StatusBadge from "@/components/portal/StatusBadge";
import EmptyState from "@/components/portal/EmptyState";
import ErrorState from "@/components/portal/ErrorState";
import { AdminLoading } from "./AdminShell";

type Status = "loading" | "ready" | "unavailable" | "error";

export default function AdminDashboardOverview() {
  const [summary, setSummary] = useState<StaffDashboardSummary | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    getStaffDashboardSummary()
      .then((data) => {
        if (cancelled) return;
        setSummary(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(error instanceof ApiNotConfiguredError ? "unavailable" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") return <AdminLoading />;
  if (status === "unavailable") {
    return <ErrorState message="The admin panel isn't fully available yet. Please check back soon." />;
  }
  if (status === "error" || !summary) {
    return <ErrorState message="We couldn't load the dashboard. Please refresh the page." />;
  }

  const hasAnyRequests = summary.recentRequests.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted">A live summary across every client&apos;s requests.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total" value={summary.counts.total} icon={ClipboardList} />
        <StatCard label="Opened" value={summary.counts.opened} icon={ClipboardList} />
        <StatCard label="Ongoing" value={summary.counts.ongoing} icon={FolderClock} />
        <StatCard label="Concluded" value={summary.counts.concluded} icon={CheckCircle2} />
        <StatCard
          label="Awaiting client info"
          value={summary.counts.awaitingClientInformation}
          icon={AlertTriangle}
          tone={summary.counts.awaitingClientInformation > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Awaiting staff review"
          value={summary.counts.awaitingStaffReview}
          icon={Eye}
          tone={summary.counts.awaitingStaffReview > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-xl border border-slate-200 bg-white lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Recent requests</h2>
            <Link href="/admin/requests" className="text-sm font-medium text-primary hover:text-primary-dark">
              View all
            </Link>
          </div>

          {hasAnyRequests ? (
            <ul className="divide-y divide-slate-200">
              {summary.recentRequests.map((request) => (
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
                    <StatusBadge status={request.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5">
              <EmptyState
                icon={ClipboardList}
                title="No requests yet"
                description="Once a client submits a request, it'll show up here."
              />
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Recent activity</h2>
          </div>

          {summary.recentActivity.length > 0 ? (
            <ul className="flex flex-col gap-4 px-5 py-4">
              {summary.recentActivity.map((activity) => (
                <li key={activity.id} className="text-sm">
                  <p className="text-ink">{activity.description}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {activity.accountingRequestTitle ? `${activity.accountingRequestTitle} · ` : ""}
                    {formatDateTime(activity.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-muted">No activity yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

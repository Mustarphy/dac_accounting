"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ClipboardList, FolderClock, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getDashboardSummary } from "@/lib/client/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import { formatDateTime, SERVICE_TYPE_LABELS } from "@/lib/client/format";
import type { DashboardSummary } from "@/lib/client/types";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import { PortalLoading } from "./PortalShell";

type Status = "loading" | "ready" | "unavailable" | "error";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    getDashboardSummary()
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

  if (status === "loading") return <PortalLoading />;
  if (status === "unavailable") {
    return <ErrorState message="The client portal isn't fully available yet. Please check back soon." />;
  }
  if (status === "error" || !summary) {
    return <ErrorState message="We couldn't load your dashboard. Please refresh the page." />;
  }

  const hasAnyRequests = summary.recentRequests.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Good to see you{user ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s happening with your accounting requests.</p>
        </div>
        <Link
          href="/portal/requests/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Request
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Opened" value={summary.counts.opened} icon={ClipboardList} />
        <StatCard label="Ongoing" value={summary.counts.ongoing} icon={FolderClock} />
        <StatCard label="Concluded" value={summary.counts.concluded} icon={CheckCircle2} />
        <StatCard
          label="Awaiting your action"
          value={summary.counts.awaitingYourAction}
          icon={AlertTriangle}
          tone={summary.counts.awaitingYourAction > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-xl border border-slate-200 bg-white lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Recent requests</h2>
            <Link href="/portal/requests" className="text-sm font-medium text-primary hover:text-primary-dark">
              View all
            </Link>
          </div>

          {hasAnyRequests ? (
            <ul className="divide-y divide-slate-200">
              {summary.recentRequests.map((request) => (
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
                description="When you submit your first accounting request, it'll show up here."
                action={
                  <Link
                    href="/portal/requests/new"
                    className="mt-2 text-sm font-semibold text-primary hover:text-primary-dark"
                  >
                    Create your first request →
                  </Link>
                }
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
                  <p className="mt-0.5 text-xs text-muted">{formatDateTime(activity.createdAt)}</p>
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

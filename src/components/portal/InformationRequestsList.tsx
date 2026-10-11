"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
import { listInformationRequests } from "@/lib/client/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import type { InformationRequestItem } from "@/lib/client/types";
import InformationRequestCard from "./InformationRequestCard";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import { PortalLoading } from "./PortalShell";

type Status = "loading" | "ready" | "unavailable" | "error";

export default function InformationRequestsList() {
  const [items, setItems] = useState<InformationRequestItem[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    listInformationRequests()
      .then((data) => {
        if (cancelled) return;
        setItems(data.informationRequests);
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

  function handleResponded(updated: InformationRequestItem) {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  }

  if (status === "loading") return <PortalLoading />;
  if (status === "unavailable") {
    return <ErrorState message="Information requests aren't available yet. Please check back soon." />;
  }
  if (status === "error") {
    return <ErrorState message="We couldn't load your information requests. Please try again." />;
  }

  const pending = items.filter((item) => item.status === "pending");
  const responded = items.filter((item) => item.status === "responded");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Requests for Information</h1>
        <p className="mt-1 text-sm text-muted">
          When DAC Accounting needs something from you to continue your work, it&apos;ll show up here.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={MessageCircleQuestion}
          title="Nothing needed from you right now"
          description="If DAC Accounting needs more information to process one of your requests, it'll appear here."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {pending.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Needs your response</h2>
              {pending.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <InformationRequestCard informationRequest={item} onResponded={handleResponded} />
                  <Link
                    href={`/portal/requests/${item.accountingRequestId}`}
                    className="self-start text-xs font-medium text-primary hover:text-primary-dark"
                  >
                    View related request →
                  </Link>
                </div>
              ))}
            </section>
          )}

          {responded.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Resolved</h2>
              {responded.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <InformationRequestCard informationRequest={item} onResponded={handleResponded} />
                  <Link
                    href={`/portal/requests/${item.accountingRequestId}`}
                    className="self-start text-xs font-medium text-primary hover:text-primary-dark"
                  >
                    View related request →
                  </Link>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

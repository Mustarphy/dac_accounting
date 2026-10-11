"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { updateRequestStatus } from "@/lib/staff/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { STATUS_LABELS } from "@/lib/client/format";
import type { RequestStatus } from "@/lib/client/types";
import StatusBadge from "@/components/portal/StatusBadge";

/**
 * Mirrors RequestStatusTransitionService::ALLOWED_TRANSITIONS for UI
 * purposes only (which buttons to show) — the backend re-validates every
 * transition independently and is the real enforcement point.
 */
const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  opened: ["ongoing"],
  ongoing: ["concluded"],
  concluded: ["ongoing"],
};

type Status = "idle" | "loading" | "unavailable" | "error";

export default function AdminStatusControl({
  requestId,
  status: currentStatus,
  onUpdated,
}: {
  requestId: string;
  status: RequestStatus;
  onUpdated: (status: RequestStatus) => void;
}) {
  const [state, setState] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isLoading = state === "loading";

  async function handleTransition(to: RequestStatus) {
    if (isLoading) return;
    setState("loading");
    try {
      const { request } = await updateRequestStatus(requestId, to);
      onUpdated(request.status);
      setState("idle");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setState("unavailable");
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : "Couldn't update status. Please try again.");
      setState("error");
    }
  }

  const nextOptions = ALLOWED_TRANSITIONS[currentStatus] ?? [];

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        <StatusBadge status={currentStatus} />
        {nextOptions.map((next) => (
          <button
            key={next}
            type="button"
            onClick={() => handleTransition(next)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
            {next === "ongoing" && currentStatus === "concluded" ? "Reopen" : `Mark ${STATUS_LABELS[next]}`}
          </button>
        ))}
      </div>

      {state === "unavailable" && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-muted">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          Status updates aren&apos;t available yet.
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}

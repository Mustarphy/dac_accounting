"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, MessageCircleQuestion } from "lucide-react";
import { respondToInformationRequest } from "@/lib/client/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/client/format";
import type { InformationRequestItem } from "@/lib/client/types";

type Status = "idle" | "loading" | "unavailable" | "error";

export default function InformationRequestCard({
  informationRequest,
  onResponded,
}: {
  informationRequest: InformationRequestItem;
  onResponded: (updated: InformationRequestItem) => void;
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoading = status === "loading";
  const isPending = informationRequest.status === "pending";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !message.trim()) return;

    setStatus("loading");
    try {
      const { informationRequest: updated } = await respondToInformationRequest(
        informationRequest.id,
        message.trim()
      );
      onResponded(updated);
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : "Couldn't submit your response. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div
      className={
        isPending
          ? "rounded-xl border border-amber-200 bg-amber-50 p-5"
          : "rounded-xl border border-slate-200 bg-white p-5"
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={
            isPending
              ? "flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
              : "flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          }
        >
          {isPending ? (
            <MessageCircleQuestion className="size-4" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="size-4" aria-hidden="true" />
          )}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">
            {isPending ? "DAC Accounting needs more information" : "Information request resolved"}
          </p>
          <p className="mt-1 text-sm text-ink">{informationRequest.message}</p>
          <p className="mt-1 text-xs text-muted">{formatDateTime(informationRequest.createdAt)}</p>

          {!isPending && informationRequest.responseMessage && (
            <div className="mt-3 rounded-md bg-white p-3 text-sm">
              <p className="font-medium text-ink">Your response:</p>
              <p className="mt-1 text-ink">{informationRequest.responseMessage}</p>
              {informationRequest.respondedAt && (
                <p className="mt-1 text-xs text-muted">{formatDateTime(informationRequest.respondedAt)}</p>
              )}
            </div>
          )}

          {isPending && (
            <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-3">
              <label htmlFor={`response-${informationRequest.id}`} className="sr-only">
                Your response
              </label>
              <textarea
                id={`response-${informationRequest.id}`}
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={isLoading}
                placeholder="Type your response here. You can also upload the requested document below."
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
              />

              {status === "unavailable" && (
                <p role="alert" className="flex items-start gap-2 text-xs text-muted">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Responses aren&apos;t available yet.
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="flex items-start gap-2 text-xs text-red-600">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="inline-flex items-center justify-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
                {isLoading ? "Sending..." : "Send Response"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

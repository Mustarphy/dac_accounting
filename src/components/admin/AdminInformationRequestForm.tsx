"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { createInformationRequest } from "@/lib/staff/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import type { InformationRequestItem } from "@/lib/client/types";

type Status = "idle" | "loading" | "unavailable" | "error";

export default function AdminInformationRequestForm({
  requestId,
  onCreated,
}: {
  requestId: string;
  onCreated: (informationRequest: InformationRequestItem) => void;
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoading = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !message.trim()) return;

    setStatus("loading");
    try {
      const { informationRequest } = await createInformationRequest(requestId, message.trim());
      onCreated(informationRequest);
      setMessage("");
      setStatus("idle");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : "Couldn't send the request. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5">
      <label htmlFor="new-information-request" className="text-sm font-medium text-ink">
        Ask the client for more information
      </label>
      <textarea
        id="new-information-request"
        rows={3}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={isLoading}
        placeholder="E.g. please upload your bank statement for March."
        className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
      />

      {status === "unavailable" && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-muted">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          Information requests aren&apos;t available yet.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="inline-flex items-center justify-center gap-2 self-start rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Send className="size-3.5" aria-hidden="true" />}
        {isLoading ? "Sending..." : "Send to Client"}
      </button>
    </form>
  );
}

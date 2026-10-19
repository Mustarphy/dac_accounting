"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { createAccountingRequest } from "@/lib/client/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { SERVICE_TYPE_LABELS } from "@/lib/client/format";
import type { ServiceType } from "@/lib/client/types";

const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS) as [ServiceType, string][];

type Status = "idle" | "loading" | "unavailable" | "error";

export default function NewRequestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("bookkeeping");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoading = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    if (!title.trim()) {
      setFieldError("Please enter a title for your request.");
      return;
    }
    setFieldError(null);

    setStatus("loading");
    try {
      const { request } = await createAccountingRequest({
        title: title.trim(),
        description: description.trim() || undefined,
        serviceType,
      });
      router.push(`/portal/requests/${request.id}`);
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : "We couldn't submit your request. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-xl flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-ink">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
          placeholder="e.g. Quarterly bookkeeping review"
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
        />
        {fieldError && (
          <p role="alert" className="mt-1.5 text-sm text-red-600">
            {fieldError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="serviceType" className="mb-2 block text-sm font-medium text-ink">
          Service
        </label>
        <select
          id="serviceType"
          name="serviceType"
          value={serviceType}
          onChange={(event) => setServiceType(event.target.value as ServiceType)}
          disabled={isLoading}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
        >
          {SERVICE_TYPE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-ink">
          Description <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isLoading}
          placeholder="Any details that will help OAC Accounting get started."
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
        />
      </div>

      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Submitting requests isn&apos;t available yet. Please check back soon.
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isLoading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}

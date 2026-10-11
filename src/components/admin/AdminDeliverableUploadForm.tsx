"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { publishDeliverable } from "@/lib/staff/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { formatBytes } from "@/lib/client/format";
import type { RequestDocumentItem } from "@/lib/client/types";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv";

type Status = "idle" | "uploading" | "unavailable" | "error";

export default function AdminDeliverableUploadForm({
  requestId,
  onPublished,
}: {
  requestId: string;
  onPublished: (document: RequestDocumentItem) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isUploading = status === "uploading";

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_SIZE_BYTES) {
      setFieldError(`That file is ${formatBytes(selected.size)} — the maximum is 10 MB.`);
      setFile(null);
      return;
    }
    setFieldError(null);
    setFile(selected);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isUploading) return;

    if (!file) {
      setFieldError("Please choose a file to publish.");
      return;
    }
    setFieldError(null);

    setStatus("uploading");
    try {
      const { document } = await publishDeliverable(requestId, file);
      onPublished(document);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus("idle");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : "Publish failed. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <div>
        <label htmlFor="deliverable-file" className="mb-2 block text-sm font-medium text-ink">
          Final deliverable file
        </label>
        <input
          ref={fileInputRef}
          id="deliverable-file"
          name="file"
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleFileChange}
          disabled={isUploading}
          className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-ink outline-none transition-colors file:mr-3 file:rounded file:border-0 file:bg-primary-light file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary focus:border-primary disabled:bg-slate-50"
        />
        <p className="mt-1.5 text-xs text-muted">
          PDF, JPG, PNG, Word, Excel or CSV — up to 10 MB. The client will be notified and can download it immediately.
        </p>
      </div>

      {fieldError && (
        <p role="alert" className="text-sm text-red-600">
          {fieldError}
        </p>
      )}

      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Publishing deliverables isn&apos;t available yet.
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
        disabled={isUploading}
        className="inline-flex items-center justify-center gap-2 self-start rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="size-4" aria-hidden="true" />
        )}
        {isUploading ? "Publishing..." : "Publish Deliverable"}
      </button>
    </form>
  );
}

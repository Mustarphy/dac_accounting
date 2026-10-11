"use client";

import { useState } from "react";
import { AlertCircle, Download, FileText, Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import { downloadStaffDocument, reviewDocument } from "@/lib/staff/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { DOCUMENT_CATEGORY_LABELS, formatDate } from "@/lib/client/format";
import type { DocumentReviewStatus, RequestDocumentItem } from "@/lib/client/types";

export default function AdminDocumentTable({
  documents,
  onReviewed,
}: {
  documents: RequestDocumentItem[];
  onReviewed: (document: RequestDocumentItem) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Documents</caption>
        <thead className="border-b border-slate-200 text-xs text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Document</th>
            <th scope="col" className="px-4 py-3 font-medium">Category</th>
            <th scope="col" className="px-4 py-3 font-medium">Source</th>
            <th scope="col" className="px-4 py-3 font-medium">Review</th>
            <th scope="col" className="px-4 py-3 font-medium">Date</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((document) => (
            <DocumentRow key={document.id} document={document} onReviewed={onReviewed} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentRow({
  document,
  onReviewed,
}: {
  document: RequestDocumentItem;
  onReviewed: (document: RequestDocumentItem) => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const canReview = document.source === "client" && !document.reviewStatus;

  async function handleDownload() {
    setIsDownloading(true);
    try {
      await downloadStaffDocument(document.id, document.filename);
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleReview(status: DocumentReviewStatus) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setUnavailable(false);
    try {
      const { document: updated } = await reviewDocument(document.id, status, notes.trim() || undefined);
      onReviewed(updated);
      setIsReviewOpen(false);
      setNotes("");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setUnavailable(true);
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : "Couldn't submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <tr>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="size-4 shrink-0 text-muted" aria-hidden="true" />
            <span className="font-medium text-ink">{document.filename}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-muted">{DOCUMENT_CATEGORY_LABELS[document.category]}</td>
        <td className="px-4 py-3">
          <span
            className={
              document.source === "dac"
                ? "rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary"
                : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-ink"
            }
          >
            {document.source === "dac" ? "DAC deliverable" : "Client upload"}
          </span>
        </td>
        <td className="px-4 py-3">
          {document.reviewStatus ? (
            <span
              className={
                document.reviewStatus === "approved"
                  ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800"
                  : "rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700"
              }
            >
              {document.reviewStatus === "approved" ? "Approved" : "Rejected"}
            </span>
          ) : document.source === "client" ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
              Needs review
            </span>
          ) : (
            <span className="text-xs text-muted">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-muted">{formatDate(document.createdAt)}</td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-3">
            {canReview && (
              <button
                type="button"
                onClick={() => setIsReviewOpen((prev) => !prev)}
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                Review
              </button>
            )}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              aria-label={`Download ${document.filename}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark disabled:opacity-60"
            >
              {isDownloading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="size-4" aria-hidden="true" />
              )}
              Download
            </button>
          </div>
        </td>
      </tr>

      {isReviewOpen && canReview && (
        <tr>
          <td colSpan={6} className="bg-slate-50 px-4 py-4">
            <div className="flex flex-col gap-3">
              <label htmlFor={`review-notes-${document.id}`} className="text-sm font-medium text-ink">
                Review notes (shown to the client, especially important when rejecting)
              </label>
              <textarea
                id={`review-notes-${document.id}`}
                rows={2}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={isSubmitting}
                placeholder="E.g. this receipt is missing a date — please re-upload."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-100"
              />

              {unavailable && (
                <p role="alert" className="flex items-center gap-1.5 text-xs text-muted">
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  Document review isn&apos;t available yet.
                </p>
              )}
              {errorMessage && (
                <p role="alert" className="flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  {errorMessage}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleReview("approved")}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <ThumbsUp className="size-4" aria-hidden="true" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleReview("rejected")}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <ThumbsDown className="size-4" aria-hidden="true" />
                  Reject
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

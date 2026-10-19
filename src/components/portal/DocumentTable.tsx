"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { downloadDocument } from "@/lib/client/api";
import { DOCUMENT_CATEGORY_LABELS, formatBytes, formatDate, formatDateTime } from "@/lib/client/format";
import type { RequestDocumentItem } from "@/lib/client/types";

export default function DocumentTable({ documents }: { documents: RequestDocumentItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Documents</caption>
        <thead className="border-b border-slate-200 text-xs text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Document
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Category
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Source
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Review
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Size
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Date
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Download</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((document) => (
            <DocumentRow key={document.id} document={document} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentRow({ document }: { document: RequestDocumentItem }) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      await downloadDocument(document.id, document.filename);
    } finally {
      setIsDownloading(false);
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
            {document.source === "dac" ? "From OAC" : "You uploaded"}
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
              {document.reviewStatus === "approved" ? "Approved" : "Needs attention"}
            </span>
          ) : (
            <span className="text-xs text-muted">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-muted">{formatBytes(document.size)}</td>
        <td className="px-4 py-3 text-muted">{formatDate(document.createdAt)}</td>
        <td className="px-4 py-3 text-right">
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
        </td>
      </tr>

      {document.reviewStatus === "rejected" && document.reviewNotes && (
        <tr>
          <td colSpan={7} className="bg-red-50 px-4 py-3">
            <p className="text-sm text-red-800">
              <span className="font-semibold">OAC Accounting needs attention on this document:</span>{" "}
              {document.reviewNotes}
            </p>
            {document.reviewedAt && (
              <p className="mt-0.5 text-xs text-red-700">{formatDateTime(document.reviewedAt)}</p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

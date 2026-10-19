"use client";

import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import { listDocuments } from "@/lib/client/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/client/format";
import type { DocumentCategory, RequestDocumentItem } from "@/lib/client/types";
import DocumentTable from "./DocumentTable";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import { PortalLoading } from "./PortalShell";

type Status = "loading" | "ready" | "unavailable" | "error";

const CATEGORY_FILTERS: { label: string; value: DocumentCategory | "all" }[] = [
  { label: "All", value: "all" },
  ...(Object.entries(DOCUMENT_CATEGORY_LABELS) as [DocumentCategory, string][]).map(([value, label]) => ({
    label,
    value,
  })),
];

export default function DocumentCentre() {
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const [documents, setDocuments] = useState<RequestDocumentItem[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    // Resets the loading indicator when `category` changes and a refetch
    // starts — React's own data-fetching guide uses this exact pattern;
    // the lint rule's concern is about effects that could be avoided
    // entirely, which doesn't apply to a real network refetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");

    listDocuments({ category: category === "all" ? undefined : category })
      .then((data) => {
        if (cancelled) return;
        setDocuments(data.documents);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(error instanceof ApiNotConfiguredError ? "unavailable" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Document Centre</h1>
        <p className="mt-1 text-sm text-muted">
          Everything you&apos;ve submitted and everything OAC Accounting has issued back to you, in one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setCategory(filter.value)}
            className={
              category === filter.value
                ? "rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white"
                : "rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink hover:border-primary hover:text-primary"
            }
          >
            {filter.label}
          </button>
        ))}
      </div>

      {status === "loading" && <PortalLoading />}
      {status === "unavailable" && <ErrorState message="The Document Centre isn't available yet. Please check back soon." />}
      {status === "error" && <ErrorState message="We couldn't load your documents. Please try again." />}

      {status === "ready" && documents.length === 0 && (
        <EmptyState
          icon={FolderOpen}
          title="No documents yet"
          description="Documents you upload to a request, and files OAC Accounting sends back, will appear here."
        />
      )}

      {status === "ready" && documents.length > 0 && <DocumentTable documents={documents} />}
    </div>
  );
}

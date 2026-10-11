import type { ActivityAction, DocumentCategory, RequestStatus, ServiceType } from "./types";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  bookkeeping: "Bookkeeping",
  tax_filing: "Tax Filing",
  payroll: "Payroll",
  financial_statements: "Financial Statements",
  audit_support: "Audit Support",
  other: "Other",
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  opened: "Opened",
  ongoing: "Ongoing",
  concluded: "Concluded",
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  invoice: "Invoice",
  receipt: "Receipt",
  bank_statement: "Bank Statement",
  supporting: "Supporting Document",
  deliverable: "Deliverable",
  other: "Other",
};

export const ACTIVITY_ACTION_LABELS: Record<ActivityAction, string> = {
  request_created: "Request created",
  status_changed: "Status changed",
  document_uploaded: "Document uploaded",
  document_reviewed: "Document reviewed",
  information_requested: "Information requested",
  information_responded: "Information responded",
  deliverable_added: "Deliverable added",
};

/**
 * Mirrors the backend's App\Http\Resources\Client\* resources exactly —
 * see dac-accounting-backend/docs/backend-setup.md and the resource
 * classes themselves. Keep these in sync deliberately; a silent mismatch
 * here is exactly what broke /auth/me earlier in this project.
 */

export type RequestStatus = "opened" | "ongoing" | "concluded";

export type ServiceType =
  | "bookkeeping"
  | "tax_filing"
  | "payroll"
  | "financial_statements"
  | "audit_support"
  | "other";

export type DocumentSource = "client" | "dac";

export type DocumentCategory = "invoice" | "receipt" | "bank_statement" | "supporting" | "deliverable" | "other";

export type InformationRequestStatus = "pending" | "responded";

export type NotificationType =
  | "request_submitted"
  | "status_updated"
  | "information_requested"
  | "information_responded"
  | "document_uploaded"
  | "deliverable_available";

export type ActivityAction =
  | "request_created"
  | "status_changed"
  | "document_uploaded"
  | "document_reviewed"
  | "information_requested"
  | "information_responded"
  | "deliverable_added";

export type DocumentReviewStatus = "approved" | "rejected";

export type AccountingRequestSummary = {
  id: string;
  reference: string;
  title: string;
  serviceType: ServiceType;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  concludedAt: string | null;
  pendingInformationRequestCount?: number;
};

export type RequestDocumentItem = {
  id: string;
  accountingRequestId: string;
  source: DocumentSource;
  category: DocumentCategory;
  filename: string;
  mimeType: string;
  size: number;
  uploadedBy?: string;
  /** Client-visible on purpose — a rejected document's notes are the client's only way to know what to fix. */
  reviewStatus: DocumentReviewStatus | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type InformationRequestItem = {
  id: string;
  accountingRequestId: string;
  message: string;
  status: InformationRequestStatus;
  responseMessage: string | null;
  respondedAt: string | null;
  createdAt: string;
};

export type RequestActivityItem = {
  id: string;
  accountingRequestId: string;
  actorType: string;
  actorName: string | null;
  action: ActivityAction;
  description: string;
  createdAt: string;
};

export type AccountingRequestDetail = Omit<AccountingRequestSummary, "pendingInformationRequestCount"> & {
  description: string | null;
  documents: RequestDocumentItem[];
  informationRequests: InformationRequestItem[];
  activity: RequestActivityItem[];
};

export type ClientNotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  accountingRequestId: string | null;
  isRead: boolean;
  createdAt: string;
};

export type Pagination = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type DashboardSummary = {
  counts: {
    opened: number;
    ongoing: number;
    concluded: number;
    awaitingYourAction: number;
  };
  recentRequests: AccountingRequestSummary[];
  recentActivity: RequestActivityItem[];
};

export type CreateAccountingRequestPayload = {
  title: string;
  description?: string;
  serviceType: ServiceType;
};

export type ListAccountingRequestsParams = {
  status?: RequestStatus;
  search?: string;
};

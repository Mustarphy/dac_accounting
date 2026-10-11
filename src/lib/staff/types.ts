/**
 * Mirrors the backend's App\Http\Resources\Staff\* resources. Reuses
 * RequestDocumentItem/InformationRequestItem/RequestActivityItem from
 * ../client/types — same shapes, same backend Resource classes.
 */
import type {
  InformationRequestItem,
  RequestActivityItem,
  RequestDocumentItem,
  RequestStatus,
  ServiceType,
} from "@/lib/client/types";

export type ClientRef = {
  id: string;
  name: string;
  email: string;
};

export type AdminAccountingRequestSummary = {
  id: string;
  reference: string;
  title: string;
  serviceType: ServiceType;
  status: RequestStatus;
  client?: ClientRef;
  pendingInformationRequestCount?: number;
  unreviewedDocumentCount?: number;
  createdAt: string;
  updatedAt: string;
  concludedAt: string | null;
};

export type InternalNoteItem = {
  id: string;
  accountingRequestId: string;
  body: string;
  authorName: string | null;
  createdAt: string;
};

export type AdminAccountingRequestDetail = {
  id: string;
  reference: string;
  title: string;
  description: string | null;
  serviceType: ServiceType;
  status: RequestStatus;
  client?: ClientRef & { emailVerifiedAt: string | null };
  createdAt: string;
  updatedAt: string;
  concludedAt: string | null;
  documents: RequestDocumentItem[];
  informationRequests: InformationRequestItem[];
  internalNotes: InternalNoteItem[];
  activity: RequestActivityItem[];
};

export type ClientSummary = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  requestCount?: number;
};

export type StaffDashboardActivityItem = RequestActivityItem & {
  accountingRequestTitle: string | null;
};

export type StaffDashboardSummary = {
  counts: {
    total: number;
    opened: number;
    ongoing: number;
    concluded: number;
    awaitingClientInformation: number;
    awaitingStaffReview: number;
  };
  recentRequests: AdminAccountingRequestSummary[];
  recentActivity: StaffDashboardActivityItem[];
};

export type ListAdminRequestsParams = {
  status?: RequestStatus;
  clientId?: string;
  search?: string;
  needsAttention?: boolean;
};

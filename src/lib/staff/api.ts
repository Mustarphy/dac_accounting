import { apiRequest, downloadFile } from "@/lib/api/client";
import type {
  DocumentReviewStatus,
  InformationRequestItem,
  Pagination,
  RequestDocumentItem,
  RequestStatus,
} from "@/lib/client/types";
import { STAFF_ENDPOINTS } from "./endpoints";
import type {
  AdminAccountingRequestDetail,
  AdminAccountingRequestSummary,
  ClientSummary,
  InternalNoteItem,
  ListAdminRequestsParams,
  StaffDashboardSummary,
} from "./types";

export function getStaffDashboardSummary() {
  return apiRequest<StaffDashboardSummary>(STAFF_ENDPOINTS.dashboard, { method: "GET" });
}

export function listClients(params: { search?: string } = {}) {
  const qs = params.search ? `?search=${encodeURIComponent(params.search)}` : "";
  return apiRequest<{ clients: ClientSummary[]; pagination: Pagination }>(`${STAFF_ENDPOINTS.clients}${qs}`, {
    method: "GET",
  });
}

export function getClient(id: string) {
  return apiRequest<{ client: ClientSummary; requests: AdminAccountingRequestSummary[] }>(
    STAFF_ENDPOINTS.client(id),
    { method: "GET" }
  );
}

export function listAdminRequests(params: ListAdminRequestsParams = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.clientId) query.set("clientId", params.clientId);
  if (params.search) query.set("search", params.search);
  if (params.needsAttention) query.set("needsAttention", "1");
  const qs = query.toString();

  return apiRequest<{ requests: AdminAccountingRequestSummary[]; pagination: Pagination }>(
    `${STAFF_ENDPOINTS.requests}${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export function getAdminRequest(id: string) {
  return apiRequest<{ request: AdminAccountingRequestDetail }>(STAFF_ENDPOINTS.request(id), { method: "GET" });
}

export function updateRequestStatus(id: string, status: RequestStatus) {
  return apiRequest<{ request: AdminAccountingRequestSummary }>(STAFF_ENDPOINTS.requestStatus(id), {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function createInformationRequest(requestId: string, message: string) {
  return apiRequest<{ informationRequest: InformationRequestItem }>(
    STAFF_ENDPOINTS.requestInformationRequests(requestId),
    { method: "POST", body: JSON.stringify({ message }) }
  );
}

export function addInternalNote(requestId: string, body: string) {
  return apiRequest<{ note: InternalNoteItem }>(STAFF_ENDPOINTS.requestNotes(requestId), {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function publishDeliverable(requestId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<{ document: RequestDocumentItem }>(STAFF_ENDPOINTS.requestDeliverables(requestId), {
    method: "POST",
    body: formData,
  });
}

export function downloadStaffDocument(id: string, filename: string) {
  return downloadFile(STAFF_ENDPOINTS.documentDownload(id), filename);
}

export function reviewDocument(documentId: string, status: DocumentReviewStatus, notes?: string) {
  return apiRequest<{ document: RequestDocumentItem }>(STAFF_ENDPOINTS.documentReview(documentId), {
    method: "POST",
    body: JSON.stringify({ status, notes }),
  });
}

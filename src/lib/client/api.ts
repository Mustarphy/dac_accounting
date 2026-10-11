import { apiRequest, downloadFile } from "@/lib/api/client";
import { CLIENT_ENDPOINTS } from "./endpoints";
import type {
  AccountingRequestDetail,
  AccountingRequestSummary,
  ClientNotificationItem,
  CreateAccountingRequestPayload,
  DashboardSummary,
  DocumentCategory,
  InformationRequestItem,
  ListAccountingRequestsParams,
  Pagination,
  RequestDocumentItem,
} from "./types";

export function getDashboardSummary() {
  return apiRequest<DashboardSummary>(CLIENT_ENDPOINTS.dashboard, { method: "GET" });
}

export function listAccountingRequests(params: ListAccountingRequestsParams = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  const qs = query.toString();

  return apiRequest<{ requests: AccountingRequestSummary[]; pagination: Pagination }>(
    `${CLIENT_ENDPOINTS.requests}${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export function createAccountingRequest(payload: CreateAccountingRequestPayload) {
  return apiRequest<{ request: AccountingRequestSummary }>(CLIENT_ENDPOINTS.requests, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAccountingRequest(id: string) {
  return apiRequest<{ request: AccountingRequestDetail }>(CLIENT_ENDPOINTS.request(id), { method: "GET" });
}

export function uploadDocument(requestId: string, file: File, category: DocumentCategory) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  return apiRequest<{ document: RequestDocumentItem }>(CLIENT_ENDPOINTS.requestDocuments(requestId), {
    method: "POST",
    body: formData,
  });
}

export function listDocuments(params: { category?: DocumentCategory; requestId?: string } = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.requestId) query.set("requestId", params.requestId);
  const qs = query.toString();

  return apiRequest<{ documents: RequestDocumentItem[]; pagination: Pagination }>(
    `${CLIENT_ENDPOINTS.documents}${qs ? `?${qs}` : ""}`,
    { method: "GET" }
  );
}

export function downloadDocument(id: string, filename: string) {
  return downloadFile(CLIENT_ENDPOINTS.documentDownload(id), filename);
}

export function listInformationRequests(status?: "pending" | "responded") {
  const qs = status ? `?status=${status}` : "";
  return apiRequest<{ informationRequests: InformationRequestItem[] }>(
    `${CLIENT_ENDPOINTS.informationRequests}${qs}`,
    { method: "GET" }
  );
}

export function respondToInformationRequest(id: string, message: string) {
  return apiRequest<{ informationRequest: InformationRequestItem }>(
    CLIENT_ENDPOINTS.respondToInformationRequest(id),
    { method: "POST", body: JSON.stringify({ message }) }
  );
}

export function listNotifications(unreadOnly = false) {
  const qs = unreadOnly ? "?unreadOnly=1" : "";
  return apiRequest<{ notifications: ClientNotificationItem[]; unreadCount: number; pagination: Pagination }>(
    `${CLIENT_ENDPOINTS.notifications}${qs}`,
    { method: "GET" }
  );
}

export function markNotificationRead(id: string) {
  return apiRequest<{ notification: ClientNotificationItem }>(CLIENT_ENDPOINTS.markNotificationRead(id), {
    method: "POST",
  });
}

export function markAllNotificationsRead() {
  return apiRequest<null>(CLIENT_ENDPOINTS.markAllNotificationsRead, { method: "POST" });
}

export function updateProfile(name: string) {
  return apiRequest<{ user: { id: string; name: string; email: string; emailVerifiedAt: string | null } }>(
    CLIENT_ENDPOINTS.account,
    { method: "PATCH", body: JSON.stringify({ name }) }
  );
}

export function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}) {
  return apiRequest<null>(CLIENT_ENDPOINTS.changePassword, { method: "POST", body: JSON.stringify(payload) });
}

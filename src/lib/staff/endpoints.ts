export const STAFF_ENDPOINTS = {
  dashboard: "/staff/dashboard",
  clients: "/staff/clients",
  client: (id: string) => `/staff/clients/${id}`,
  requests: "/staff/requests",
  request: (id: string) => `/staff/requests/${id}`,
  requestStatus: (id: string) => `/staff/requests/${id}/status`,
  requestInformationRequests: (id: string) => `/staff/requests/${id}/information-requests`,
  requestNotes: (id: string) => `/staff/requests/${id}/notes`,
  requestDeliverables: (id: string) => `/staff/requests/${id}/deliverables`,
  documentDownload: (id: string) => `/staff/documents/${id}/download`,
  documentReview: (id: string) => `/staff/documents/${id}/review`,
} as const;

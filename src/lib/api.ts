import { apiRequest } from "@/lib/api/client";

export { ApiNotConfiguredError } from "@/lib/api/client";

export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export function submitContactForm(payload: ContactFormPayload) {
  return apiRequest<{ success: boolean }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

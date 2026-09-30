"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { ApiNotConfiguredError, submitContactForm } from "@/lib/api";

type FormFields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

type Status = "idle" | "loading" | "success" | "unavailable" | "error";

const initialFields: FormFields = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) errors.name = "Please enter your full name.";
  if (!fields.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!emailPattern.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.subject.trim()) errors.subject = "Please enter a subject.";
  if (!fields.message.trim()) errors.message = "Please enter a message.";

  return errors;
}

export default function ContactForm() {
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const isLoading = status === "loading";

  function handleChange(field: keyof FormFields) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("loading");
    try {
      await submitContactForm({
        name: fields.name,
        email: fields.email,
        phone: fields.phone || undefined,
        subject: fields.subject,
        message: fields.message,
      });
      setStatus("success");
      setFields(initialFields);
    } catch (error) {
      setStatus(error instanceof ApiNotConfiguredError ? "unavailable" : "error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-primary-light p-8 text-center"
      >
        <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-ink">Message sent</h3>
        <p className="text-sm text-muted">
          Thanks for reaching out — the DAC Accounting team will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Full Name"
          value={fields.name}
          onChange={handleChange("name")}
          error={errors.name}
          disabled={isLoading}
          autoComplete="name"
          required
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={fields.email}
          onChange={handleChange("email")}
          error={errors.email}
          disabled={isLoading}
          autoComplete="email"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="phone"
          label="Phone (optional)"
          type="tel"
          value={fields.phone}
          onChange={handleChange("phone")}
          disabled={isLoading}
          autoComplete="tel"
        />
        <Field
          id="subject"
          label="Subject"
          value={fields.subject}
          onChange={handleChange("subject")}
          error={errors.subject}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={handleChange("message")}
          disabled={isLoading}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-sm text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {status === "unavailable" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          Online submissions aren&apos;t available yet. Please reach us using the
          contact details on this page.
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Something went wrong sending your message. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isLoading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
};

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  disabled,
  required,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-50"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

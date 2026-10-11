"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2, StickyNote } from "lucide-react";
import { addInternalNote } from "@/lib/staff/api";
import { ApiError, ApiNotConfiguredError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/client/format";
import type { InternalNoteItem } from "@/lib/staff/types";

type Status = "idle" | "loading" | "unavailable" | "error";

/**
 * Staff-only — the backend never includes internal_notes in any
 * client-facing resource (see InternalNoteResource.php), so this panel
 * only ever renders on /admin pages.
 */
export default function AdminInternalNotes({
  requestId,
  notes,
  onCreated,
}: {
  requestId: string;
  notes: InternalNoteItem[];
  onCreated: (note: InternalNoteItem) => void;
}) {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoading = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !body.trim()) return;

    setStatus("loading");
    try {
      const { note } = await addInternalNote(requestId, body.trim());
      onCreated(note);
      setBody("");
      setStatus("idle");
    } catch (error) {
      if (error instanceof ApiNotConfiguredError) {
        setStatus("unavailable");
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : "Couldn't save the note. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50/40 p-5">
      <div className="flex items-center gap-2">
        <StickyNote className="size-4 text-amber-700" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-ink">Internal notes</h3>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
          Staff only — never visible to the client
        </span>
      </div>

      {notes.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-md bg-white p-3 text-sm">
              <p className="text-ink">{note.body}</p>
              <p className="mt-1 text-xs text-muted">
                {note.authorName ?? "Unknown"} · {formatDateTime(note.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No internal notes yet.</p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <label htmlFor="new-internal-note" className="sr-only">
          Add an internal note
        </label>
        <textarea
          id="new-internal-note"
          rows={2}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          disabled={isLoading}
          placeholder="Add a note visible only to staff…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-primary disabled:bg-slate-100"
        />

        {status === "unavailable" && (
          <p role="alert" className="flex items-center gap-1.5 text-xs text-muted">
            <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
            Internal notes aren&apos;t available yet.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !body.trim()}
          className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-amber-400 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
          {isLoading ? "Saving..." : "Add Note"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { listClients } from "@/lib/staff/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import { formatDate } from "@/lib/client/format";
import type { ClientSummary } from "@/lib/staff/types";
import EmptyState from "@/components/portal/EmptyState";
import ErrorState from "@/components/portal/ErrorState";
import { AdminLoading } from "./AdminShell";

type Status = "loading" | "ready" | "unavailable" | "error";

export default function AdminClientsList() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    // Resetting loading state before a dependency-triggered refetch — same
    // documented pattern used throughout the client portal.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");

    listClients({ search: appliedSearch || undefined })
      .then((data) => {
        if (cancelled) return;
        setClients(data.clients);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(error instanceof ApiNotConfiguredError ? "unavailable" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [appliedSearch]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedSearch(search.trim());
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Clients</h1>
          <p className="mt-1 text-sm text-muted">Every registered client across the portal.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email…"
            aria-label="Search clients"
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
        </form>
      </div>

      {status === "loading" && <AdminLoading />}
      {status === "unavailable" && <ErrorState message="Clients aren't available yet. Please check back soon." />}
      {status === "error" && <ErrorState message="We couldn't load clients. Please try again." />}

      {status === "ready" && clients.length === 0 && (
        <EmptyState
          icon={Users}
          title={appliedSearch ? "No matching clients" : "No clients yet"}
          description={
            appliedSearch ? "Try a different search term." : "Clients will show up here once they register."
          }
        />
      )}

      {status === "ready" && clients.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-200">
            {clients.map((client) => (
              <li key={client.id}>
                <Link
                  href={`/admin/clients/${client.id}`}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{client.name}</p>
                    <p className="text-xs text-muted">
                      {client.email} · Joined {formatDate(client.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-ink">
                    {client.requestCount ?? 0} {client.requestCount === 1 ? "request" : "requests"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

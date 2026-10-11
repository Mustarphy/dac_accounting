"use client";

import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Simpler than the client Topbar on purpose — there's no notification
 * bell because nothing in this phase sends notifications TO staff;
 * NotificationDispatcher only ever targets the client on a request.
 */
export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="text-ink lg:hidden"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>

      <div className="hidden sm:block" />

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </span>
          <span className="text-sm font-medium text-ink">{user?.name}</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
            {user?.role}
          </span>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          aria-label="Sign out"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

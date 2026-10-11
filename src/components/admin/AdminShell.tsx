"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import RequireStaff from "@/components/admin/RequireStaff";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

/**
 * The authenticated admin panel's persistent frame — sidebar + topbar,
 * used by every /admin/* page. Mirrors PortalShell's structure. Role
 * gating (RequireStaff) happens inside; the real boundary is the
 * backend's `role:admin,staff` middleware, not this component.
 */
export default function AdminShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RequireStaff>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
          <AdminTopbar onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </RequireStaff>
  );
}

export function AdminLoading() {
  return (
    <div role="status" className="flex flex-1 items-center justify-center py-24">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

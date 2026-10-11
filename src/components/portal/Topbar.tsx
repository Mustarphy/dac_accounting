"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listNotifications } from "@/lib/client/api";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    listNotifications()
      .then((data) => {
        if (!cancelled) setUnreadCount(data.unreadCount);
      })
      .catch(() => {
        if (!cancelled) setUnreadCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
        <Link
          href="/portal/notifications"
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="relative text-muted hover:text-primary"
        >
          <Bell className="size-5" aria-hidden="true" />
          {Boolean(unreadCount) && (
            <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
              {unreadCount! > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </span>
          <span className="text-sm font-medium text-ink">{user?.name}</span>
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

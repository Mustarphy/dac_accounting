"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/client/api";
import { ApiNotConfiguredError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/client/format";
import type { ClientNotificationItem } from "@/lib/client/types";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import { PortalLoading } from "./PortalShell";

type Status = "loading" | "ready" | "unavailable" | "error";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<ClientNotificationItem[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    listNotifications()
      .then((data) => {
        if (cancelled) return;
        setNotifications(data.notifications);
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus(error instanceof ApiNotConfiguredError ? "unavailable" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleMarkRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await markNotificationRead(id);
    } catch {
      // Non-critical — the notification will still show as read on next refresh attempt.
    }
  }

  async function handleMarkAllRead() {
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      setNotifications(previous);
    }
  }

  if (status === "loading") return <PortalLoading />;
  if (status === "unavailable") {
    return <ErrorState message="Notifications aren't available yet. Please check back soon." />;
  }
  if (status === "error") {
    return <ErrorState message="We couldn't load your notifications. Please try again." />;
  }

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Notifications</h1>
          <p className="mt-1 text-sm text-muted">Updates on your requests, documents and information needed.</p>
        </div>
        {hasUnread && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="self-start rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-ink hover:border-primary hover:text-primary"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="You'll be notified here about updates to your requests." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={notification.isRead ? "px-5 py-4" : "bg-primary-light/40 px-5 py-4"}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{notification.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{notification.body}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted">
                      <span>{formatDateTime(notification.createdAt)}</span>
                      {notification.accountingRequestId && (
                        <Link
                          href={`/portal/requests/${notification.accountingRequestId}`}
                          className="font-medium text-primary hover:text-primary-dark"
                        >
                          View request →
                        </Link>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(notification.id)}
                      className="shrink-0 text-xs font-medium text-primary hover:text-primary-dark"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

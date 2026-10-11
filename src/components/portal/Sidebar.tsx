"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { portalNavItems } from "./nav-items";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/portal" className="text-lg font-bold tracking-tight text-ink">
            {siteConfig.name}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="text-muted hover:text-ink lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Portal" className="flex-1 overflow-y-auto px-3 pb-6">
          <ul className="flex flex-col gap-1">
            {portalNavItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-primary-light text-primary" : "text-ink hover:bg-slate-100"
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-200 px-6 py-4">
          <Link href="/" className="text-xs text-muted hover:text-primary">
            ← Back to main site
          </Link>
        </div>
      </aside>
    </>
  );
}

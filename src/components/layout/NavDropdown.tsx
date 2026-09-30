"use client";

import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "@/lib/site-config";

/**
 * Desktop nav dropdown for an item with children (e.g. Knowledge). Built
 * as a "disclosure" — a toggle button plus a plain list of links — rather
 * than a full ARIA `menu` widget: menu/menuitem semantics expect
 * roving-tabindex arrow-key navigation meant for app-style menus, which
 * is more than a handful of site nav links need and is easy to get
 * wrong. Tab still moves through the links naturally once open; Escape
 * and outside-click close it.
 */
export default function NavDropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  function openNow() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(true);
  }

  function closeSoon() {
    closeTimeout.current = setTimeout(() => setIsOpen(false), 150);
  }

  function closeNow() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeNow();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeNow();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      closeNow();
    }
  }

  if (!item.children?.length) {
    return (
      <Link href={item.href} className="text-sm font-medium text-ink transition-colors hover:text-primary">
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon} onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => (isOpen ? closeNow() : openNow())}
        className="flex items-center gap-1 text-sm font-medium text-ink transition-colors hover:text-primary"
      >
        {item.label}
        <ChevronDown
          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={menuId}
          className="absolute left-0 top-full z-10 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg"
        >
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={closeNow}
                className="block px-4 py-2.5 text-sm text-ink transition-colors hover:bg-primary-light hover:text-primary"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

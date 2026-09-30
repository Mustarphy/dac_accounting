"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import NavDropdown from "@/components/layout/NavDropdown";
import { loginNav, mainNav, siteConfig } from "@/lib/site-config";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMobileHref, setExpandedMobileHref] = useState<string | null>(null);
  const { status, logout } = useAuth();
  const isAuthed = status === "authenticated" || status === "unverified";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container as="nav" aria-label="Primary" className="flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink">
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {mainNav.map((item) => (
            <li key={item.href}>
              <NavDropdown item={item} />
            </li>
          ))}
        </ul>

        {isAuthed ? (
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/portal"
              className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Portal
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href={loginNav.href}
            className="hidden rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white md:inline-flex"
          >
            {loginNav.label}
          </Link>
        )}

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-md p-2 text-ink md:hidden"
        >
          {isMenuOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </Container>

      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {mainNav.map((item) => {
              if (!item.children?.length) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-md px-2 py-3 text-base font-medium text-ink transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const isExpanded = expandedMobileHref === item.href;
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`mobile-submenu-${item.href}`}
                    onClick={() => setExpandedMobileHref(isExpanded ? null : item.href)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-3 text-base font-medium text-ink transition-colors hover:text-primary"
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isExpanded && (
                    <ul id={`mobile-submenu-${item.href}`} className="ml-2 flex flex-col gap-1 border-l border-slate-200 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setExpandedMobileHref(null);
                            }}
                            className="block rounded-md px-2 py-2.5 text-sm text-muted transition-colors hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li className="pt-2">
              {isAuthed ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/portal"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-md border border-primary px-4 py-3 text-center text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Portal
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="block w-full rounded-md px-4 py-3 text-center text-base font-medium text-ink transition-colors hover:text-primary"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href={loginNav.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-md border border-primary px-4 py-3 text-center text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {loginNav.label}
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

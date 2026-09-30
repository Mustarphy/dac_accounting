import Link from "next/link";
import Container from "@/components/ui/Container";
import { loginNav, mainNav, siteConfig } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="text-lg font-bold tracking-tight text-ink">{siteConfig.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{siteConfig.tagline}</p>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <div>
            <h3 className="text-sm font-semibold text-ink">Navigation</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Contact</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <li>{siteConfig.email}</li>
              <li>{siteConfig.phone}</li>
              <li>{siteConfig.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Client Area</h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href={loginNav.href}
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  {loginNav.label}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-slate-200">
        <Container className="py-6">
          <p className="text-sm text-muted">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}

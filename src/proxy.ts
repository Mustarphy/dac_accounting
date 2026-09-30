import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Optimistic route protection only. This checks whether Laravel's
 * refresh-token cookie is PRESENT, not whether it's still valid — Proxy
 * can't verify the token without the signing secret, and shouldn't try
 * to. The portal itself performs the real check (a silent refresh against
 * Laravel) on load, and Laravel is the final authority on every API
 * request regardless of what happens here.
 *
 * This only works if Laravel sets the cookie's Domain to the shared
 * parent domain (e.g. `.dacaccounting.com`) so it's visible to requests
 * made to the frontend's own origin. See docs/auth-api-contract.md.
 */
const REFRESH_TOKEN_COOKIE = "dac_refresh_token";

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(REFRESH_TOKEN_COOKIE);

  if (!hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};

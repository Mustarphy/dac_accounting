# DAC Accounting — Auth API Contract

**Status: Frontend contract — Laravel implementation pending.** The frontend
in this repo (`src/lib/auth/`, `src/app/{login,signup,forgot-password,reset-password,verify-email,portal}`)
is built against this contract but has never talked to a real backend. Every
endpoint below is a proposal the Laravel API must satisfy, not a description
of something that already works. Where this doc and the frontend TypeScript
types (`src/lib/auth/types.ts`) disagree, the types are the source of truth —
this file only exists to explain the parts types can't (HTTP status codes,
cookies, CORS, CSRF).

## 1. Architecture at a glance

```
Access token   → short-lived JWT → kept in memory in the browser tab only
                                     (never localStorage/sessionStorage)
Refresh token  → long-lived, opaque or JWT → HttpOnly + Secure + SameSite
                                     cookie, set directly by Laravel
                                     JavaScript never reads or holds it
```

- The frontend attaches the access token as `Authorization: Bearer <token>`
  on requests that need it.
- The frontend never decides a user is authenticated because a JWT merely
  exists client-side. `GET /auth/me` and every protected endpoint are what
  actually authorize a request; the frontend's `AuthProvider` state
  (`src/lib/auth/AuthContext.tsx`) is a UI convenience derived from those
  responses, not a security boundary.
- `src/proxy.ts` (Next.js 16's replacement for `middleware.ts`) does an
  **optimistic** redirect based on whether the refresh cookie is present —
  it cannot verify the cookie's contents without the signing secret, and
  doesn't try to. Laravel remains the only real authority.

## 2. Cookie requirements (load-bearing — read this before implementing)

The frontend's optimistic route protection (`src/proxy.ts`) reads the
refresh-token cookie's presence directly from the incoming request on the
**Next.js server**, not from Laravel. For that to work:

- **Cookie name:** `dac_refresh_token` (keep this in sync with
  `REFRESH_TOKEN_COOKIE` in `src/proxy.ts` if it changes).
- **Domain:** frontend and API must share a registrable domain, e.g.
  `app.dacaccounting.com` (frontend) and `api.dacaccounting.com` (API), with
  the cookie's `Domain` attribute set to the shared parent
  (`.dacaccounting.com`). This makes it a same-site cookie, not a
  third-party one — it will be sent on requests to both subdomains and isn't
  subject to third-party-cookie blocking.
- **If the frontend and API cannot share a parent domain** (e.g. the API is
  hosted somewhere entirely unrelated), this architecture needs to change:
  either front the API with a Next.js Route Handler proxy (the
  ["Backend for Frontend"](https://nextjs.org/docs/app/guides/backend-for-frontend)
  pattern) so the cookie is set on the frontend's own origin, or drop the
  optimistic proxy check and rely solely on the client-side check in
  `RequireAuth`. Flag this to the frontend team before building the API if
  it applies — it changes several files.
- **Attributes:** `HttpOnly; Secure; SameSite=Lax; Path=/` at minimum.
  `SameSite=Strict` is preferable if it doesn't break the post-login
  redirect flow (it shouldn't, since login is same-site). Never
  `SameSite=None` — that pattern is for genuinely cross-site embedding,
  which doesn't apply here and would need extra CSRF defenses this doc
  doesn't cover.
- **Lifetime:** backend's call — see §3 on "remember me".
- **Set on:** `POST /auth/login`, `POST /auth/register` (success responses),
  refreshed on `POST /auth/refresh`, cleared on `POST /auth/logout`.

## 3. "Remember me"

`POST /auth/login` accepts an optional `rememberMe: boolean`. The frontend
has no opinion on what this should do — it's included so Laravel can extend
the refresh-token cookie's `Max-Age`/`Expires` when true (e.g. 30 days vs.
a session cookie or short default) instead of the frontend needing any
persistent client-side storage.

## 4. CORS

Laravel must allow the frontend's exact origin(s) with credentials enabled:

```
Access-Control-Allow-Origin: https://app.dacaccounting.com   (exact match, never *)
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

`Access-Control-Allow-Origin: *` cannot be combined with credentials per the
CORS spec, and doing so would let any site read authenticated responses —
never set both.

## 5. CSRF

Because the only thing that rides passively on a cookie is the refresh
token, and every response is same-origin-protected by the CORS policy in §4
(a cross-site page can trigger a request but cannot read the JSON response),
the practical CSRF exposure here is narrow: a malicious site could cause a
logged-in user's browser to POST to `/auth/refresh` or `/auth/logout`
without being able to see the result. That's a nuisance (forced logout,
forced token rotation), not a data leak — but Laravel should still add
defense in depth on state-changing auth endpoints (`login`, `logout`,
`refresh`, `register`, `password/reset`):

- Require a custom header the frontend already sends on every request
  it controls, e.g. reject requests missing
  `Content-Type: application/json` or a custom `X-Requested-With` header —
  simple cross-site `<form>` submissions can't set either without triggering
  a CORS preflight, which the strict origin allowlist in §4 will reject.
- Do not implement Laravel's default session-cookie CSRF middleware for
  these endpoints — that assumes a Laravel-rendered SPA session cookie,
  which doesn't apply here (this is a stateless Bearer-token API plus one
  purpose-built refresh cookie).

## 6. Rate limiting

Laravel should throttle at minimum: `login`, `register`, `password/forgot`,
`email/resend`, `refresh`. The frontend disables its submit buttons during
a request as basic UX throttling, but that is not a security control —
Laravel's rate limiter is.

## 7. Data model

```ts
type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: string | null; // ISO 8601, or null if unverified
};
```

Return only these fields from auth endpoints — no password hash, no
internal flags, nothing not listed above (see `src/lib/auth/types.ts` for
every request/response shape referenced below).

## 8. Endpoints

All paths are relative to `NEXT_PUBLIC_API_URL` (e.g.
`https://api.dacaccounting.com/api`). All request/response bodies are JSON.
Validation error bodies (422) use `{ message: string, errors: { field:
string[] } }` — the frontend's `ApiError.fieldErrors` expects exactly this
shape.

### `POST /auth/register`
- Body: `{ name, email, password, passwordConfirmation }`
- 201: `{ user: AuthUser, accessToken, accessTokenExpiresAt }` + sets the
  refresh cookie. Registration logs the user in immediately;
  `user.emailVerifiedAt` is `null` until they verify — the frontend treats
  that as a distinct "authenticated but unverified" state and still lets
  them into `/portal` with a banner, rather than blocking them out.
- 422: validation errors (weak password, invalid email, etc.)
- 409: email already registered
- Auth required: no

### `POST /auth/login`
- Body: `{ email, password, rememberMe? }`
- 200: `{ user: AuthUser, accessToken, accessTokenExpiresAt }` + sets the
  refresh cookie
- 401: invalid credentials — return a generic message, don't reveal whether
  the email exists
- 422: malformed request body
- 429: rate-limited
- Auth required: no

### `POST /auth/logout`
- 204 (or 200 with an empty/simple body) on success. Revoke the refresh
  token server-side and clear the cookie (`Set-Cookie` with `Max-Age=0`).
- The frontend calls this best-effort and clears local state regardless of
  the response — if the session was already invalid server-side, that's
  still a successful logout from the user's perspective.
- Auth required: yes (Bearer access token)

### `POST /auth/refresh`
- No body required — the refresh token travels via the HttpOnly cookie.
- 200: `{ accessToken, accessTokenExpiresAt }`. Rotate the refresh token
  (issue a new one, invalidate the old) and re-set the cookie if your
  rotation strategy calls for it.
- 401: refresh token missing, invalid, expired, or revoked
- Auth required: no (the cookie *is* the credential)
- **Called automatically** by the frontend's HTTP client (`src/lib/api/client.ts`)
  whenever any authenticated request gets a 401, and once on app load to
  re-establish a session after a full page reload. Concurrent 401s are
  deduplicated into a single refresh call by the frontend — the endpoint
  doesn't need to handle that, but should be safe to call from multiple
  tabs at once (don't invalidate a refresh token that's mid-rotation from
  another request without a grace window, or you'll log users out of one
  tab by refreshing in another).

### `GET /auth/me`
- 200: `{ user: AuthUser }`
- 401: not authenticated
- Auth required: yes (Bearer access token)

### `POST /auth/password/forgot`
- Body: `{ email }`
- 200 in **all cases**, whether or not the email exists:
  `{ message: string }` — the frontend always shows the same generic "if an
  account exists, we sent instructions" copy regardless of response
  content, specifically to avoid account enumeration. Do not return a
  different status code for "email not found."
- 422: malformed email
- 429: rate-limited
- Auth required: no

### `POST /auth/password/reset`
- Body: `{ email, token, password, passwordConfirmation }`
- 200: `{ message: string }`. Does **not** log the user in — the frontend
  redirects to `/login` after success rather than assuming an authenticated
  session.
- 400 or 422: invalid/expired/already-used token, or password validation
  failure. The frontend treats 400 and 422 the same here (shows "this
  reset link is invalid or has expired").
- Auth required: no
- The reset link Laravel emails to the user should point to
  `{FRONTEND_URL}/reset-password?token=...&email=...` — both query params
  are required by the frontend page.

### `POST /auth/email/verify`
- Body: `{ token }`
- 200: `{ message: string, user: AuthUser }` (with `emailVerifiedAt` now
  set)
- 409: already verified
- 400/404/422: invalid or expired token
- Auth required: no (a user may click the link before ever establishing a
  browser session, e.g. on a different device)
- The verification link Laravel emails should point to
  `{FRONTEND_URL}/verify-email?token=...`.

### `POST /auth/email/resend`
- Body: `{ email }`
- 200: `{ message: string }`
- 429: rate-limited (this is the endpoint most likely to be abused for
  spamming an inbox — throttle aggressively)
- Auth required: yes (Bearer access token) — only a logged-in, unverified
  user can trigger a resend from the portal banner
  (`src/components/auth/EmailVerificationBanner.tsx`)

## 9. Error shape

Non-2xx responses should be JSON: `{ message: string, errors?: Record<string, string[]> }`.
`message` is shown to the user as a fallback in a couple of places, so keep
it human-readable and never include stack traces, SQL, or internal
exception details.

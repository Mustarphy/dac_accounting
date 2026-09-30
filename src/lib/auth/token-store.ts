/**
 * In-memory holder for the short-lived access token. Deliberately not
 * localStorage/sessionStorage — an XSS payload that can execute JS can
 * also read a module variable, but this at least avoids leaving the
 * token behind in persistent storage or devtools' Application tab, and
 * it's cleared on every full page reload (session is then re-established
 * from the HttpOnly refresh cookie via AuthProvider's bootstrap).
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

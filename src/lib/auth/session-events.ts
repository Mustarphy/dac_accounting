/**
 * Lets the API client (which has no React context) notify AuthProvider
 * when a background refresh fails mid-session, so the UI can drop back
 * to "unauthenticated" instead of silently keeping stale state.
 */
type Listener = () => void;

const listeners = new Set<Listener>();

export function onSessionExpired(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitSessionExpired(): void {
  listeners.forEach((listener) => listener());
}

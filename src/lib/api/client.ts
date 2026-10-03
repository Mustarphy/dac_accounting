import { getAccessToken, setAccessToken } from "@/lib/auth/token-store";
import { emitSessionExpired } from "@/lib/auth/session-events";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function isApiConfigured(): boolean {
  return Boolean(API_URL);
}

/**
 * Thrown when NEXT_PUBLIC_API_URL isn't set yet. Callers should catch this
 * separately from real request failures so the UI can show an honest
 * "not available yet" message instead of a generic network error.
 */
export class ApiNotConfiguredError extends Error {
  constructor() {
    super("The API endpoint has not been configured yet.");
    this.name = "ApiNotConfiguredError";
  }
}

export class NetworkError extends Error {
  constructor(cause?: unknown) {
    super("A network error occurred. Please check your connection and try again.");
    this.name = "NetworkError";
    this.cause = cause;
  }
}

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type RequestOptions = RequestInit & {
  /** Attach the in-memory access token and transparently refresh it on 401. Default true. */
  auth?: boolean;
  /** Internal: set on the retry attempt after a refresh so we don't refresh twice. */
  _isRetry?: boolean;
};

async function parseErrorBody(
  response: Response
): Promise<{ message: string; fieldErrors?: Record<string, string[]> }> {
  try {
    const body = await response.json();
    return {
      message: typeof body.message === "string" ? body.message : `Request failed with status ${response.status}`,
      fieldErrors: body.errors,
    };
  } catch {
    return { message: `Request failed with status ${response.status}` };
  }
}

let refreshPromise: Promise<string> | null = null;

/**
 * Calls the refresh endpoint directly (bypassing apiRequest's own 401
 * handling, which would otherwise recurse). The browser attaches the
 * HttpOnly refresh-token cookie automatically; the frontend never reads
 * or holds that token itself.
 */
async function performRefresh(): Promise<string> {
  if (!API_URL) throw new ApiNotConfiguredError();

  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch (cause) {
    throw new NetworkError(cause);
  }

  if (!response.ok) {
    setAccessToken(null);
    emitSessionExpired();
    const { message } = await parseErrorBody(response);
    throw new ApiError(response.status, message);
  }

  // Backend envelope is {success, message, data}; see apiRequest() below.
  const body = await response.json();
  const accessToken = body.data.accessToken as string;
  setAccessToken(accessToken);
  return accessToken;
}

/**
 * Deduplicates concurrent refresh attempts: if five requests hit 401 at
 * once, only one network call to /auth/refresh is made and all five wait
 * on the same promise.
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiNotConfiguredError();
  }

  const { auth = true, _isRetry = false, headers, ...rest } = options;
  const accessToken = auth ? getAccessToken() : null;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });
  } catch (cause) {
    throw new NetworkError(cause);
  }

  if (response.status === 401 && auth && !_isRetry) {
    try {
      await refreshAccessToken();
    } catch (refreshError) {
      if (refreshError instanceof NetworkError || refreshError instanceof ApiNotConfiguredError) {
        throw refreshError;
      }
      throw new ApiError(401, "Your session has expired. Please sign in again.");
    }
    return apiRequest<T>(path, { ...options, _isRetry: true });
  }

  if (!response.ok) {
    const { message, fieldErrors } = await parseErrorBody(response);
    throw new ApiError(response.status, message, fieldErrors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  // Backend returns every success response as {success, message, data} —
  // T describes the shape of `data`, not the whole envelope.
  const body = await response.json();
  return body.data as T;
}

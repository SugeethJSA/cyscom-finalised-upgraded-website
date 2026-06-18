export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Session {
  token: string;
  qrDecryptKey?: string;
  user: { id: string; name: string; email: string; role: "admin" | "volunteer" };
  capabilities?: Record<string, boolean>;
  categoryName?: string | null;
}

export function getSession(slug: string): Session | null {
  const raw = localStorage.getItem(`reg-desk-session-${slug}`);
  return raw ? JSON.parse(raw) as Session : null;
}

export function setSession(slug: string, session: Session | null) {
  if (session) {
    localStorage.setItem(`reg-desk-session-${slug}`, JSON.stringify(session));
  } else {
    localStorage.removeItem(`reg-desk-session-${slug}`);
  }
}

export async function api<T>(slug: string, path: string, options: RequestInit = {}): Promise<T> {
  const session = getSession(slug);
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }
  if (session) {
    headers.set("authorization", `Bearer ${session.token}`);
  }

  // Base path contains the event slug
  const response = await fetch(`${API_BASE}/events/${slug}${path}`, { ...options, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(payload.message ?? "Request failed.");
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json() as Promise<T>;
}

// Global API helper (e.g. to query all events at /api/events)
export async function globalApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(payload.message ?? "Request failed.");
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json() as Promise<T>;
}

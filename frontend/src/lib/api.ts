const DEFAULT_API_URL = import.meta.env.DEV ? "http://127.0.0.1:5000/api" : "/api";

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

export type ApiErrorPayload = {
  message?: string;
  error?: string;
};

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("eduvault_token");
}

export function setSession(token: string, user?: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem("eduvault_token", token);
  if (user) localStorage.setItem("eduvault_user", JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("eduvault_token");
  localStorage.removeItem("eduvault_user");
}

export function getStoredUser<T = { email?: string; name?: string }>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("eduvault_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (!(init.body instanceof FormData) && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await res.text();

  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      throw new Error("Invalid response from server");
    }
  }

  if (!res.ok) {
    const payload = data as ApiErrorPayload | null;
    throw new Error(payload?.message || payload?.error || `Request failed (${res.status})`);
  }

  return data as T;
}

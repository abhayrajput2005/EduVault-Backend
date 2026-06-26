import { apiFetch, clearSession, getStoredUser, getToken, setSession } from "@/lib/api";

export type AuthUser = {
  id?: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
};

type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function currentUser() {
  return getStoredUser<AuthUser>();
}

export async function refreshCurrentUser(): Promise<AuthUser | null> {
  if (!isAuthenticated()) return null;

  try {
    const data = await apiFetch<MeResponse>("/auth/me");
    const token = getToken();
    if (token && data.user) {
      setSession(token, data.user);
    }
    return data.user;
  } catch {
    return currentUser();
  }
}

export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setSession(data.token, data.user);
  return data;
}

export async function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const name = `${payload.firstName} ${payload.lastName}`.trim();
  const data = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email: payload.email, password: payload.password, name }),
  });
  setSession(data.token, data.user);
  return data;
}

export function logout() {
  clearSession();
}

export function isAdmin() {
  const user = currentUser();
  if (user?.isAdmin) return true;

  const token = getToken();
  if (!token) return false;

  const payload = parseJwtPayload(token);
  return Boolean(payload?.is_admin);
}

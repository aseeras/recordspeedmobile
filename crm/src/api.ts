import Constants from "expo-constants";

// The RecordSpeed API. The staff sign-in token is kept by auth.tsx and handed to every call here.
export const API_BASE_URL: string = (Constants.expoConfig?.extra?.apiBaseUrl as string) || "https://api.recordspeed.com";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let token: string | null = null;
let onSignedOut: (() => void) | null = null;
export const setToken = (t: string | null) => { token = t; };
export const setSignedOutHandler = (fn: () => void) => { onSignedOut = fn; };

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: init.method ?? "GET",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: token } : {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  // Signed out on the server (sign-out, or 15 minutes without activity): back to the sign-in screen.
  if (response.status === 401) {
    onSignedOut?.();
    throw new ApiError("Your session ended. Please sign in again.", 401);
  }
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(data?.error?.message ?? "Something went wrong. Please try again.", response.status);
  return data as T;
}

export const crm = <T = unknown>(path: string, init?: { method?: string; body?: unknown }) => api<T>(`/api/v1/staff/crm${path}`, init);
export const staff = <T = unknown>(path: string, init?: { method?: string; body?: unknown }) => api<T>(`/api/v1/staff${path}`, init);

export const money = (cents: number) =>
  "$" + Math.round(cents / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const shortDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const dollarsToCents = (text: string) => {
  const n = Number(text.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
};

// Dates are typed and shown the American way (MM/DD/YYYY); the API takes YYYY-MM-DD.
export const isoToUs = (iso: string | null) => {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${m}/${d}/${y}`;
};
export const usToday = () => isoToUs(today());
// "11/4/2026", "11/04/26" or "" -> "2026-11-04" (or null for blank). Throws on anything that isn't a real date.
export function usToIso(text: string): string | null {
  const t = text.trim();
  if (!t) return null;
  const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!m) throw new Error("Enter the date as MM/DD/YYYY, like 12/01/2026.");
  const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  const month = Number(m[1]);
  const day = Number(m[2]);
  const date = new Date(year, month - 1, day);
  if (date.getMonth() !== month - 1 || date.getDate() !== day) throw new Error(`${t} isn't a real date.`);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

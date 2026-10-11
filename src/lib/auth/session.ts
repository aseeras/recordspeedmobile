import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCOUNT_KEYS } from "../storageKeychain";
import { AccountType } from "../types";

const API_BASE_URL = String(process.env.EXPO_PUBLIC_API_BASE_URL);
const LAST_ACTIVITY_KEY = "@app:lastActivity";
const CREDENTIALS_KEY = ACCOUNT_KEYS.credentials;

// Signed out after this long without using the app, matching the API: attorneys see other people's
// records (HIPAA automatic logoff); patients only see their own, on a phone with its own lock.
export function idleLimitMs(type?: AccountType) {
  return type === "patient" ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000;
}

let lastActivity = Date.now();

export function markActivity() {
  lastActivity = Date.now();
}

export function idleForMs() {
  return Date.now() - lastActivity;
}

// Kept across app restarts, so reopening the app after a long time also counts as idle.
export async function saveLastActivity() {
  await AsyncStorage.setItem(LAST_ACTIVITY_KEY, String(lastActivity));
}

// Once per app launch: picks up when the app was last used before it was closed.
let loaded = false;
export async function loadLastActivity() {
  if (loaded) return;
  loaded = true;
  const saved = Number(await AsyncStorage.getItem(LAST_ACTIVITY_KEY));
  if (saved) lastActivity = Math.min(lastActivity, saved);
}

// Signing in starts a fresh session.
export async function startActivity() {
  loaded = true;
  markActivity();
  await saveLastActivity();
}

const listeners = new Set<() => void>();

export function onSessionEnded(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// When the API refuses the sign-in token (signed out elsewhere, or idle too long), tell the app so it can
// go back to Sign In. Wraps fetch once, so every API call is covered. Only a refusal of the token that's
// actually stored counts: a request sent before the token loaded is just a failed request.
let watching = false;
export function watchForEndedSessions() {
  if (watching) return;
  watching = true;
  const originalFetch = global.fetch;
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const sent = new Headers(init?.headers).get("Authorization");
    if (response.status === 401 && sent && url.startsWith(API_BASE_URL) && !url.includes("/accounts/")) {
      const stored = await AsyncStorage.getItem(CREDENTIALS_KEY);
      if (stored && JSON.parse(stored).authToken === sent) listeners.forEach((listener) => listener());
    }
    return response;
  };
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { API_BASE_URL, setSignedOutHandler, setToken } from "./api";
import type { Account } from "./types";
import { secureGet, secureRemove, secureSet } from "./storage";

// Staff sign-in: email + password, then (unless the account is exempt) the 6-digit code from an authenticator app.
// The token lives in the iPhone's keychain, so the app stays signed in until the API ends the session.

export interface TwoFactorChallenge { ticket: string; setup: boolean; secret?: string; uri?: string }
type SignInResult = { kind: "signed_in" } | { kind: "two_factor"; challenge: TwoFactorChallenge };

interface AuthState {
  ready: boolean;
  account: Account | null;
  recoveryCodes: string[] | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  verifyCode: (ticket: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearRecoveryCodes: () => void;
}

const AuthContext = createContext<AuthState | null>(null);
const TOKEN_KEY = "recordspeed-crm.token";
const ACCOUNT_KEY = "recordspeed-crm.account";

async function post(path: string, body: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  return { response, data, token: response.headers.get("Authorization") };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  const forget = useCallback(async () => {
    setToken(null);
    setAccount(null);
    await secureRemove(TOKEN_KEY);
    await secureRemove(ACCOUNT_KEY);
  }, []);

  useEffect(() => {
    setSignedOutHandler(() => { forget(); });
    (async () => {
      const [savedToken, savedAccount] = await Promise.all([secureGet(TOKEN_KEY), secureGet(ACCOUNT_KEY)]);
      if (savedToken && savedAccount) {
        setToken(savedToken);
        setAccount(JSON.parse(savedAccount));
      }
      setReady(true);
    })();
  }, [forget]);

  const finish = useCallback(async (token: string, acct: Account) => {
    if (acct.type !== "StaffUser") throw new Error("This app is for the RecordSpeed team. Use the RecordSpeed app or portal instead.");
    setToken(token);
    setAccount(acct);
    await secureSet(TOKEN_KEY, token);
    await secureSet(ACCOUNT_KEY, JSON.stringify(acct));
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    const { response, data, token } = await post("/accounts/sign_in", {
      account: { personal_identifier: email.trim().toLowerCase(), password },
    });
    if (response.ok && token && data?.data?.account) {
      await finish(token, data.data.account);
      return { kind: "signed_in" };
    }
    if (data?.two_factor) return { kind: "two_factor", challenge: data.two_factor };
    if (response.status === 429) throw new Error(data?.status?.message ?? "Too many attempts. Please wait a few minutes.");
    throw new Error("That email and password don't match.");
  }, [finish]);

  const verifyCode = useCallback(async (ticket: string, code: string) => {
    const { response, data, token } = await post("/accounts/two_factor", { ticket, code: code.replace(/\s/g, "") });
    if (!response.ok || !token || !data?.data?.account) throw new Error(data?.status?.message ?? "That code isn't right.");
    await finish(token, data.data.account);
    if (data.recovery_codes) setRecoveryCodes(data.recovery_codes);
  }, [finish]);

  const signOut = useCallback(async () => {
    const saved = await secureGet(TOKEN_KEY);
    if (saved) fetch(`${API_BASE_URL}/accounts/sign_out`, { method: "DELETE", headers: { Authorization: saved } }).catch(() => undefined);
    await forget();
  }, [forget]);

  const value = useMemo(
    () => ({ ready, account, recoveryCodes, signIn, verifyCode, signOut, clearRecoveryCodes: () => setRecoveryCodes(null) }),
    [ready, account, recoveryCodes, signIn, verifyCode, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth outside AuthProvider");
  return value;
}

export const isWeb = Platform.OS === "web";

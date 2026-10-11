import { useAccountCredentials, useAccountSignOut } from "@/lib/auth/hooks";
import {
  idleForMs,
  idleLimitMs,
  loadLastActivity,
  onSessionEnded,
  saveLastActivity,
  watchForEndedSessions,
} from "@/lib/auth/session";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

watchForEndedSessions();

export type SignedOutReason = "ended" | "idle";

// Signs the user out when their session ends: after too long without using the app (checked while it's
// open and whenever it comes back to the foreground), or when the API refuses the token.
export default function SessionGuard() {
  const { data: credentials } = useAccountCredentials();
  const { mutateAsync: signOut } = useAccountSignOut();
  const signingOut = useRef(false);
  const signedIn = !!credentials?.authToken;
  const limit = idleLimitMs(credentials?.type);

  const end = useCallback(
    async (reason: SignedOutReason) => {
      if (signingOut.current) return;
      signingOut.current = true;
      try {
        await signOut({ endSession: reason === "idle" });
        router.dismissAll();
        router.replace("/zero_state");
        setTimeout(() => router.push({ pathname: "/sign_in", params: { signedOut: reason } }), 0);
      } finally {
        signingOut.current = false;
      }
    },
    [signOut]
  );

  useEffect(() => onSessionEnded(() => signedIn && end("ended")), [signedIn, end]);

  useEffect(() => {
    if (!signedIn) return;
    const check = () => {
      if (idleForMs() >= limit) end("idle");
    };
    loadLastActivity().then(check);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") check();
      else saveLastActivity();
    });
    const timer = setInterval(check, 30_000);
    return () => {
      subscription.remove();
      clearInterval(timer);
    };
  }, [signedIn, limit, end]);

  return null;
}

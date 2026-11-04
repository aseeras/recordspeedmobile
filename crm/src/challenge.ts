import type { TwoFactorChallenge } from "./auth";

// Hands the two-step challenge from the sign-in screen to the code screen (kept in memory only).
export const pendingChallenge: { current: TwoFactorChallenge | null } = { current: null };

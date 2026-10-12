// The RecordSpeed API. Builds set EXPO_PUBLIC_API_BASE_URL (eas.json; the end-to-end tests point it at a local
// server), but updates published with `eas update` don't read eas.json, so fall back to production rather than
// sending every request to "undefined/...".
export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.recordspeed.com";

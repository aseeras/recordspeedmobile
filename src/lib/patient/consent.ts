// The agreement a patient gives before their card appears in the attorneys' Prospects list. The server
// records the version with the agreement; changing this text means bumping the version here and in
// Patient::PUBLIC_PROFILE_CONSENT_VERSION on the server, and everyone listed is asked again. The Spanish in
// src/lib/i18n/es.ts is the same agreement; change both together.
export const PUBLIC_PROFILE_CONSENT_VERSION = "2026-10";

export const PUBLIC_PROFILE_CONSENT_TITLE = "Show my card to attorneys?";

export const PUBLIC_PROFILE_CONSENT_POINTS = [
  "Attorneys who use RecordSpeed will see your name, your RecordSpeed handle, the hospital or clinic you chose, and your case description.",
  "They won't see your medical records, documents, Social Security number or date of birth.",
  "Attorneys can send you their contact details through the app. RecordSpeed doesn't choose, endorse or pay attorneys, and any arrangement with one is between you and them.",
  "Your case description is visible to every attorney on RecordSpeed, so leave out anything you don't want them to read.",
  "You can turn your card off at any time here in My Profile. It leaves the list right away; attorneys who already contacted you keep what they sent.",
  "We keep a record of when you agreed and to which version of this text.",
];

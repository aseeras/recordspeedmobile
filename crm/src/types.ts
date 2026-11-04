export type Stage = "lead" | "contacted" | "demo" | "pilot" | "won" | "lost";
export const STAGES: Stage[] = ["lead", "contacted", "demo", "pilot", "won", "lost"];
export const OPEN_STAGES: Stage[] = ["lead", "contacted", "demo", "pilot"];
export const STAGE_LABEL: Record<Stage, string> = { lead: "Lead", contacted: "Contacted", demo: "Demo", pilot: "Pilot", won: "Won", lost: "Lost" };
export const KIND_LABEL: Record<string, string> = {
  insurer: "Insurer", law_firm: "Law firm", records_office: "Records office", hospital: "Hospital",
  physician_group: "Physician group", investor: "Investor", partner: "Partner", other: "Other",
};
export const KINDS = Object.keys(KIND_LABEL);
export const ACTIVITY_LABEL: Record<string, string> = { call: "Call", email: "Email", meeting: "Meeting", note: "Note", task: "Follow-up", stage_change: "Stage" };

export interface Staff { id: number; name: string; email?: string }
export interface Account { id: number; email: string; fullName: string; firstName: string; type: string }
export interface CrmContact { id: number; crm_account_id: number; first_name: string; last_name: string | null; full_name: string; title: string | null; email: string | null; phone: string | null }
export interface CrmAccount {
  id: number; name: string; kind: string; website: string | null; phone: string | null; city: string | null; state: string | null; notes: string | null;
  owner: Staff | null; created_at: string; contacts_count?: number; open_deals_count?: number; open_pipeline_cents?: number;
}
export interface CrmDeal {
  id: number; crm_account_id: number; crm_contact_id: number | null; name: string; stage: Stage; source: string; amount_cents: number;
  close_on: string | null; lost_reason: string | null; stage_changed_at: string; created_at: string; demo_request_id: number | null;
  account: { id: number; name: string; kind: string }; contact: CrmContact | null; owner: Staff | null;
}
export interface CrmActivity {
  id: number; kind: string; subject: string; body: string | null; due_on: string | null; completed_at: string | null; occurred_at: string;
  author: Staff | null; assignee: Staff | null; account: { id: number; name: string } | null; deal: { id: number; name: string } | null;
  contact: { id: number; name: string } | null;
}
export interface Report {
  by_stage: { stage: Stage; count: number; amount_cents: number }[];
  totals: { open_count: number; open_cents: number; won_count: number; won_cents: number; lost_count: number; win_rate: number | null };
  funnel: { stage: Stage; count: number }[];
  by_kind: { key: string; open_count: number; open_cents: number; won_count: number; won_cents: number }[];
  open_tasks: { overdue: number; due_today: number; total: number };
}
export interface AsanaTask { gid: string; name: string; completed: boolean; due_on: string | null; assignee: string | null; section: string | null; url: string | null }
export interface AsanaProject { gid: string; name: string; url: string | null; sections: string[]; section_gids: Record<string, string>; tasks: AsanaTask[] }
export interface AsanaUser { gid: string; name: string; email: string | null }
export interface DemoRequest {
  id: number; name: string; email: string; organization: string | null; role: string | null; phone: string | null; message: string | null;
  status: "new" | "contacted" | "converted" | "closed"; created_at: string; deal_id: number | null;
}

export interface CrmMeeting {
  id: number; title: string; starts_at: string; ends_at: string; attendee_emails: string[]; meet_url: string | null;
  status: "scheduled" | "transcribed" | "summarized" | "no_transcript" | "cancelled";
  suggestions_status: "none" | "pending" | "applied" | "dismissed"; has_transcript: boolean;
  organizer: Staff | null; account: { id: number; name: string }; deal: { id: number; name: string; stage: Stage } | null;
  video_provider?: "daily" | null;
}
export interface MeetingVideo {
  guest_link: string; transcription_status: "off" | "running" | "stopped"; customer_agreed: boolean; agreed_by: string | null; agreed_at: string | null; open: boolean;
}
export interface MeetingSuggestions {
  note: string;
  follow_ups: { subject: string; due_on: string | null; assignee_email: string | null }[];
  stage: { to: Stage; reason: string } | null;
  contacts: { first_name: string; last_name: string; title: string; email: string }[];
  amount_cents: number | null;
}
export interface MeetingDetail extends CrmMeeting {
  transcript: string | null; summary: string | null; suggestions: MeetingSuggestions | null; phi_allowed: boolean;
  can_fetch_transcript?: boolean; video?: MeetingVideo | null;
}

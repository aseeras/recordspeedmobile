import { useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Switch, Text, View } from "react-native";
import { crm, today } from "./api";
import { DateField, TimeField } from "./DateField";
import { useMeetings } from "./queries";
import type { CrmContact, CrmMeeting } from "./types";
import { Button, C, Choice, ErrorText, Field, Muted, Row, s, useRefreshAll } from "./ui";

export const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function meetingLabel(m: CrmMeeting) {
  if (m.suggestions_status === "pending") return "Updates to review";
  if (m.suggestions_status === "applied") return "Added to CRM";
  return { scheduled: "Scheduled", transcribed: "Transcript ready", summarized: "Summarized", no_transcript: "No transcript", cancelled: "Cancelled" }[m.status];
}

export const isLive = (m: CrmMeeting) => m.status === "scheduled" && new Date(m.ends_at).getTime() > Date.now();

// Meetings for a deal or an account, with Join for upcoming ones and a form to schedule another.
export function MeetingsSection({ dealId, accountId, contacts, defaultTitle }: { dealId?: number; accountId: number; contacts: CrmContact[]; defaultTitle: string }) {
  const router = useRouter();
  const { data } = useMeetings(dealId ? { dealId } : { accountId });
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      {(data?.meetings ?? []).map((m) => (
        <Row key={m.id} title={m.title} subtitle={`${when(m.starts_at)} · ${meetingLabel(m)}`} onPress={() => router.push(`/meeting/${m.id}`)}
          right={isLive(m) && m.meet_url ? <Button small title="Join" onPress={() => Linking.openURL(m.meet_url!)} /> : undefined} />
      ))}
      {data && data.meetings.length === 0 ? <Muted>No meetings yet.</Muted> : null}
      {data && !data.google_connected ? <Muted>{"Google Meet isn't connected yet."}</Muted> : null}
      {data?.google_connected ? (
        open ? <ScheduleMeeting dealId={dealId} accountId={accountId} contacts={contacts} defaultTitle={defaultTitle} onDone={() => setOpen(false)} />
          : <Button small kind="secondary" title="+ Schedule Google Meet" onPress={() => setOpen(true)} />
      ) : null}
    </View>
  );
}

function ScheduleMeeting({ dealId, accountId, contacts, defaultTitle, onDone }: {
  dealId?: number; accountId: number; contacts: CrmContact[]; defaultTitle: string; onDone: () => void;
}) {
  const refresh = useRefreshAll();
  const withEmail = contacts.filter((c) => c.email);
  const [title, setTitle] = useState(defaultTitle);
  const [date, setDate] = useState<string | null>(today());
  const [time, setTime] = useState("10:00");
  const [length, setLength] = useState<"15" | "30" | "45" | "60">("30");
  const [invite, setInvite] = useState<string[]>(withEmail.map((c) => c.email!));
  const [others, setOthers] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      if (!date) throw new Error("Pick a date.");
      const [h, m] = time.split(":").map(Number);
      const [y, mo, d] = date.split("-").map(Number);
      const startsAt = new Date(y, mo - 1, d, h, m).toISOString(); // the phone's own time zone
      await crm("/meetings", { method: "POST", body: { meeting: {
        crm_account_id: accountId, crm_deal_id: dealId ?? null, title, starts_at: startsAt, duration_minutes: Number(length),
        attendee_emails: [...invite, ...others.split(",").map((e) => e.trim()).filter(Boolean)],
      } } });
      refresh();
      onDone();
    } catch (e) { setError(e); } finally { setBusy(false); }
  }

  return (
    <View style={{ gap: 10 }}>
      <Field label="Title" value={title} onChangeText={setTitle} />
      <DateField label="Date" value={date} onChange={setDate} />
      <TimeField label="Time" value={time} onChange={setTime} />
      <Choice label="Length" options={["15", "30", "45", "60"] as const} value={length} onChange={setLength}
        labels={{ 15: "15 min", 30: "30 min", 45: "45 min", 60: "1 hour" }} />
      {withEmail.length > 0 ? (
        <View style={{ gap: 6 }}>
          <Text style={s.label}>Invite</Text>
          {withEmail.map((c) => (
            <View key={c.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text>{c.full_name}</Text>
              <Switch value={invite.includes(c.email!)} onValueChange={(on) => setInvite(on ? [...invite, c.email!] : invite.filter((e) => e !== c.email))} />
            </View>
          ))}
        </View>
      ) : null}
      <Field label="Other emails (comma-separated)" value={others} onChangeText={setOthers} autoCapitalize="none" keyboardType="email-address" />
      <ErrorText error={error} />
      <Button title={busy ? "Scheduling…" : "Schedule Google Meet"} onPress={save} disabled={busy} />
      <Text style={[s.muted, { color: C.muted }]}>Google sends the invites from your calendar. Turn on transcription in the call.</Text>
    </View>
  );
}

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Switch, Text, TextInput, View } from "react-native";
import { crm, dollarsToCents, money } from "@/api";
import { DateField } from "@/DateField";
import { isLive, meetingLabel, when } from "@/meetings";
import { useDeals, useMeeting } from "@/queries";
import type { MeetingSuggestions, Stage } from "@/types";
import { STAGE_LABEL, STAGES } from "@/types";
import { Button, C, Card, Choice, ErrorText, Field, Loading, Muted, Screen, confirm, s, useRefreshAll } from "@/ui";

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <Text style={{ flex: 1, fontWeight: "600", color: C.ink }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

// The AI's suggested updates, each one switchable and editable; nothing changes until Approve.
function Suggestions({ meetingId, suggestions, dealStage, accountName }: { meetingId: number; suggestions: MeetingSuggestions; dealStage: Stage | null; accountName: string }) {
  const refresh = useRefreshAll();
  const staff = useDeals().data?.staff ?? [];
  const [useNote, setUseNote] = useState(true);
  const [note, setNote] = useState(suggestions.note);
  const [followUps, setFollowUps] = useState(suggestions.follow_ups.map((f) => ({ ...f, on: true })));
  const [useStage, setUseStage] = useState(Boolean(suggestions.stage && dealStage));
  const [stage, setStage] = useState<Stage>(suggestions.stage?.to ?? dealStage ?? "lead");
  const [useAmount, setUseAmount] = useState(Boolean(suggestions.amount_cents && dealStage));
  const [amount, setAmount] = useState(suggestions.amount_cents ? String(suggestions.amount_cents / 100) : "");
  const [contacts, setContacts] = useState(suggestions.contacts.map((c) => ({ ...c, on: true })));
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  async function approve() {
    setBusy(true);
    setError(null);
    try {
      await crm(`/meetings/${meetingId}/apply`, { method: "POST", body: {
        note: useNote ? note : "", stage: useStage ? stage : "", amount_cents: useAmount ? dollarsToCents(amount) : 0,
        follow_ups: followUps.filter((f) => f.on && f.subject.trim()).map(({ subject, due_on, assignee_email }) => ({ subject, due_on, assignee_email })),
        contacts: contacts.filter((c) => c.on && c.first_name.trim()).map(({ first_name, last_name, title, email }) => ({ first_name, last_name, title, email })),
      } });
      refresh();
    } catch (e) { setError(e); } finally { setBusy(false); }
  }

  return (
    <Card title="Suggested updates · approve to add">
      <Toggle label="Log the meeting with this note" value={useNote} onChange={setUseNote} />
      {useNote ? <TextInput multiline value={note} onChangeText={setNote} style={[s.input, { minHeight: 100, textAlignVertical: "top" }]} /> : null}

      {followUps.map((f, i) => (
        <View key={i} style={{ gap: 6, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: C.line }}>
          <Toggle label={`Follow-up ${i + 1}`} value={f.on} onChange={(on) => setFollowUps(followUps.map((x, j) => (j === i ? { ...x, on } : x)))} />
          {f.on ? (
            <>
              <TextInput value={f.subject} onChangeText={(t) => setFollowUps(followUps.map((x, j) => (j === i ? { ...x, subject: t } : x)))} style={s.input} />
              <DateField label="Due" value={f.due_on} onChange={(d) => setFollowUps(followUps.map((x, j) => (j === i ? { ...x, due_on: d } : x)))} />
              {staff.length > 0 ? (
                <Choice label="For" options={staff.map((x) => x.email ?? "")} value={f.assignee_email ?? ""}
                  onChange={(e) => setFollowUps(followUps.map((x, j) => (j === i ? { ...x, assignee_email: e } : x)))}
                  labels={Object.fromEntries(staff.map((x) => [x.email ?? "", x.name]))} />
              ) : null}
            </>
          ) : null}
        </View>
      ))}

      {suggestions.stage && dealStage ? (
        <View style={{ gap: 6, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: C.line }}>
          <Toggle label={`Move from ${STAGE_LABEL[dealStage]} to ${STAGE_LABEL[stage]}`} value={useStage} onChange={setUseStage} />
          {useStage ? <Choice options={STAGES} value={stage} onChange={setStage} labels={STAGE_LABEL} /> : null}
          <Muted>{suggestions.stage.reason}</Muted>
        </View>
      ) : null}

      {suggestions.amount_cents && dealStage ? (
        <View style={{ gap: 6, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: C.line }}>
          <Toggle label={`Set deal value (${money(suggestions.amount_cents)})`} value={useAmount} onChange={setUseAmount} />
          {useAmount ? <Field label="Annual value ($)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" /> : null}
        </View>
      ) : null}

      {contacts.map((c, i) => (
        <View key={i} style={{ gap: 6, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: C.line }}>
          <Toggle label={`Add ${[c.first_name, c.last_name].filter(Boolean).join(" ")} to ${accountName}`} value={c.on}
            onChange={(on) => setContacts(contacts.map((x, j) => (j === i ? { ...x, on } : x)))} />
          {c.on ? <Muted>{[c.title, c.email].filter(Boolean).join(" · ")}</Muted> : null}
        </View>
      ))}

      <ErrorText error={error} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}><Button title={busy ? "Adding…" : "Approve"} onPress={approve} disabled={busy} /></View>
        <View style={{ flex: 1 }}><Button kind="secondary" title="Dismiss" onPress={async () => { await crm(`/meetings/${meetingId}/dismiss`, { method: "POST" }); refresh(); }} /></View>
      </View>
    </Card>
  );
}

export default function MeetingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const refresh = useRefreshAll();
  const { data, error, refetch } = useMeeting(id);
  const [noPhi, setNoPhi] = useState(false);
  const [paste, setPaste] = useState("");
  const [actionError, setActionError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setActionError(null); }, [id]);
  if (!data) return error ? <Screen><ErrorText error={error} /></Screen> : <Loading />;
  const m = data.meeting;

  async function run(path: string, body?: unknown) {
    setBusy(true);
    setActionError(null);
    try { await crm(`/meetings/${m.id}${path}`, { method: "POST", body: body ?? {} }); refresh(); } catch (e) { setActionError(e); } finally { setBusy(false); }
  }

  return (
    <Screen onRefresh={refetch}>
      <Stack.Screen options={{ title: m.account.name }} />
      <View style={{ gap: 4 }}>
        <Text style={s.h1}>{m.title}</Text>
        <Text style={s.muted}>{when(m.starts_at)} · {meetingLabel(m)}</Text>
        {m.deal ? <Text style={{ color: C.brand }} onPress={() => router.push(`/deal/${m.deal!.id}`)}>{m.deal.name} ›</Text> : null}
      </View>

      {isLive(m) ? (
        <Card>
          {m.meet_url ? <Button title="Join Google Meet" onPress={() => Linking.openURL(m.meet_url!)} /> : null}
          <Muted>{`Guests: ${m.attendee_emails.join(", ") || "none"}`}</Muted>
          <Muted>In the call, turn on Transcripts so the CRM can summarize it afterwards.</Muted>
          <Button kind="secondary" small title="Cancel meeting"
            onPress={() => confirm("Cancel this meeting?", "Google will tell the guests.", async () => { await crm(`/meetings/${m.id}`, { method: "DELETE" }); refresh(); }, "Cancel meeting")} />
        </Card>
      ) : null}

      {m.suggestions && m.suggestions_status === "pending" ? (
        <>
          {m.summary ? <Card title="Summary"><Text style={{ color: C.ink }}>{m.summary}</Text></Card> : null}
          <Suggestions meetingId={m.id} suggestions={m.suggestions} dealStage={m.deal?.stage ?? null} accountName={m.account.name} />
        </>
      ) : null}
      {m.suggestions_status === "applied" ? <Card><Text>Added to the CRM.</Text></Card> : null}

      <Card title="Transcript">
        {m.transcript ? (
          <>
            {m.suggestions_status === "none" ? (
              <View style={{ gap: 8 }}>
                {!m.phi_allowed ? <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Switch value={noPhi} onValueChange={setNoPhi} />
                  <Text style={{ flex: 1 }}>No patient health information was discussed on this call</Text>
                </View> : null}
                <Button title={busy ? "Summarizing…" : "Summarize and suggest updates"} disabled={busy || (!m.phi_allowed && !noPhi)}
                  onPress={() => run("/summarize", { no_patient_information: noPhi })} />
              </View>
            ) : null}
            <Text selectable style={{ color: C.ink, fontSize: 14, lineHeight: 20 }}>{m.transcript}</Text>
          </>
        ) : m.status === "cancelled" ? <Muted>This meeting was cancelled.</Muted> : (
          <View style={{ gap: 8 }}>
            <Muted>{!m.can_fetch_transcript ? "After the call, paste Meet's transcript (from Google's email or the Doc in your Drive) or your notes."
              : isLive(m) ? "After the call, Meet's transcript shows up here within about 15 minutes." : "No transcript yet. Meet can take a few minutes."}</Muted>
            {!isLive(m) && m.can_fetch_transcript ? <Button kind="secondary" title="Check for the transcript now" onPress={() => run("/fetch_transcript")} disabled={busy} /> : null}
            <Field label={m.can_fetch_transcript ? "Or paste a transcript or notes" : "Paste the transcript or notes"} value={paste} onChangeText={setPaste} multiline />
            <Button small title="Save transcript" onPress={() => run("/transcript", { transcript: paste })} disabled={busy || !paste.trim()} />
          </View>
        )}
        <ErrorText error={actionError} />
      </Card>
    </Screen>
  );
}

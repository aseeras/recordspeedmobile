import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { crm, shortDate, today, usToday, usToIso } from "./api";
import type { CrmActivity, CrmContact, Staff } from "./types";
import { ACTIVITY_LABEL } from "./types";
import { Button, C, Choice, ErrorText, Field, Muted, confirm, s, useRefreshAll } from "./ui";

// Done / reopen for a follow-up.
export function TaskCheck({ task }: { task: CrmActivity }) {
  const refresh = useRefreshAll();
  const done = Boolean(task.completed_at);
  return (
    <Pressable
      accessibilityRole="checkbox" accessibilityState={{ checked: done }} accessibilityLabel={done ? "Reopen" : "Mark done"} hitSlop={10}
      onPress={async () => { await crm(`/activities/${task.id}`, { method: "PATCH", body: { activity: { completed: !done } } }); refresh(); }}
    >
      <Ionicons name={done ? "checkmark-circle" : "ellipse-outline"} size={26} color={done ? C.success : C.muted} />
    </Pressable>
  );
}

export function Timeline({ activities, showDeal }: { activities: CrmActivity[]; showDeal?: boolean }) {
  const router = useRouter();
  const refresh = useRefreshAll();
  if (activities.length === 0) return <Muted>Nothing logged yet.</Muted>;
  return (
    <View style={{ gap: 12 }}>
      {activities.map((a) => {
        const overdue = a.kind === "task" && !a.completed_at && a.due_on !== null && a.due_on < today();
        return (
          <View key={a.id} style={{ flexDirection: "row", gap: 10, borderLeftWidth: 2, borderLeftColor: C.line, paddingLeft: 10 }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[s.muted, { fontWeight: "700", textTransform: "uppercase", fontSize: 11 }]}>{ACTIVITY_LABEL[a.kind] ?? a.kind}</Text>
              <Text style={[{ fontSize: 15, fontWeight: "600", color: C.ink }, a.completed_at ? { textDecorationLine: "line-through", color: C.muted } : null]}>{a.subject}</Text>
              {a.body ? <Text style={{ color: C.ink }}>{a.body}</Text> : null}
              <Text style={[s.muted, overdue && { color: C.danger, fontWeight: "700" }]}>
                {[shortDate(a.occurred_at), a.author?.name, a.contact ? `with ${a.contact.name}` : null,
                  a.kind === "task" && a.due_on ? `due ${shortDate(a.due_on)}` : null, a.kind === "task" && a.assignee ? `for ${a.assignee.name}` : null].filter(Boolean).join(" · ")}
              </Text>
              {showDeal && a.deal ? <Text style={{ color: C.brand }} onPress={() => router.push(`/deal/${a.deal!.id}`)}>{a.deal.name}</Text> : null}
              {a.kind !== "stage_change" ? (
                <Text style={[s.muted, { textDecorationLine: "underline" }]}
                  onPress={() => confirm("Delete this entry?", a.subject, async () => { await crm(`/activities/${a.id}`, { method: "DELETE" }); refresh(); })}>delete</Text>
              ) : null}
            </View>
            {a.kind === "task" ? <TaskCheck task={a} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const KINDS = ["call", "email", "meeting", "note", "task"] as const;

// Log a call/email/meeting/note, or add a follow-up (with a due date and who it's for).
export function LogActivity({ accountId, dealId, contacts, staff }: { accountId?: number; dealId?: number; contacts: CrmContact[]; staff: Staff[] }) {
  const refresh = useRefreshAll();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("call");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [due, setDue] = useState("");
  const [contactId, setContactId] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await crm("/activities", { method: "POST", body: { activity: {
        kind, subject, body: body || null, due_on: kind === "task" ? usToIso(due) : null, crm_account_id: accountId ?? null, crm_deal_id: dealId ?? null,
        crm_contact_id: contactId, ...(kind === "task" && assigneeId ? { assignee_id: assigneeId } : {}),
      } } });
      setSubject(""); setBody(""); setDue("");
      refresh();
    } catch (e) { setError(e); } finally { setBusy(false); }
  }

  return (
    <View style={{ gap: 10 }}>
      <Choice options={KINDS} value={kind} onChange={setKind} labels={ACTIVITY_LABEL} />
      <Field label="Subject" value={subject} onChangeText={setSubject} placeholder={kind === "task" ? "Send pilot terms" : "Intro call with claims team"} />
      {contacts.length > 0 ? (
        <Choice label="With" options={contacts.map((c) => String(c.id))} value={contactId}
          onChange={(v) => setContactId(v === contactId ? null : v)} labels={Object.fromEntries(contacts.map((c) => [String(c.id), c.full_name]))} />
      ) : null}
      <Field label="Notes" value={body} onChangeText={setBody} multiline placeholder="No patient information here." />
      {kind === "task" ? (
        <>
          <Field label="Due (MM/DD/YYYY)" value={due} onChangeText={setDue} placeholder={usToday()} autoCorrect={false} keyboardType="numbers-and-punctuation" />
          <Choice label="For" options={staff.map((x) => String(x.id))} value={assigneeId}
            onChange={(v) => setAssigneeId(v === assigneeId ? null : v)} labels={Object.fromEntries(staff.map((x) => [String(x.id), x.name]))} />
        </>
      ) : null}
      <ErrorText error={error} />
      <Button title={busy ? "Saving…" : kind === "task" ? "Add follow-up" : "Log it"} onPress={save} disabled={busy || !subject.trim()} />
    </View>
  );
}

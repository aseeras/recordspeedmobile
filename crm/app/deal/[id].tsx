import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Text, View } from "react-native";
import { crm, dollarsToCents, isoToUs, money, shortDate, usToIso } from "@/api";
import { LogActivity, Timeline } from "@/activity";
import { useDeal } from "@/queries";
import { KIND_LABEL, OPEN_STAGES, STAGE_LABEL, Stage } from "@/types";
import { Button, C, Card, Choice, ErrorText, Field, Loading, Muted, Screen, StageBadge, confirm, s, useRefreshAll } from "@/ui";

export default function DealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const refresh = useRefreshAll();
  const { data, error, refetch } = useDeal(id);
  const [lostReason, setLostReason] = useState("");
  const [askLost, setAskLost] = useState(false);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [closeOn, setCloseOn] = useState("");
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<unknown>(null);

  useEffect(() => {
    if (!data) return;
    setName(data.deal.name);
    setAmount(data.deal.amount_cents ? String(data.deal.amount_cents / 100) : "");
    setCloseOn(isoToUs(data.deal.close_on));
    setOwnerId(data.deal.owner ? String(data.deal.owner.id) : null);
    setContactId(data.deal.crm_contact_id ? String(data.deal.crm_contact_id) : null);
  }, [data]);

  if (!data) return error ? <Screen><ErrorText error={error} /></Screen> : <Loading />;
  const { deal, activities, contacts, staff } = data;

  async function move(stage: Stage, reason?: string) {
    try {
      await crm(`/deals/${deal.id}`, { method: "PATCH", body: { deal: { stage, lost_reason: reason ?? null } } });
      setAskLost(false);
      refresh();
    } catch (e) { setSaveError(e); }
  }
  async function save() {
    setSaveError(null);
    try {
      await crm(`/deals/${deal.id}`, { method: "PATCH", body: { deal: {
        name, amount_cents: dollarsToCents(amount), close_on: usToIso(closeOn), owner_id: ownerId, crm_contact_id: contactId,
      } } });
      setEdit(false);
      refresh();
    } catch (e) { setSaveError(e); }
  }

  return (
    <Screen onRefresh={refetch}>
      <Stack.Screen options={{ title: deal.account.name }} />
      <View style={{ gap: 4 }}>
        <Text style={s.h1}>{deal.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <StageBadge stage={deal.stage} />
          <Text style={{ fontWeight: "800", fontSize: 18 }}>{money(deal.amount_cents)}</Text>
          <Text style={s.muted}>{[deal.owner?.name, deal.close_on ? `closes ${shortDate(deal.close_on)}` : null].filter(Boolean).join(" · ")}</Text>
        </View>
        <Text style={{ color: C.brand }} onPress={() => router.push(`/account/${deal.account.id}`)}>{deal.account.name} · {KIND_LABEL[deal.account.kind] ?? deal.account.kind} ›</Text>
        {deal.stage === "lost" && deal.lost_reason ? <Text style={{ color: C.danger }}>Lost: {deal.lost_reason}</Text> : null}
      </View>

      <Card title="Move to">
        <Choice options={OPEN_STAGES} value={OPEN_STAGES.includes(deal.stage) ? deal.stage : null} onChange={(st) => move(st)} labels={STAGE_LABEL} />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}><Button kind="success" title="Won 🎉" onPress={() => move("won")} disabled={deal.stage === "won"} /></View>
          <View style={{ flex: 1 }}><Button kind="danger" title="Lost…" onPress={() => setAskLost(!askLost)} /></View>
        </View>
        {askLost ? (
          <View style={{ gap: 8 }}>
            <Field label="Why was it lost?" value={lostReason} onChangeText={setLostReason} placeholder="No budget this year" />
            <Button kind="danger" title="Mark lost" onPress={() => move("lost", lostReason)} />
          </View>
        ) : null}
        <ErrorText error={saveError} />
      </Card>

      {deal.contact ? (
        <Card title="Main contact">
          <Text style={{ fontWeight: "700", fontSize: 16 }}>{deal.contact.full_name}{deal.contact.title ? <Text style={s.muted}> · {deal.contact.title}</Text> : null}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {deal.contact.phone ? <Button small title="Call" onPress={() => Linking.openURL(`tel:${deal.contact!.phone}`)} /> : null}
            {deal.contact.email ? <Button small kind="secondary" title="Email" onPress={() => Linking.openURL(`mailto:${deal.contact!.email}`)} /> : null}
          </View>
        </Card>
      ) : null}

      <Card title="Log activity or add a follow-up">
        <LogActivity accountId={deal.account.id} dealId={deal.id} contacts={contacts} staff={staff} />
      </Card>

      <Card title="Details" right={<Text style={{ color: C.brand, fontWeight: "600" }} onPress={() => setEdit(!edit)}>{edit ? "Cancel" : "Edit"}</Text>}>
        {edit ? (
          <View style={{ gap: 10 }}>
            <Field label="Deal name" value={name} onChangeText={setName} />
            <Field label="Annual value ($)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
            <Field label="Expected close (MM/DD/YYYY)" value={closeOn} onChangeText={setCloseOn} autoCorrect={false} keyboardType="numbers-and-punctuation" />
            <Choice label="Owner" options={staff.map((x) => String(x.id))} value={ownerId} onChange={setOwnerId} labels={Object.fromEntries(staff.map((x) => [String(x.id), x.name]))} />
            {contacts.length > 0 ? (
              <Choice label="Main contact" options={contacts.map((c) => String(c.id))} value={contactId}
                onChange={(v) => setContactId(v === contactId ? null : v)} labels={Object.fromEntries(contacts.map((c) => [String(c.id), c.full_name]))} />
            ) : null}
            <Button title="Save" onPress={save} />
          </View>
        ) : (
          <Muted>{`Source: ${deal.source} · created ${shortDate(deal.created_at)} · in this stage since ${shortDate(deal.stage_changed_at)}`}</Muted>
        )}
      </Card>

      <Card title="History">
        <Timeline activities={activities} />
      </Card>

      <Button kind="secondary" title="Delete deal"
        onPress={() => confirm("Delete this deal?", "Its history goes too.", async () => { await crm(`/deals/${deal.id}`, { method: "DELETE" }); refresh(); router.back(); })} />
    </Screen>
  );
}

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Text, View } from "react-native";
import { crm, money } from "@/api";
import { LogActivity, Timeline } from "@/activity";
import { useAccount, useDeals } from "@/queries";
import { KIND_LABEL, KINDS } from "@/types";
import { Button, C, Card, Choice, ErrorText, Field, Loading, Muted, Row, Screen, StageBadge, confirm, s, useRefreshAll } from "@/ui";

function AddPerson({ accountId }: { accountId: number }) {
  const refresh = useRefreshAll();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ first_name: "", last_name: "", title: "", email: "", phone: "" });
  const [error, setError] = useState<unknown>(null);
  if (!open) return <Button small kind="secondary" title="+ Add a person" onPress={() => setOpen(true)} />;
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  async function save() {
    setError(null);
    try {
      await crm(`/accounts/${accountId}/contacts`, { method: "POST", body: { contact: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v || null])) } });
      setF({ first_name: "", last_name: "", title: "", email: "", phone: "" });
      setOpen(false);
      refresh();
    } catch (e) { setError(e); }
  }
  return (
    <View style={{ gap: 8 }}>
      <Field label="First name" value={f.first_name} onChangeText={set("first_name")} />
      <Field label="Last name" value={f.last_name} onChangeText={set("last_name")} />
      <Field label="Title" value={f.title} onChangeText={set("title")} placeholder="VP Claims" />
      <Field label="Email" value={f.email} onChangeText={set("email")} keyboardType="email-address" autoCapitalize="none" />
      <Field label="Phone" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" />
      <ErrorText error={error} />
      <Button title="Add person" onPress={save} disabled={!f.first_name.trim()} />
    </View>
  );
}

export default function AccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const refresh = useRefreshAll();
  const { data, error, refetch } = useAccount(id);
  const staffList = useDeals().data?.staff ?? [];
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<unknown>(null);
  if (!data) return error ? <Screen><ErrorText error={error} /></Screen> : <Loading />;
  const { account, contacts, deals, activities } = data;
  const value = (k: string) => form[k] ?? ((account as unknown as Record<string, string | null>)[k] ?? "");
  const set = (k: string) => (v: string) => setForm({ ...form, [k]: v });

  async function save() {
    setSaveError(null);
    try {
      await crm(`/accounts/${account.id}`, { method: "PATCH", body: { account: Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v || null])) } });
      setEdit(false); setForm({});
      refresh();
    } catch (e) { setSaveError(e); }
  }

  return (
    <Screen onRefresh={refetch}>
      <Stack.Screen options={{ title: account.name }} />
      <View style={{ gap: 4 }}>
        <Text style={s.h1}>{account.name}</Text>
        <Text style={s.muted}>{[KIND_LABEL[account.kind] ?? account.kind, [account.city, account.state].filter(Boolean).join(", "), account.owner ? `owner ${account.owner.name}` : null].filter(Boolean).join(" · ")}</Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          {account.phone ? <Button small title="Call" onPress={() => Linking.openURL(`tel:${account.phone}`)} /> : null}
          {account.website ? <Button small kind="secondary" title="Website" onPress={() => Linking.openURL(account.website!.startsWith("http") ? account.website! : `https://${account.website}`)} /> : null}
        </View>
      </View>

      <Card title="Deals" right={<Text style={{ color: C.brand, fontWeight: "600" }} onPress={() => router.push(`/new_deal?account=${account.id}`)}>+ Deal</Text>}>
        {deals.map((d) => <Row key={d.id} title={d.name} subtitle={money(d.amount_cents)} right={<StageBadge stage={d.stage} />} onPress={() => router.push(`/deal/${d.id}`)} />)}
        {deals.length === 0 ? <Muted>No deals yet.</Muted> : null}
      </Card>

      <Card title="People">
        {contacts.map((c) => (
          <View key={c.id} style={{ paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: C.line, gap: 4 }}>
            <Text style={{ fontWeight: "700", fontSize: 15 }}>{c.full_name}{c.title ? <Text style={s.muted}> · {c.title}</Text> : null}</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {c.phone ? <Button small title="Call" onPress={() => Linking.openURL(`tel:${c.phone}`)} /> : null}
              {c.email ? <Button small kind="secondary" title="Email" onPress={() => Linking.openURL(`mailto:${c.email}`)} /> : null}
              <Text style={[s.muted, { textDecorationLine: "underline", alignSelf: "center" }]}
                onPress={() => confirm(`Remove ${c.full_name}?`, "", async () => { await crm(`/contacts/${c.id}`, { method: "DELETE" }); refresh(); }, "Remove")}>remove</Text>
            </View>
          </View>
        ))}
        <AddPerson accountId={account.id} />
      </Card>

      <Card title="Log activity or add a follow-up">
        <LogActivity accountId={account.id} contacts={contacts} staff={staffList} />
      </Card>

      <Card title="Details" right={<Text style={{ color: C.brand, fontWeight: "600" }} onPress={() => { setEdit(!edit); setForm({}); }}>{edit ? "Cancel" : "Edit"}</Text>}>
        {edit ? (
          <View style={{ gap: 10 }}>
            <Field label="Name" value={value("name")} onChangeText={set("name")} />
            <Choice label="Type" options={KINDS} value={value("kind")} onChange={set("kind")} labels={KIND_LABEL} />
            <Field label="Website" value={value("website")} onChangeText={set("website")} autoCapitalize="none" />
            <Field label="Phone" value={value("phone")} onChangeText={set("phone")} keyboardType="phone-pad" />
            <Field label="City" value={value("city")} onChangeText={set("city")} />
            <Field label="State" value={value("state")} onChangeText={set("state")} />
            <Field label="Notes" value={value("notes")} onChangeText={set("notes")} multiline />
            <ErrorText error={saveError} />
            <Button title="Save" onPress={save} />
          </View>
        ) : (
          <Text>{account.notes || "No notes."}</Text>
        )}
      </Card>

      <Card title="History">
        <Timeline activities={activities} showDeal />
      </Card>

      <Button kind="secondary" title="Delete organization"
        onPress={() => confirm(`Delete ${account.name}?`, "Its people, deals and history go too.", async () => { await crm(`/accounts/${account.id}`, { method: "DELETE" }); refresh(); router.back(); })} />
    </Screen>
  );
}

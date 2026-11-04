import { useRouter } from "expo-router";
import { useState } from "react";
import { crm } from "@/api";
import { KIND_LABEL, KINDS } from "@/types";
import { Button, Choice, ErrorText, Field, Screen, useRefreshAll } from "@/ui";

export default function NewAccount() {
  const router = useRouter();
  const refresh = useRefreshAll();
  const [f, setF] = useState({ name: "", kind: "insurer", website: "", phone: "", city: "", state: "" });
  const [error, setError] = useState<unknown>(null);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  async function save() {
    setError(null);
    try {
      const { account } = await crm<{ account: { id: number } }>("/accounts", { method: "POST", body: { account: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v || null])) } });
      refresh();
      router.replace(`/account/${account.id}`);
    } catch (e) { setError(e); }
  }
  return (
    <Screen>
      <Field label="Name" value={f.name} onChangeText={set("name")} autoFocus />
      <Choice label="Type" options={KINDS} value={f.kind} onChange={set("kind")} labels={KIND_LABEL} />
      <Field label="Website" value={f.website} onChangeText={set("website")} autoCapitalize="none" />
      <Field label="Phone" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" />
      <Field label="City" value={f.city} onChangeText={set("city")} />
      <Field label="State" value={f.state} onChangeText={set("state")} />
      <ErrorText error={error} />
      <Button title="Add organization" onPress={save} disabled={!f.name.trim()} />
    </Screen>
  );
}

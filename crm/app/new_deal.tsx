import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { crm, dollarsToCents } from "@/api";
import { useAccounts } from "@/queries";
import { KIND_LABEL, KINDS, OPEN_STAGES, STAGE_LABEL, Stage } from "@/types";
import { Button, Choice, ErrorText, Field, Muted, Screen, useRefreshAll } from "@/ui";

const SOURCES = ["outbound", "website", "referral", "event", "partner", "other"] as const;

export default function NewDeal() {
  const router = useRouter();
  const refresh = useRefreshAll();
  const params = useLocalSearchParams<{ account?: string }>();
  const [search, setSearch] = useState("");
  const accounts = useAccounts(search).data?.accounts ?? [];
  const [accountId, setAccountId] = useState<string | null>(params.account ?? null);
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState("insurer");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<Stage>("lead");
  const [source, setSource] = useState<(typeof SOURCES)[number]>("outbound");
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      let id = accountId;
      if (!id) {
        const created = await crm<{ account: { id: number } }>("/accounts", { method: "POST", body: { account: { name: newName || search, kind: newKind } } });
        id = String(created.account.id);
      }
      const { deal } = await crm<{ deal: { id: number } }>("/deals", { method: "POST", body: { deal: {
        crm_account_id: id, name: name || `${accounts.find((a) => String(a.id) === id)?.name ?? newName} pilot`, stage, source,
        amount_cents: dollarsToCents(amount),
      } } });
      refresh();
      router.replace(`/deal/${deal.id}`);
    } catch (e) { setError(e); } finally { setBusy(false); }
  }

  const picked = accounts.find((a) => String(a.id) === accountId);
  return (
    <Screen>
      {params.account ? null : (
        <>
          <Field label="Organization" value={search} onChangeText={(v) => { setSearch(v); setAccountId(null); }} placeholder="Search, or type a new one" autoCorrect={false} />
          {!accountId && search ? (
            <Choice options={accounts.slice(0, 8).map((a) => String(a.id))} value={accountId} onChange={setAccountId}
              labels={Object.fromEntries(accounts.map((a) => [String(a.id), a.name]))} />
          ) : null}
          {picked ? <Muted>Deal for {picked.name}</Muted> : null}
          {!accountId && search ? (
            <>
              <Muted>Or add "{search}" as a new organization:</Muted>
              <Choice options={KINDS} value={newKind} onChange={(v) => { setNewKind(v); setNewName(search); }} labels={KIND_LABEL} />
            </>
          ) : null}
        </>
      )}
      <Field label="Deal name" value={name} onChangeText={setName} placeholder="Claims pilot" />
      <Field label="Annual value ($)" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="25,000" />
      <Choice label="Stage" options={OPEN_STAGES} value={stage} onChange={setStage} labels={STAGE_LABEL} />
      <Choice label="Source" options={SOURCES} value={source} onChange={setSource} />
      <ErrorText error={error} />
      <Button title={busy ? "Adding…" : "Add deal"} onPress={save} disabled={busy || (!accountId && !(newName || search))} />
    </Screen>
  );
}

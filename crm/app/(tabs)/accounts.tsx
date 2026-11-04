import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { money } from "@/api";
import { useAccounts } from "@/queries";
import { KIND_LABEL } from "@/types";
import { Button, Card, ErrorText, Field, Muted, Row, Screen } from "@/ui";

export default function Accounts() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const { data, error, refetch } = useAccounts(q);
  return (
    <Screen onRefresh={refetch}>
      <Stack.Screen options={{ headerRight: () => <View style={{ marginRight: 12 }}><Button small title="+ New" onPress={() => router.push("/new_account")} /></View> }} />
      <Field label="Search" value={q} onChangeText={setQ} placeholder="Organization name" autoCorrect={false} clearButtonMode="while-editing" />
      <ErrorText error={error} />
      <Card>
        {(data?.accounts ?? []).map((a) => (
          <Row key={a.id} title={a.name}
            subtitle={[KIND_LABEL[a.kind] ?? a.kind, [a.city, a.state].filter(Boolean).join(", "), `${a.contacts_count ?? 0} people`, `${a.open_deals_count ?? 0} open deals`].filter(Boolean).join(" · ")}
            right={a.open_pipeline_cents ? <Text style={{ fontWeight: "700" }}>{money(a.open_pipeline_cents)}</Text> : undefined}
            onPress={() => router.push(`/account/${a.id}`)} />
        ))}
        {data && data.accounts.length === 0 ? <Muted>No organizations found.</Muted> : null}
      </Card>
    </Screen>
  );
}

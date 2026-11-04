import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { money, shortDate } from "@/api";
import { useDeals } from "@/queries";
import { KIND_LABEL, OPEN_STAGES, STAGE_LABEL, Stage, STAGES } from "@/types";
import { Button, Card, Choice, ErrorText, Muted, Row, Screen, s } from "@/ui";

// Deals by stage. Tap a stage to see its deals; tap a deal to move it, log a call, or mark it won or lost.
export default function Pipeline() {
  const router = useRouter();
  const { data, error, refetch } = useDeals();
  const [stage, setStage] = useState<Stage>("lead");
  const deals = data?.deals ?? [];
  const open = deals.filter((d) => OPEN_STAGES.includes(d.stage));
  const inStage = deals.filter((d) => d.stage === stage);
  const counts = Object.fromEntries(STAGES.map((st) => [st, `${STAGE_LABEL[st]} ${deals.filter((d) => d.stage === st).length}`]));

  return (
    <Screen onRefresh={refetch}>
      <Stack.Screen options={{ headerRight: () => <View style={{ marginRight: 12 }}><Button small title="+ Deal" onPress={() => router.push("/new_deal")} /></View> }} />
      <ErrorText error={error} />
      <Text style={s.muted}>{open.length} open deals · {money(open.reduce((n, d) => n + d.amount_cents, 0))}</Text>
      <Choice options={STAGES} value={stage} onChange={setStage} labels={counts} />
      <Card title={`${STAGE_LABEL[stage]} · ${money(inStage.reduce((n, d) => n + d.amount_cents, 0))}`}>
        {inStage.map((d) => (
          <Row key={d.id} title={d.name}
            subtitle={[`${d.account.name} · ${KIND_LABEL[d.account.kind] ?? d.account.kind}`, d.owner?.name, d.close_on ? `closes ${shortDate(d.close_on)}` : null].filter(Boolean).join(" · ")}
            right={<Text style={{ fontWeight: "700" }}>{d.amount_cents ? money(d.amount_cents) : "—"}</Text>}
            onPress={() => router.push(`/deal/${d.id}`)} />
        ))}
        {data && inStage.length === 0 ? <Muted>No deals in this stage.</Muted> : null}
      </Card>
    </Screen>
  );
}

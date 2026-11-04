import { useRouter } from "expo-router";
import { Linking, Text, View } from "react-native";
import { shortDate, staff } from "@/api";
import { useDemoRequests } from "@/queries";
import { Button, C, Card, ErrorText, Muted, Screen, s, useRefreshAll } from "@/ui";

export default function DemoRequests() {
  const router = useRouter();
  const refresh = useRefreshAll();
  const { data, error, refetch } = useDemoRequests();
  async function convert(id: number) {
    const result = await staff<{ deal_id: number }>(`/demo_requests/${id}/convert`, { method: "POST" });
    refresh();
    router.push(`/deal/${result.deal_id}`);
  }
  return (
    <Screen onRefresh={refetch}>
      <Muted>From the Request a Demo form on recordspeed.com.</Muted>
      <ErrorText error={error} />
      {(data?.demo_requests ?? []).map((r) => (
        <Card key={r.id} title={`${r.status} · ${shortDate(r.created_at)}`}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>{r.name}{r.organization ? <Text style={s.muted}> · {r.organization}</Text> : null}</Text>
          {r.role ? <Muted>{r.role}</Muted> : null}
          {r.message ? <Text style={{ color: C.ink }}>{r.message}</Text> : null}
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <Button small kind="secondary" title="Email" onPress={() => Linking.openURL(`mailto:${r.email}`)} />
            {r.phone ? <Button small kind="secondary" title="Call" onPress={() => Linking.openURL(`tel:${r.phone}`)} /> : null}
            {r.deal_id ? <Button small title="View deal" onPress={() => router.push(`/deal/${r.deal_id}`)} /> : <Button small title="Create deal" onPress={() => convert(r.id)} />}
          </View>
        </Card>
      ))}
      {data && data.demo_requests.length === 0 ? <Muted>No demo requests yet.</Muted> : null}
    </Screen>
  );
}

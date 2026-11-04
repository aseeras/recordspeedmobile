import { Text, View } from "react-native";
import { money } from "@/api";
import { useReport } from "@/queries";
import { KIND_LABEL, STAGE_LABEL } from "@/types";
import { C, Card, ErrorText, Loading, Screen, Stat, s } from "@/ui";

// One series per chart, one hue, value written at the end of each bar.
function Bars({ rows, format }: { rows: { label: string; value: number; note?: string }[]; format: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <View style={{ gap: 8 }}>
      {rows.map((r) => (
        <View key={r.label} style={{ gap: 3 }} accessible accessibilityLabel={`${r.label}: ${format(r.value)}${r.note ? `, ${r.note}` : ""}`}>
          <Text style={{ fontSize: 14, color: C.ink }}>{r.label}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ height: 10, width: `${Math.max(r.value ? 2 : 0, (r.value / max) * 70)}%`, backgroundColor: "#2F6FD6", borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
            <Text style={{ fontSize: 13, color: C.ink }}>{format(r.value)}{r.note ? <Text style={s.muted}> · {r.note}</Text> : null}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function Reports() {
  const { data, error, refetch } = useReport();
  if (!data) return error ? <Screen><ErrorText error={error} /></Screen> : <Loading />;
  const t = data.totals;
  const lead = data.funnel[0]?.count ?? 0;
  return (
    <Screen onRefresh={refetch}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <Stat label={`Open pipeline · ${t.open_count}`} value={money(t.open_cents)} />
        <Stat label={`Won · ${t.won_count}`} value={money(t.won_cents)} />
        <Stat label={`Win rate (of ${t.won_count + t.lost_count} closed)`} value={t.win_rate === null ? "—" : `${Math.round(t.win_rate * 100)}%`} />
        <Stat label="Overdue follow-ups" value={data.open_tasks.overdue} />
      </View>
      <Card title="Pipeline value by stage">
        <Bars format={money} rows={data.by_stage.filter((x) => x.stage !== "lost").map((x) => ({ label: STAGE_LABEL[x.stage], value: x.amount_cents, note: `${x.count} deal${x.count === 1 ? "" : "s"}` }))} />
      </Card>
      <Card title="How far deals get">
        <Bars format={(n) => String(n)} rows={data.funnel.map((f) => ({ label: STAGE_LABEL[f.stage], value: f.count, note: lead ? `${Math.round((f.count / lead) * 100)}%` : undefined }))} />
      </Card>
      <Card title="By type of organization">
        {data.by_kind.map((r) => (
          <View key={r.key} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
            <Text>{KIND_LABEL[r.key] ?? r.key}</Text>
            <Text style={s.muted}>{r.open_count} open · {money(r.open_cents)} · {r.won_count} won</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

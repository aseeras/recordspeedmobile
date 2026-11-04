import { useRouter } from "expo-router";
import { View } from "react-native";
import { money, shortDate, today } from "@/api";
import { useAuth } from "@/auth";
import { useFollowUps, useProjects, useReport } from "@/queries";
import { C, Card, ErrorText, Muted, Row, Screen, Stat } from "@/ui";

// The day at a glance: sales numbers, my follow-ups, and my project tasks due soon.
export default function Home() {
  const router = useRouter();
  const { account } = useAuth();
  const report = useReport();
  const followUps = useFollowUps(true);
  const projects = useProjects();
  const t = report.data?.totals;
  const now = today();
  const myTasks = (projects.data?.projects ?? [])
    .flatMap((p) => p.tasks.filter((x) => !x.completed && x.assignee && account && x.assignee.toLowerCase().includes(account.firstName.toLowerCase())).map((x) => ({ ...x, project: p })))
    .sort((a, b) => (a.due_on ?? "9999").localeCompare(b.due_on ?? "9999"))
    .slice(0, 8);

  return (
    <Screen onRefresh={() => Promise.all([report.refetch(), followUps.refetch(), projects.refetch()])}>
      <ErrorText error={report.error} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <Stat label={`Open pipeline · ${t?.open_count ?? 0} deals`} value={money(t?.open_cents ?? 0)} onPress={() => router.navigate("/pipeline")} />
        <Stat label="Overdue follow-ups" value={report.data?.open_tasks.overdue ?? 0} tone={(report.data?.open_tasks.overdue ?? 0) > 0 ? C.danger : undefined} onPress={() => router.navigate("/followups")} />
        <Stat label="Due today" value={report.data?.open_tasks.due_today ?? 0} onPress={() => router.navigate("/followups")} />
        <Stat label={`Won · ${t?.won_count ?? 0} deals`} value={money(t?.won_cents ?? 0)} onPress={() => router.push("/reports")} />
      </View>

      <Card title="My follow-ups">
        {(followUps.data?.tasks ?? []).slice(0, 6).map((f) => (
          <Row key={f.id} title={f.subject}
            subtitle={[f.deal?.name ?? f.account?.name, f.due_on ? `due ${shortDate(f.due_on)}${f.due_on < now ? " · overdue" : ""}` : null].filter(Boolean).join(" · ")}
            onPress={() => f.deal ? router.push(`/deal/${f.deal.id}`) : f.account && router.push(`/account/${f.account.id}`)} />
        ))}
        {followUps.data && followUps.data.tasks.length === 0 ? <Muted>Nothing to follow up on.</Muted> : null}
      </Card>

      <Card title="My project tasks">
        {myTasks.map((x) => (
          <Row key={x.gid} title={x.name} subtitle={`${x.project.name}${x.due_on ? ` · due ${shortDate(x.due_on)}` : ""}`} onPress={() => router.push(`/project/${x.project.gid}`)} />
        ))}
        {projects.data && myTasks.length === 0 ? <Muted>No open project tasks assigned to you.</Muted> : null}
        {projects.data && !projects.data.connected ? <Muted>Asana isn't connected.</Muted> : null}
      </Card>
    </Screen>
  );
}

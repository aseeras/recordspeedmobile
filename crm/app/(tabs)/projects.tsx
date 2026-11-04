import { useRouter } from "expo-router";
import { Text } from "react-native";
import { useProjects } from "@/queries";
import { Card, ErrorText, Muted, Row, Screen } from "@/ui";

// The team's projects in Asana (Business Setup, Admin & Compliance, ...).
export default function Projects() {
  const router = useRouter();
  const { data, error, refetch } = useProjects();
  return (
    <Screen onRefresh={refetch}>
      <ErrorText error={error} />
      {data && !data.connected ? <Muted>Asana isn't connected yet.</Muted> : null}
      <Card>
        {(data?.projects ?? []).map((p) => {
          const open = p.tasks.filter((t) => !t.completed).length;
          return (
            <Row key={p.gid} title={p.name} subtitle={`${open} open · ${p.tasks.length - open} done`}
              right={<Text style={{ fontWeight: "700" }}>{open}</Text>} onPress={() => router.push(`/project/${p.gid}`)} />
          );
        })}
      </Card>
      <Muted>Changes here go straight to Asana, so they show in Asana and the staff portal too.</Muted>
    </Screen>
  );
}

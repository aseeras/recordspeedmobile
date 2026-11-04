import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { shortDate, today } from "@/api";
import { TaskCheck } from "@/activity";
import { useFollowUps } from "@/queries";
import type { CrmActivity } from "@/types";
import { Card, Choice, ErrorText, Muted, Row, Screen } from "@/ui";

export default function FollowUps() {
  const router = useRouter();
  const [who, setWho] = useState<"mine" | "all">("mine");
  const { data, error, refetch } = useFollowUps(who === "mine");
  const now = today();
  const tasks = data?.tasks ?? [];
  const groups: [string, CrmActivity[]][] = [
    ["Overdue", tasks.filter((t) => t.due_on !== null && t.due_on < now)],
    ["Today", tasks.filter((t) => t.due_on === now)],
    ["Coming up", tasks.filter((t) => t.due_on !== null && t.due_on > now)],
    ["No date", tasks.filter((t) => t.due_on === null)],
  ];
  return (
    <Screen onRefresh={refetch}>
      <Choice options={["mine", "all"] as const} value={who} onChange={setWho} labels={{ mine: "Mine", all: "Everyone's" }} />
      <ErrorText error={error} />
      {data && tasks.length === 0 ? <Muted>Nothing to follow up on. Add follow-ups from a deal or account.</Muted> : null}
      {groups.filter(([, list]) => list.length > 0).map(([title, list]) => (
        <Card key={title} title={`${title} · ${list.length}`}>
          {list.map((t) => (
            <View key={t.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TaskCheck task={t} />
              <View style={{ flex: 1 }}>
                <Row title={t.subject}
                  subtitle={[t.deal?.name ?? t.account?.name, t.due_on ? shortDate(t.due_on) : null, who === "all" ? t.assignee?.name : null].filter(Boolean).join(" · ")}
                  onPress={() => (t.deal ? router.push(`/deal/${t.deal.id}`) : t.account ? router.push(`/account/${t.account.id}`) : undefined)} />
              </View>
            </View>
          ))}
        </Card>
      ))}
    </Screen>
  );
}

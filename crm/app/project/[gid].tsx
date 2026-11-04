import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { shortDate, staff, today } from "@/api";
import { useProjects } from "@/queries";
import type { AsanaTask } from "@/types";
import { Button, C, Card, Choice, ErrorText, Field, Loading, Muted, Screen, s, useRefreshAll } from "@/ui";

function TaskRow({ task }: { task: AsanaTask }) {
  const refresh = useRefreshAll();
  const [busy, setBusy] = useState(false);
  const overdue = !task.completed && task.due_on !== null && task.due_on < today();
  async function toggle() {
    setBusy(true);
    try { await staff(`/tasks/${task.gid}`, { method: "PATCH", body: { completed: !task.completed } }); await refresh(); } finally { setBusy(false); }
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: C.line }}>
      <Pressable onPress={toggle} disabled={busy} hitSlop={10} accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }}>
        <Ionicons name={task.completed ? "checkmark-circle" : "ellipse-outline"} size={26} color={task.completed ? C.success : C.muted} />
      </Pressable>
      <Pressable style={{ flex: 1 }} onPress={() => task.url && Linking.openURL(task.url)}>
        <Text style={[{ fontSize: 15, fontWeight: "600", color: C.ink }, task.completed && { textDecorationLine: "line-through", color: C.muted }]}>{task.name}</Text>
        {(task.assignee || task.due_on) ? (
          <Text style={[s.muted, overdue && { color: C.danger, fontWeight: "700" }]}>
            {[task.assignee ?? "Unassigned", task.due_on ? `due ${shortDate(task.due_on)}` : null].filter(Boolean).join(" · ")}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

export default function Project() {
  const { gid } = useLocalSearchParams<{ gid: string }>();
  const { data, refetch } = useProjects();
  const refresh = useRefreshAll();
  const project = data?.projects.find((p) => p.gid === gid);
  const [showDone, setShowDone] = useState(false);
  const [name, setName] = useState("");
  const [section, setSection] = useState<string | null>(null);
  const [assignee, setAssignee] = useState<string | null>(null);
  const [due, setDue] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  if (!data) return <Loading />;
  if (!project) return <Screen><Muted>Project not found.</Muted></Screen>;
  const users = (data.users ?? []).filter((u) => u.email);

  async function add() {
    setBusy(true);
    setError(null);
    try {
      await staff("/tasks", { method: "POST", body: { project_gid: project!.gid, name, section_gid: section ? project!.section_gids[section] : null, assignee, due_on: due || null } });
      setName(""); setDue("");
      await refresh();
    } catch (e) { setError(e); } finally { setBusy(false); }
  }

  return (
    <Screen onRefresh={refetch}>
      <Stack.Screen options={{ title: project.name }} />
      <Choice options={["open", "all"] as const} value={showDone ? "all" : "open"} onChange={(v) => setShowDone(v === "all")} labels={{ open: "Open", all: "Show finished" }} />
      {project.sections.map((sec) => {
        const tasks = project.tasks.filter((t) => t.section === sec && (showDone || !t.completed));
        if (tasks.length === 0) return null;
        return <Card key={sec} title={sec}>{tasks.map((t) => <TaskRow key={t.gid} task={t} />)}</Card>;
      })}
      <Card title="Add a task">
        <Field label="Task" value={name} onChangeText={setName} placeholder="File the Articles of Organization" />
        <Choice label="Section" options={project.sections} value={section} onChange={(v) => setSection(v === section ? null : v)} />
        <Choice label="Assign to" options={users.map((u) => u.email!)} value={assignee} onChange={(v) => setAssignee(v === assignee ? null : v)}
          labels={Object.fromEntries(users.map((u) => [u.email!, u.name.includes("@") ? u.name.split("@")[0] : u.name]))} />
        <Field label="Due (YYYY-MM-DD)" value={due} onChangeText={setDue} placeholder={today()} autoCorrect={false} />
        <ErrorText error={error} />
        <Button title={busy ? "Adding…" : "Add task"} onPress={add} disabled={busy || !name.trim()} />
      </Card>
      {project.url ? <Button kind="secondary" title="Open in Asana" onPress={() => Linking.openURL(project.url!)} /> : null}
    </Screen>
  );
}

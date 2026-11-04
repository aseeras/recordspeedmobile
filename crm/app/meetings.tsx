import { useRouter } from "expo-router";
import { Linking } from "react-native";
import { isLive, meetingLabel, when } from "@/meetings";
import { useMeetings } from "@/queries";
import { Button, Card, ErrorText, Muted, Row, Screen } from "@/ui";

export default function Meetings() {
  const router = useRouter();
  const { data, error, refetch } = useMeetings();
  const all = data?.meetings ?? [];
  const review = all.filter((m) => m.suggestions_status === "pending" || (m.status === "transcribed" && m.suggestions_status === "none"));
  const upcoming = all.filter((m) => isLive(m)).reverse();
  const past = all.filter((m) => !review.includes(m) && !upcoming.includes(m));
  const list = (items: typeof all) => items.map((m) => (
    <Row key={m.id} title={m.title} subtitle={`${m.account.name} · ${when(m.starts_at)} · ${meetingLabel(m)}`} onPress={() => router.push(`/meeting/${m.id}`)}
      right={isLive(m) && m.meet_url ? <Button small title="Join" onPress={() => Linking.openURL(m.meet_url!)} /> : undefined} />
  ));
  return (
    <Screen onRefresh={refetch}>
      <ErrorText error={error} />
      {review.length ? <Card title="To review">{list(review)}</Card> : null}
      <Card title="Upcoming">{upcoming.length ? list(upcoming) : <Muted>No upcoming meetings.</Muted>}</Card>
      <Card title="Past">{past.length ? list(past) : <Muted>No past meetings.</Muted>}</Card>
      <Muted>Schedule a meeting from a deal or an account.</Muted>
    </Screen>
  );
}

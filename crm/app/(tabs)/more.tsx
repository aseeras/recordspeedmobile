import { useRouter } from "expo-router";
import { Linking } from "react-native";
import { useAuth } from "@/auth";
import { useDemoRequests } from "@/queries";
import { Button, Card, Muted, Row, Screen, confirm } from "@/ui";

export default function More() {
  const router = useRouter();
  const { account, signOut } = useAuth();
  const demo = useDemoRequests();
  const fresh = (demo.data?.demo_requests ?? []).filter((d) => d.status === "new").length;
  return (
    <Screen>
      <Card>
        <Row title="Meetings" subtitle="Google Meet calls, transcripts and updates to review" onPress={() => router.push("/meetings")} />
        <Row title="Sales reports" subtitle="Pipeline, wins, win rate, by type" onPress={() => router.push("/reports")} />
        <Row title="Demo requests" subtitle={fresh ? `${fresh} new from the website` : "From the website"} onPress={() => router.push("/demo_requests")} />
        <Row title="Staff portal" subtitle="portal.recordspeed.com/staff" onPress={() => Linking.openURL("https://portal.recordspeed.com/staff")} />
        <Row title="Gmail" onPress={() => Linking.openURL("https://mail.google.com/a/recordspeed.com")} />
        <Row title="Google Calendar" onPress={() => Linking.openURL("https://calendar.google.com/a/recordspeed.com")} />
        <Row title="Google Drive" onPress={() => Linking.openURL("https://drive.google.com/a/recordspeed.com")} />
      </Card>
      <Muted>Signed in as {account?.email}</Muted>
      <Button kind="secondary" title="Sign out" onPress={() => confirm("Sign out?", "You'll need your password and code to sign back in.", signOut, "Sign out")} />
    </Screen>
  );
}

import * as Clipboard from "expo-clipboard";
import { Redirect } from "expo-router";
import { useState } from "react";
import { Linking, Text, View } from "react-native";
import { useAuth } from "@/auth";
import { pendingChallenge } from "@/challenge";
import { Button, Card, ErrorText, Field, Screen, s } from "@/ui";

const groupKey = (key = "") => key.replace(/(.{4})/g, "$1 ").trim();

// The code from an authenticator app (Apple Passwords, Google Authenticator, ...). The first time, it's set up here:
// "Add to Passwords" hands the setup link to the iPhone, or the key can be typed in.
export default function TwoFactor() {
  const { verifyCode } = useAuth();
  const challenge = pendingChallenge.current;
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  if (!challenge) return <Redirect href="/sign_in" />;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await verifyCode(challenge!.ticket, code);
      pendingChallenge.current = null;
    } catch (e) {
      setError(e);
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      {challenge.setup && (
        <Card title="Set up two-step sign-in">
          <Text>Add RecordSpeed to your authenticator app, then enter the 6-digit code it shows.</Text>
          {challenge.uri ? <Button title="Add to Passwords / authenticator" onPress={() => Linking.openURL(challenge.uri!)} /> : null}
          {challenge.secret ? (
            <View style={{ gap: 6 }}>
              <Text style={s.muted}>Or type this setup key into the app:</Text>
              <Text selectable style={{ fontFamily: "Courier", fontSize: 16, letterSpacing: 1 }}>{groupKey(challenge.secret)}</Text>
              <Button title="Copy key" kind="secondary" small onPress={() => Clipboard.setStringAsync(challenge.secret!)} />
            </View>
          ) : null}
        </Card>
      )}
      <Field label="6-digit code (or a recovery code)" value={code} onChangeText={setCode} keyboardType="number-pad" textContentType="oneTimeCode"
        autoComplete="one-time-code" autoFocus onSubmitEditing={submit} />
      <ErrorText error={error} />
      <Button title={busy ? "Checking…" : "Continue"} onPress={submit} disabled={busy || code.trim().length < 6} />
    </Screen>
  );
}

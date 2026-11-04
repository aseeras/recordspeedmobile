import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/auth";
import { pendingChallenge } from "@/challenge";
import { Button, C, ErrorText, Field, s } from "@/ui";

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const result = await signIn(email, password);
      if (result.kind === "two_factor") {
        pendingChallenge.current = result.challenge;
        router.push("/two_factor");
      }
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
        <View style={{ alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Image source={require("../assets/logo.png")} style={{ width: 64, height: 64 }} resizeMode="contain" accessibilityIgnoresInvertColors />
          <Text style={[s.h1, { fontSize: 28 }]}>RecordSpeed CRM</Text>
          <Text style={[s.muted, { textAlign: "center" }]}>For the RecordSpeed team. Sign in with your staff account.</Text>
        </View>
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
          textContentType="username" autoComplete="email" placeholder="you@recordspeed.com" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry textContentType="password" autoComplete="password"
          onSubmitEditing={submit} returnKeyType="go" />
        <ErrorText error={error} />
        <Button title={busy ? "Signing in…" : "Sign in"} onPress={submit} disabled={busy || !email || !password} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

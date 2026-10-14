import Button from "@/components/Button";
import ToastPlaceholder, { Toast } from "@/components/Toast";
import { useTwoFactorChallenge, useTwoFactorSignIn } from "@/lib/auth/hooks";
import * as Clipboard from "expo-clipboard";
import { Redirect, Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { t } from "@/lib/i18n";

// Groups the key in fours so it's easier to type into an app.
const groupKey = (key = "") => key.replace(/(.{4})/g, "$1 ").trim();

// Step two of signing in, for attorneys: the code from an authenticator app. The first time, set the app up.
export default function TwoFactor() {
  const router = useRouter();
  const { data: challenge, isLoading } = useTwoFactorChallenge();
  const { mutateAsync: verify, isPending } = useTwoFactorSignIn();
  const [code, setCode] = useState("");

  if (isLoading) return null;
  if (!challenge) return <Redirect href="/sign_in" />;
  const setup = challenge.setup;

  async function addToAuthenticator() {
    try {
      await Linking.openURL(challenge!.uri!);
    } catch {
      Toast.show({
        type: "error",
        text1: t("No authenticator app found"),
        text2: t("Install one from the App Store, or copy the key into it."),
      });
    }
  }

  async function submit() {
    try {
      const account = await verify({ ticket: challenge!.ticket, code: code.trim() });
      router.dismissAll();
      setTimeout(() => {
        if (setup) {
          router.push("/recovery_codes");
        } else {
          router.push("/home");
          Toast.show({ type: "success", text1: t("Welcome back {name}", { name: account.fullName }) });
        }
      }, 0);
    } catch (error: any) {
      setCode("");
      const message = error?.message ?? t("That code isn't right.");
      Toast.show({ type: "error", text1: message });
      if (/expired|sign in again/i.test(message)) router.replace("/sign_in");
    }
  }

  return (
    <View className="flex h-full bg-white px-8 pb-6">
      <Stack.Screen options={{ headerStyle: { backgroundColor: "white" } }} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ gap: 16 }}>
          {setup ? (
            <>
              <Text className="text-3xl font-bold text-ink">{t("Set up two-step sign-in")}</Text>
              <Text className="text-base text-gray-700">{t("To protect your clients' records, signing in needs a code from an authenticator app as well as your password.")}</Text>
              <Text className="text-base text-gray-700">{t("1. Install an authenticator app if you don't have one, such as Google Authenticator, Microsoft Authenticator or 1Password.")}</Text>
              <Text className="text-base text-gray-700">{t("2. Add RecordSpeed to it:")}</Text>
              <View className="h-12">
                <Button text={t("Add to authenticator app")} onPress={addToAuthenticator} />
              </View>
              <Text className="text-sm text-gray-700">{t("Or enter this key in the app:")}</Text>
              <Text selectable className="text-lg font-semibold text-ink" testID="two-factor-secret">
                {groupKey(challenge.secret)}
              </Text>
              <View className="h-12">
                <Button
                  secondary
                  text={t("Copy key")}
                  onPress={async () => {
                    await Clipboard.setStringAsync(challenge.secret ?? "");
                    Toast.show({ type: "success", text1: t("Key copied") });
                  }}
                />
              </View>
              <Text className="text-base text-gray-700">{t("3. Enter the 6-digit code the app shows for RecordSpeed:")}</Text>
            </>
          ) : (
            <>
              <Text className="text-3xl font-bold text-ink">{t("Enter your code")}</Text>
              <Text className="text-base text-gray-700">{t("Open your authenticator app and enter the 6-digit code for RecordSpeed.")}</Text>
            </>
          )}

          <TextInput
            testID="two-factor-code"
            accessibilityLabel={setup ? "6-digit code" : "6-digit code or a recovery code"}
            placeholder={setup ? "6-digit code" : "6-digit code or recovery code"}
            value={code}
            onChangeText={setCode}
            keyboardType={setup ? "number-pad" : "default"}
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={setup ? 6 : 11}
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg text-ink"
          />
          <View className="h-12">
            <Button
              text={isPending ? "Checking..." : setup ? "Turn on and sign in" : "Sign in"}
              buttonStyle={isPending || code.trim().length < 6 ? "disabled" : "primary"}
              onPress={submit}
            />
          </View>
          {!setup && (
            <Text className="text-sm text-gray-700">{t("Lost your phone? Enter one of the recovery codes you saved when you set this up. If you don't have them, email support@recordspeed.com.")}</Text>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
      <ToastPlaceholder />
    </View>
  );
}

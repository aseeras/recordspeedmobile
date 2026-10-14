import Button from "@/components/Button";
import { Toast } from "@/components/Toast";
import { RECOVERY_CODES_KEY, useRecoveryCodes } from "@/lib/auth/hooks";
import { useQueryClient } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { Redirect, Stack, useRouter } from "expo-router";
import { ScrollView, Share, Text, View } from "react-native";
import { t } from "@/lib/i18n";

// Shown once, right after two-step sign-in is turned on.
export default function RecoveryCodes() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: codes, isLoading } = useRecoveryCodes();

  if (isLoading) return null;
  if (!codes) return <Redirect href="/home" />;
  const text = `RecordSpeed recovery codes\n\nEach code works once, if you can't use your authenticator app.\n\n${codes.join("\n")}\n`;

  return (
    <View className="flex h-full bg-white px-8 pb-6">
      <Stack.Screen options={{ headerStyle: { backgroundColor: "white" } }} />
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <Text className="text-3xl font-bold text-ink">{t("Two-step sign-in is on")}</Text>
        <Text className="text-base text-gray-700">{t("Save these recovery codes somewhere safe, like a password manager. If you lose your phone, each code lets you sign in once. They won't be shown again.")}</Text>
        <View testID="recovery-codes" style={{ gap: 6 }}>
          {codes.map((code) => (
            <Text key={code} selectable className="text-lg font-mono text-ink">
              {code}
            </Text>
          ))}
        </View>
        <View className="h-12">
          <Button secondary text={t("Save or share codes")} onPress={() => Share.share({ message: text })} />
        </View>
        <View className="h-12">
          <Button
            secondary
            text={t("Copy codes")}
            onPress={async () => {
              await Clipboard.setStringAsync(text);
              Toast.show({ type: "success", text1: t("Codes copied") });
            }}
          />
        </View>
        <View className="h-12">
          <Button
            text={t("I've saved them, continue")}
            onPress={() => {
              queryClient.removeQueries({ queryKey: RECOVERY_CODES_KEY });
              router.dismissAll();
              setTimeout(() => router.push("/home"), 0);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

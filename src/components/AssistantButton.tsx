import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { canTalk } from "@/lib/assistant/listen";
import { t } from "@/lib/i18n";

// Floating button that opens the RecordSpeed assistant from any home screen, with a Talk button beside it on
// iPhones that can recognise speech on the device.
export default function AssistantButton() {
  const pathname = usePathname();
  const [talkable] = useState(canTalk);
  const openAssistant = (talk: boolean) =>
    router.push({ pathname: "/assistant", params: talk ? { from: pathname, talk: "1" } : { from: pathname } });
  return (
    <View
      className="absolute left-5 bottom-9 h-14 p-1 rounded-full bg-indigo-600 flex-row items-center shadow-lg"
      style={{ elevation: 6, gap: 4 }}
    >
      {talkable && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("Talk to us")}
          onPress={() => openAssistant(true)}
          className="h-12 px-4 rounded-full flex-row items-center overflow-hidden"
        >
          <LinearGradient colors={["#00C8FF", "#4F46E5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", inset: 0 }} />
          <Text className="text-white text-base font-semibold">{t("🎙️ Talk")}</Text>
        </Pressable>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("Ask the RecordSpeed assistant")}
        onPress={() => openAssistant(false)}
        className="h-12 px-4 rounded-full flex-row items-center"
      >
        <Text className="text-white text-base font-semibold">{t("💬 Ask")}</Text>
      </Pressable>
    </View>
  );
}

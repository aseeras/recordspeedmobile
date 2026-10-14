import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAccountCredentials } from "@/lib/auth/hooks";
import { askAssistant, AssistantMessage, AssistantSuggestion } from "@/lib/assistant/request";
import { t } from "@/lib/i18n";

// Screens the assistant may suggest, per account type, mapped to app routes.
const SCREENS: Record<string, Record<string, string>> = {
  patient: {
    my_requests: "/home/patient",
    new_request: "/home/patient/submitMedicalRecordRequest",
    mychart: "/home/patient/connectMyChart",
    contacts: "/home/patient/contacts",
    profile: "/home/patient/profile",
    delete_account: "/home/patient/deleteAccount",
    access_log: "/home/patient/accessLog",
  },
  attorney: {
    shared_with_me: "/home/attorney",
    prospects: "/home/attorney/prospects",
    plan: "/home/attorney/plan",
    profile: "/home/attorney/profile",
    delete_account: "/home/attorney/deleteAccount",
  },
};

const STARTERS: Record<string, string[]> = {
  patient: ["Where is my request?", "How do I get records from MyChart?", "Who have I shared with?"],
  attorney: ["What has been shared with me?", "What plan am I on?", "How do prospects work?"],
};

type Entry = AssistantMessage & { suggestions?: AssistantSuggestion[]; error?: boolean };

// The RecordSpeed assistant: answers questions and looks up the user's own requests, shares and plan (read-only).
export default function AssistantScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { data: credentials } = useAccountCredentials();
  const type = credentials?.type === "attorney" ? "attorney" : "patient";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollView>(null);

  // The screen fills the whole display, so lifting the content by the keyboard's height keeps the question
  // box just above the keyboard. Android resizes the window on its own.
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    const show = Keyboard.addListener("keyboardWillShow", (e) => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener("keyboardWillHide", () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  }, [entries, busy, keyboardHeight]);

  async function ask(text: string) {
    const question = text.trim();
    if (!question || busy || !credentials?.authToken) return;
    const history: AssistantMessage[] = [
      ...entries.filter((e) => !e.error).map(({ role, content }) => ({ role, content })),
      { role: "user", content: question },
    ];
    setEntries((prev) => [...prev, { role: "user", content: question }]);
    setDraft("");
    setBusy(true);
    try {
      const reply = await askAssistant({ authToken: credentials.authToken, messages: history, screen: from });
      const suggestions = reply.suggestions.filter((s) => SCREENS[type][s.target]);
      setEntries((prev) => [...prev, { role: "assistant", content: reply.message, suggestions }]);
    } catch (error) {
      setEntries((prev) => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], error: true },
        { role: "assistant", content: `${error.message ?? error} You can also email contact@recordspeed.com.`, error: true },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function open(target: string) {
    router.dismiss();
    router.replace(SCREENS[type][target] as Href);
  }

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: keyboardHeight > 0 ? keyboardHeight : insets.bottom }}
    >
      <View className="flex-row items-center px-5 pt-3 pb-3 border-b border-gray-200">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{t("RecordSpeed assistant")}</Text>
          <Text className="text-xs text-gray-500">{t("AI · can look up your account, read-only")}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={t("Close")} onPress={() => router.dismiss()} className="w-10 h-10 items-center justify-center rounded-lg border border-gray-300">
          <Text className="text-base text-gray-700">✕</Text>
        </Pressable>
      </View>

      <ScrollView ref={scroll} className="flex-1" contentContainerStyle={{ padding: 16, gap: 10 }} keyboardShouldPersistTaps="handled">
        {entries.length === 0 && (
          <>
            <View className="self-start max-w-[88%] rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2">
              <Text className="text-base text-gray-900">{t("Hi! I can explain how RecordSpeed works and look things up in your account. What can I help with?")}</Text>
            </View>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {STARTERS[type].map((q) => (
                <Pressable key={q} onPress={() => ask(q)} className="rounded-full border border-indigo-300 px-3 py-2">
                  <Text className="text-sm text-indigo-700">{q}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        {entries.map((e, i) => (
          <View key={i} className={e.role === "user" ? "self-end max-w-[88%]" : "self-start max-w-[88%]"}>
            <View
              className={
                e.role === "user"
                  ? "rounded-2xl rounded-br-sm bg-indigo-600 px-3 py-2"
                  : e.error
                    ? ""
                    : "rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2"
              }
            >
              <Text className={e.role === "user" ? "text-base text-white" : e.error ? "text-sm text-red-600" : "text-base text-gray-900"}>
                {e.content}
              </Text>
            </View>
            {!!e.suggestions?.length && (
              <View className="flex-row flex-wrap mt-2" style={{ gap: 8 }}>
                {e.suggestions.map((s) => (
                  <Pressable key={s.target} onPress={() => open(s.target)} className="rounded-full border border-indigo-600 px-3 py-2">
                    <Text className="text-sm font-medium text-indigo-700">{s.label || s.target}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
        {busy && (
          <View className="self-start flex-row items-center" style={{ gap: 6 }}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text className="text-sm text-gray-500">{t("Thinking…")}</Text>
          </View>
        )}
      </ScrollView>

      <Text className="text-[11px] text-gray-400 px-4 pt-2 border-t border-gray-200">{t("AI can make mistakes. It can't make changes to your account.")}</Text>
      <View className="flex-row items-end px-3 pt-2 pb-3" style={{ gap: 8 }}>
        {/* Plain styles, not classes, so the typed text always has a visible color and size. It grows to
            about five lines so a long question stays readable; Return still sends. */}
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={t("Ask a question…")}
          placeholderTextColor="#9CA3AF"
          accessibilityLabel={t("Your question")}
          maxLength={1000}
          multiline
          submitBehavior="submit"
          returnKeyType="send"
          onSubmitEditing={() => ask(draft)}
          textAlignVertical="top"
          style={{
            flex: 1,
            minHeight: 48,
            maxHeight: 128,
            paddingHorizontal: 12,
            paddingTop: 13,
            paddingBottom: 13,
            fontSize: 16,
            color: "#111827",
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 12,
          }}
        />
        <Pressable
          accessibilityRole="button"
          disabled={busy || !draft.trim()}
          onPress={() => ask(draft)}
          className={`h-12 px-4 rounded-xl bg-indigo-600 items-center justify-center ${busy || !draft.trim() ? "opacity-50" : ""}`}
        >
          <Text className="text-white font-semibold">{t("Send")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

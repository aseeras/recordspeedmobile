import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useAccountCredentials } from "@/lib/auth/hooks";
import { askAssistant, AssistantMessage, AssistantSuggestion } from "@/lib/assistant/request";

// Screens the assistant may suggest, per account type, mapped to app routes.
const SCREENS: Record<string, Record<string, string>> = {
  patient: {
    my_requests: "/home/patient",
    new_request: "/home/patient/submitMedicalRecordRequest",
    mychart: "/home/patient/connectMyChart",
    contacts: "/home/patient/contacts",
    profile: "/home/patient/profile",
    delete_account: "/home/patient/deleteAccount",
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
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  }, [entries, busy]);

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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-white">
      <View className="flex-row items-center px-5 pt-5 pb-3 border-b border-gray-200">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">RecordSpeed assistant</Text>
          <Text className="text-xs text-gray-500">AI · can look up your account, read-only</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.dismiss()} className="w-10 h-10 items-center justify-center rounded-lg border border-gray-300">
          <Text className="text-base text-gray-700">✕</Text>
        </Pressable>
      </View>

      <ScrollView ref={scroll} className="flex-1" contentContainerStyle={{ padding: 16, gap: 10 }} keyboardShouldPersistTaps="handled">
        {entries.length === 0 && (
          <>
            <View className="self-start max-w-[88%] rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2">
              <Text className="text-base text-gray-900">
                Hi! I can explain how RecordSpeed works and look things up in your account. What can I help with?
              </Text>
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
            <Text className="text-sm text-gray-500">Thinking…</Text>
          </View>
        )}
      </ScrollView>

      <View className="flex-row items-center px-3 pt-2 pb-8 border-t border-gray-200" style={{ gap: 8 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Ask a question…"
          accessibilityLabel="Your question"
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={() => ask(draft)}
          className="flex-1 border border-gray-300 rounded-xl px-3 h-12 text-base text-gray-900"
        />
        <Pressable
          accessibilityRole="button"
          disabled={busy || !draft.trim()}
          onPress={() => ask(draft)}
          className={`h-12 px-4 rounded-xl bg-indigo-600 items-center justify-center ${busy || !draft.trim() ? "opacity-50" : ""}`}
        >
          <Text className="text-white font-semibold">Send</Text>
        </Pressable>
      </View>
      <Text className="text-[11px] text-gray-400 px-4 pb-4 -mt-6">AI can make mistakes. It can't make changes to your account.</Text>
    </KeyboardAvoidingView>
  );
}

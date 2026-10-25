import { useCallback, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
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
import { useSpokenReplies } from "@/lib/assistant/voice";
import { canTalk, listenOnce, prepareTalk } from "@/lib/assistant/listen";
import { LinearGradient } from "expo-linear-gradient";
import { language, t } from "@/lib/i18n";

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

type Entry = AssistantMessage & { suggestions?: AssistantSuggestion[]; error?: boolean; notSpoken?: boolean };

// Talk mode: a spoken back-and-forth. What's said is recognised on the iPhone (see listen.ts); replies are spoken
// in the Jennifer voice unless they hold account details, which stay on screen only.
type TalkState = "off" | "starting" | "listening" | "thinking" | "speaking" | "muted";
const TALK_STATUS: Record<Exclude<TalkState, "off">, string> = {
  starting: "Getting ready…",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
  muted: "Microphone off",
};

// The assistant's orb: breathes while listening, turns while thinking, swells while speaking.
function Orb({ state, size = 40 }: { state: TalkState; size?: number }) {
  const motion = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);
  useEffect(() => {
    motion.setValue(0);
    if (reduceMotion || state === "off" || state === "muted") return;
    const turning = state === "thinking" || state === "starting";
    const loop = Animated.loop(
      turning
        ? Animated.timing(motion, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true })
        : Animated.sequence([
            Animated.timing(motion, { toValue: 1, duration: state === "speaking" ? 450 : 1100, useNativeDriver: true }),
            Animated.timing(motion, { toValue: 0, duration: state === "speaking" ? 450 : 1100, useNativeDriver: true }),
          ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, reduceMotion, motion]);
  const turning = state === "thinking" || state === "starting";
  const transform = turning
    ? [{ rotate: motion.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }]
    : [{ scale: motion.interpolate({ inputRange: [0, 1], outputRange: [1, state === "speaking" ? 1.15 : 1.08] }) }];
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", opacity: state === "muted" ? 0.4 : 1, transform }}
    >
      <LinearGradient colors={["#00C8FF", "#4F46E5", "#E8A200"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }} />
    </Animated.View>
  );
}

// The RecordSpeed assistant: answers questions and looks up the user's own requests, shares and plan (read-only).
export default function AssistantScreen() {
  const { from, talk: talkParam } = useLocalSearchParams<{ from?: string; talk?: string }>();
  const { data: credentials } = useAccountCredentials();
  const type = credentials?.type === "attorney" ? "attorney" : "patient";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollView>(null);
  const spoken = useSpokenReplies();
  const [talkable] = useState(canTalk);
  const [talk, setTalk] = useState<TalkState>("off");
  const [heard, setHeard] = useState("");
  const talkRun = useRef<AbortController | null>(null);
  const listening = useRef<AbortController | null>(null);
  const muted = useRef(false);
  const unmute = useRef<(() => void) | null>(null);
  // ask() reads the latest conversation, not the one from when talk mode started.
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

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

  // Returns the reply's speech token when it may be spoken (talk mode uses it), or null.
  async function ask(text: string, { talking = false } = {}): Promise<string | null> {
    const question = text.trim();
    if (!question || (busy && !talking) || !credentials?.authToken) return null;
    const history: AssistantMessage[] = [
      ...entriesRef.current.filter((e) => !e.error).map(({ role, content }) => ({ role, content })),
      { role: "user", content: question },
    ];
    setEntries((prev) => [...prev, { role: "user", content: question }]);
    setDraft("");
    setBusy(true);
    spoken.stop();
    try {
      const reply = await askAssistant({ authToken: credentials.authToken, messages: history, screen: from });
      const suggestions = reply.suggestions.filter((s) => SCREENS[type][s.target]);
      // Replies with account details are never sent to the voice service, so they stay text; say so.
      const notSpoken = (spoken.voice || talking) && reply.speechWithheld === "account_details";
      setEntries((prev) => [...prev, { role: "assistant", content: reply.message, suggestions, notSpoken }]);
      if (talking) return reply.speech ?? null;
      if (spoken.voice && reply.speech) spoken.speak(reply.speech);
    } catch (error) {
      setEntries((prev) => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], error: true },
        { role: "assistant", content: `${error.message ?? error} You can also email contact@recordspeed.com.`, error: true },
      ]);
    } finally {
      setBusy(false);
    }
    return null;
  }

  const stopSpeaking = spoken.stop;
  const endTalk = useCallback(() => {
    talkRun.current?.abort();
    talkRun.current = null;
    listening.current?.abort();
    muted.current = false;
    unmute.current?.();
    stopSpeaking();
    setHeard("");
    setTalk("off");
  }, [stopSpeaking]);
  useEffect(() => endTalk, [endTalk]);

  async function startTalk() {
    if (talkRun.current) return;
    const run = new AbortController();
    talkRun.current = run;
    setTalk("starting");
    Keyboard.dismiss();
    if (!(await prepareTalk())) {
      endTalk();
      setEntries((prev) => [
        ...prev,
        { role: "assistant", content: t("Talking needs the microphone. You can turn it on in Settings, or type your question instead."), error: true },
      ]);
      return;
    }
    let silences = 0;
    while (!run.signal.aborted) {
      if (muted.current) {
        setTalk("muted");
        await new Promise<void>((resolve) => (unmute.current = resolve));
        continue;
      }
      setTalk("listening");
      setHeard("");
      const ctl = new AbortController();
      listening.current = ctl;
      let said = "";
      try {
        said = await listenOnce(language(), { onPartial: setHeard, signal: ctl.signal });
      } catch {
        if (run.signal.aborted) break;
        endTalk();
        setEntries((prev) => [
          ...prev,
          { role: "assistant", content: t("Talking isn't available on this iPhone right now. You can type your question instead."), error: true },
        ]);
        return;
      }
      setHeard("");
      if (run.signal.aborted) break;
      if (!said) {
        if (muted.current) continue;
        if (++silences >= 3) break;
        continue;
      }
      silences = 0;
      setTalk("thinking");
      const speech = await ask(said, { talking: true });
      if (run.signal.aborted) break;
      if (speech) {
        setTalk("speaking");
        await spoken.speak(speech);
      }
    }
    if (talkRun.current === run) endTalk();
  }

  function toggleMute() {
    muted.current = !muted.current;
    if (muted.current) listening.current?.abort();
    else {
      unmute.current?.();
      unmute.current = null;
    }
    setTalk((s) => (muted.current ? "muted" : s === "muted" ? "listening" : s));
  }

  // Opened from the Talk button: start talking straight away.
  useEffect(() => {
    if (talkParam === "1" && talkable && credentials?.authToken) startTalk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talkParam, talkable, !!credentials?.authToken]);

  function open(target: string) {
    endTalk();
    router.dismiss();
    router.replace(SCREENS[type][target] as Href);
  }

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: keyboardHeight > 0 ? keyboardHeight : insets.bottom }}
    >
      <View className="flex-row items-center px-5 pt-3 pb-3 border-b border-gray-200">
        {talk !== "off" && (
          <View className="mr-3">
            <Orb state={talk} size={32} />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{t("RecordSpeed assistant")}</Text>
          <Text className="text-xs text-gray-500" accessibilityLiveRegion="polite">
            {talk === "off" ? t("AI · can look up your account, read-only") : t(TALK_STATUS[talk])}
          </Text>
        </View>
        <Pressable
          role="switch"
          aria-checked={spoken.voice}
          aria-label={t("Read replies aloud")}
          onPress={spoken.toggle}
          className={`w-10 h-10 mr-2 items-center justify-center rounded-lg border ${spoken.voice ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
        >
          <Text className={`text-base ${spoken.voice ? "text-white" : "text-gray-500"}`}>{spoken.voice ? "🔊" : "🔇"}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t("Close")} onPress={() => { endTalk(); router.dismiss(); }} className="w-10 h-10 items-center justify-center rounded-lg border border-gray-300">
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
            {e.notSpoken && (
              <Text className="mt-1 text-[11px] text-gray-500">{t("Not read aloud: it includes details from your account.")}</Text>
            )}
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
        {!!heard && (
          <View className="self-end max-w-[88%] rounded-2xl rounded-br-sm bg-indigo-100 px-3 py-2">
            <Text className="text-base text-indigo-900">{heard}</Text>
          </View>
        )}
        {busy && talk === "off" && (
          <View className="self-start flex-row items-center" style={{ gap: 6 }}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text className="text-sm text-gray-500">{t("Thinking…")}</Text>
          </View>
        )}
      </ScrollView>

      <Text className="text-[11px] text-gray-400 px-4 pt-2 border-t border-gray-200">{t("AI can make mistakes. It can't make changes to your account.")}</Text>
      {talk !== "off" ? (
        <View className="flex-row items-center px-3 pt-2 pb-3" style={{ gap: 8 }}>
          <Orb state={talk} size={48} />
          <Text className="flex-1 text-base text-gray-700">{t(TALK_STATUS[talk])}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={talk === "muted" ? t("Unmute") : t("Mute")}
            onPress={toggleMute}
            className="h-12 px-4 rounded-xl border border-gray-300 items-center justify-center"
          >
            <Text className="text-gray-800 font-semibold">{talk === "muted" ? t("Unmute") : t("Mute")}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={endTalk}
            className="h-12 px-4 rounded-xl bg-red-600 items-center justify-center"
          >
            <Text className="text-white font-semibold">{t("End")}</Text>
          </Pressable>
        </View>
      ) : (
      <View className="flex-row items-end px-3 pt-2 pb-3" style={{ gap: 8 }}>
        {talkable && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("Talk")}
            accessibilityHint={t("Ask out loud. What you say is turned into text on this iPhone.")}
            onPress={startTalk}
            className="h-12 w-12 rounded-xl items-center justify-center overflow-hidden"
          >
            <LinearGradient colors={["#00C8FF", "#4F46E5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", inset: 0 }} />
            <Text className="text-xl">🎙️</Text>
          </Pressable>
        )}
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
      )}
    </View>
  );
}

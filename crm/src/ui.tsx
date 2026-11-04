import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  ActivityIndicator, Alert, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TextInputProps,
  View, ViewStyle,
} from "react-native";
import type { Stage } from "./types";
import { STAGE_LABEL } from "./types";

// RecordSpeed's colors: blue brand, warm neutrals, like the staff portal.
export const C = {
  brand: "#3B5BDB", brandDark: "#2F48B3", ink: "#1F1A14", muted: "#6B5E4E", line: "#E4D9C8", bg: "#F6F4EF", card: "#FFFFFF",
  danger: "#B42318", success: "#067647", warn: "#B54708",
};

export function Screen({ children, onRefresh, style }: { children: React.ReactNode; onRefresh?: () => Promise<unknown>; style?: ViewStyle }) {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try { await onRefresh(); } finally { setRefreshing(false); }
  }, [onRefresh]);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={[{ padding: 16, paddingBottom: 48, gap: 12 }, style]}
      keyboardShouldPersistTaps="handled"
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={refresh} /> : undefined}
    >
      {children}
    </ScrollView>
  );
}

export function Card({ title, children, right }: { title?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <View style={s.card}>
      {(title || right) && (
        <View style={s.cardHead}>
          {title ? <Text style={s.cardTitle}>{title}</Text> : <View />}
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

export function Row({ title, subtitle, right, onPress, strike }: {
  title: string; subtitle?: string; right?: React.ReactNode; onPress?: () => void; strike?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.6 }]} accessibilityRole={onPress ? "button" : undefined}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[s.rowTitle, strike && { textDecorationLine: "line-through", color: C.muted }]} numberOfLines={2}>{title}</Text>
        {subtitle ? <Text style={s.muted} numberOfLines={2}>{subtitle}</Text> : null}
      </View>
      {right}
      {onPress ? <Text style={s.chevron}>›</Text> : null}
    </Pressable>
  );
}

export function Stat({ label, value, onPress, tone }: { label: string; value: string | number; onPress?: () => void; tone?: string }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [s.stat, pressed && { opacity: 0.6 }]}>
      <Text style={[s.statValue, tone ? { color: tone } : null]}>{value}</Text>
      <Text style={s.muted}>{label}</Text>
    </Pressable>
  );
}

export function Button({ title, onPress, kind = "primary", disabled, small }: {
  title: string; onPress: () => void; kind?: "primary" | "secondary" | "danger" | "success"; disabled?: boolean; small?: boolean;
}) {
  const bg = { primary: C.ink, secondary: "transparent", danger: C.danger, success: C.success }[kind];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [s.button, small && s.buttonSmall, { backgroundColor: bg }, kind === "secondary" && s.buttonSecondary, (pressed || disabled) && { opacity: 0.5 }]}
    >
      <Text style={[s.buttonText, small && { fontSize: 14 }, kind === "secondary" && { color: C.ink }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput placeholderTextColor="#B3A493" style={[s.input, props.multiline && { minHeight: 80, textAlignVertical: "top" }]} {...props} />
    </View>
  );
}

// A row of choices (stage, type, ...); the selected one is filled in.
export function Choice<T extends string>({ label, options, value, onChange, labels }: {
  label?: string; options: readonly T[]; value: T | null; onChange: (v: T) => void; labels?: Record<string, string>;
}) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {options.map((o) => (
          <Pressable key={o} onPress={() => onChange(o)} style={[s.chip, value === o && s.chipOn]} accessibilityRole="button" accessibilityState={{ selected: value === o }}>
            <Text style={[s.chipText, value === o && { color: "#fff" }]}>{labels?.[o] ?? o}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const stageColors: Record<Stage, [string, string]> = {
  lead: ["#EEECE8", "#3A342C"], contacted: ["#E0F2FE", "#075985"], demo: ["#E0E7FF", "#3730A3"],
  pilot: ["#FEF3C7", "#92400E"], won: ["#D1FAE5", "#065F46"], lost: ["#FFE4E6", "#9F1239"],
};
export function StageBadge({ stage }: { stage: Stage }) {
  const [bg, fg] = stageColors[stage];
  return <Text style={[s.badge, { backgroundColor: bg, color: fg }]}>{STAGE_LABEL[stage]}</Text>;
}

export function Loading() {
  return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: C.bg }}><ActivityIndicator /></View>;
}

export function ErrorText({ error }: { error: unknown }) {
  if (!error) return null;
  return <Text style={{ color: C.danger }}>{error instanceof Error ? error.message : "Something went wrong."}</Text>;
}

export const Muted = ({ children }: { children: React.ReactNode }) => <Text style={s.muted}>{children}</Text>;

export function confirm(title: string, message: string, onYes: () => void, yes = "Delete") {
  if (Platform.OS === "web") { if (globalThis.confirm?.(`${title}\n${message}`)) onYes(); return; }
  Alert.alert(title, message, [{ text: "Cancel", style: "cancel" }, { text: yes, style: "destructive", onPress: onYes }]);
}

export function notify(message: string) {
  if (Platform.OS === "web") { console.log(message); return; }
  Alert.alert(message);
}

// Refetch everything after a change, so every tab shows the new state.
export function useRefreshAll() {
  const client = useQueryClient();
  return () => client.invalidateQueries();
}

export const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, padding: 14, gap: 8 },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 13, fontWeight: "700", letterSpacing: 0.6, color: C.muted, textTransform: "uppercase" },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  rowTitle: { fontSize: 16, fontWeight: "600", color: C.ink },
  chevron: { fontSize: 22, color: "#B3A493", marginLeft: 2 },
  muted: { fontSize: 13, color: C.muted },
  stat: { flexBasis: "47%", flexGrow: 1, backgroundColor: C.card, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, padding: 14, gap: 2 },
  statValue: { fontSize: 24, fontWeight: "800", color: C.ink },
  button: { borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, alignItems: "center" },
  buttonSmall: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10 },
  buttonSecondary: { borderWidth: 1, borderColor: "#1F1A1440" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  label: { fontSize: 13, fontWeight: "600", color: C.muted },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 16, color: C.ink },
  chip: { borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: "#fff" },
  chipOn: { backgroundColor: C.ink, borderColor: C.ink },
  chipText: { fontSize: 14, color: C.ink, fontWeight: "600" },
  badge: { fontSize: 12, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: "hidden" },
  h1: { fontSize: 22, fontWeight: "800", color: C.ink },
});

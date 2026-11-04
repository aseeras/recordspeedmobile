import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { isoToUs, usToIso } from "./api";
import { C, s } from "./ui";

const toDate = (iso: string) => new Date(`${iso}T12:00:00`);
const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const pretty = (iso: string) => toDate(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

// A date chosen from a calendar. The value is YYYY-MM-DD (what the API takes) or null for no date.
// On iPhone: a calendar opens under the field; "Clear" removes the date. In the web preview: a MM/DD/YYYY box.
export function DateField({ label, value, onChange }: { label: string; value: string | null; onChange: (iso: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(isoToUs(value));
  const [typingError, setTypingError] = useState<string | null>(null);

  if (Platform.OS === "web") {
    return (
      <View style={{ gap: 4 }}>
        <Text style={s.label}>{label}</Text>
        <TextInput style={s.input} value={text} placeholder="MM/DD/YYYY" placeholderTextColor="#B3A493"
          onChangeText={(t) => {
            setText(t);
            try { onChange(usToIso(t)); setTypingError(null); } catch (e) { setTypingError((e as Error).message); }
          }} />
        {typingError ? <Text style={{ color: C.danger, fontSize: 13 }}>{typingError}</Text> : null}
      </View>
    );
  }

  const picked = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setOpen(false);
    if (event.type === "set" && date) onChange(toIso(date));
  };

  return (
    <View style={{ gap: 4 }}>
      <Text style={s.label}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityLabel={`${label}: ${value ? pretty(value) : "no date"}`}
          style={[s.input, { flex: 1, flexDirection: "row", justifyContent: "space-between" }]}>
          <Text style={{ fontSize: 16, color: value ? C.ink : "#B3A493" }}>{value ? pretty(value) : "Pick a date"}</Text>
          <Text style={{ fontSize: 16 }}>📅</Text>
        </Pressable>
        {value ? <Text style={{ color: C.brand, fontWeight: "600" }} onPress={() => { onChange(null); setOpen(false); }}>Clear</Text> : null}
      </View>
      {open ? (
        <View style={{ alignItems: "center" }}>
          <DateTimePicker value={value ? toDate(value) : new Date()} mode="date" display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={picked} accentColor={C.brand} themeVariant="light" />
          {Platform.OS === "ios" ? <Text style={{ color: C.brand, fontWeight: "700", padding: 8 }} onPress={() => setOpen(false)}>Done</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

// A time of day ("HH:MM", 24-hour) chosen with the iPhone's time wheel; a text box in the web preview.
export function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (hhmm: string) => void }) {
  const [open, setOpen] = useState(false);
  const [h, m] = value.split(":").map(Number);
  const asDate = new Date(2000, 0, 1, h || 0, m || 0);
  const shown = asDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (Platform.OS === "web") {
    return (
      <View style={{ gap: 4 }}>
        <Text style={s.label}>{label}</Text>
        <TextInput style={s.input} value={value} onChangeText={onChange} placeholder="10:00" placeholderTextColor="#B3A493" />
      </View>
    );
  }
  return (
    <View style={{ gap: 4 }}>
      <Text style={s.label}>{label}</Text>
      <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityLabel={`${label}: ${shown}`} style={s.input}>
        <Text style={{ fontSize: 16, color: C.ink }}>{shown}</Text>
      </Pressable>
      {open ? (
        <View style={{ alignItems: "center" }}>
          <DateTimePicker value={asDate} mode="time" display={Platform.OS === "ios" ? "spinner" : "default"} minuteInterval={5}
            onChange={(event, date) => {
              if (Platform.OS === "android") setOpen(false);
              if (event.type === "set" && date) onChange(`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`);
            }} />
          {Platform.OS === "ios" ? <Text style={{ color: C.brand, fontWeight: "700", padding: 8 }} onPress={() => setOpen(false)}>Done</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

import { Pressable, Text, View } from "react-native";
import { Language, setLanguage, useLanguage } from "@/lib/i18n";

const OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

// English | Español. The choice is remembered and the app redraws in that language.
export default function LanguageSwitch({ className = "" }: { className?: string }) {
  const current = useLanguage();
  return (
    <View accessibilityRole="radiogroup" className={`flex-row rounded-full border border-gray-300 bg-white ${className}`}>
      {OPTIONS.map(({ value, label }) => {
        const selected = value === current;
        return (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={label}
            onPress={() => setLanguage(value)}
            className={`px-3 py-1.5 rounded-full ${selected ? "bg-brand-blue" : ""}`}
          >
            <Text className={`text-sm font-semibold ${selected ? "text-white" : "text-gray-700"}`}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

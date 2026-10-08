import { Pressable, Text } from "react-native";
import { router, usePathname } from "expo-router";

// Floating button that opens the RecordSpeed assistant from any home screen.
export default function AssistantButton() {
  const pathname = usePathname();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ask the RecordSpeed assistant"
      onPress={() => router.push({ pathname: "/assistant", params: { from: pathname } })}
      className="absolute right-5 bottom-8 h-14 px-5 rounded-full bg-indigo-600 flex-row items-center shadow-lg"
      style={{ elevation: 6 }}
    >
      <Text className="text-white text-base font-semibold">💬 Ask</Text>
    </Pressable>
  );
}

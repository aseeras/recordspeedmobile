import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { C } from "@/ui";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
const icon = (name: IconName) => ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} color={color as string} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: C.brand, headerStyle: { backgroundColor: C.bg }, headerShadowVisible: false, headerTintColor: C.ink }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon("home-outline") }} />
      <Tabs.Screen name="pipeline" options={{ title: "Pipeline", tabBarIcon: icon("funnel-outline") }} />
      <Tabs.Screen name="accounts" options={{ title: "Accounts", tabBarIcon: icon("business-outline") }} />
      <Tabs.Screen name="followups" options={{ title: "Follow-ups", tabBarIcon: icon("checkmark-done-outline") }} />
      <Tabs.Screen name="projects" options={{ title: "Projects", tabBarIcon: icon("folder-open-outline") }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: icon("ellipsis-horizontal") }} />
    </Tabs>
  );
}

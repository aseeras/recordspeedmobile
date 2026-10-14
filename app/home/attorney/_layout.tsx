import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { t } from "@/lib/i18n";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        navigationBarHidden: true,
        navigationBarColor: "transparent",
        header({ options }) {
          return (
            <View className="flex items-center">
              <Text className="text-white font-semibold text-lg py-4">
                {options.title}
              </Text>
              <View className="bg-white rounded-t-2xl h-6 w-full" />
            </View>
          );
        },
      }}
    >
      <Stack.Screen name="plan" options={{ title: t("My Profile") }} />
      <Stack.Screen name="profile" options={{ title: t("My Profile") }} />
      <Stack.Screen name="prospects" />
      <Stack.Screen name="index" options={{ title: t("Shared with me") }} />
      <Stack.Screen
        name="[medicalRecordRequestId]/[documentId]"
        options={{ title: t("Checkout") }}
      />
    </Stack>
  );
}

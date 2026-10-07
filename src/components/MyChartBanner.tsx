import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

// The patient's way in to importing records from MyChart, shown above their requests.
export default function MyChartBanner() {
  return (
    <View className="w-full px-8 pt-4">
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/home/patient/connectMyChart")}
        className="w-full rounded-2xl bg-indigo-50 border border-indigo-200 px-5 py-4"
      >
        <Text className="text-indigo-800 text-base font-semibold">Get records from MyChart</Text>
        <Text className="text-indigo-700 text-sm pt-1">
          Sign in to MyChart to bring in your records in minutes.
        </Text>
      </Pressable>
    </View>
  );
}

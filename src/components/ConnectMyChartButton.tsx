import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useConnectMyChart } from "@/lib/ehrConnections/hooks";

// Offered on a patient's pending request: fills it straight from their MyChart (Epic) account.
export default function ConnectMyChartButton({ medicalRecordRequestId }: { medicalRecordRequestId: number }) {
  const { connect, connecting, importing } = useConnectMyChart(medicalRecordRequestId);
  const busy = connecting || importing;

  return (
    <View className="pt-6">
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => connect()}
        className={`flex-row items-center justify-center rounded-xl border border-indigo-600 w-full h-11 ${busy ? "opacity-60" : ""}`}
      >
        {busy && <ActivityIndicator size="small" color="#4F46E5" style={{ marginRight: 8 }} />}
        <Text className="text-indigo-700 text-base font-semibold">
          {importing ? "Importing from MyChart…" : connecting ? "Opening MyChart…" : "Connect MyChart"}
        </Text>
      </Pressable>
      {!busy && (
        <Text className="text-sm text-gray-500 text-center pt-2">
          Get these records now from your MyChart account
        </Text>
      )}
    </View>
  );
}

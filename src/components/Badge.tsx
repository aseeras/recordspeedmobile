import { MedicalRecordRequestStatus } from "@/lib/types";
import { Text, View } from "react-native";

export default function Badge({ type }: { type: string }) {
  const status = type
    .split("")
    .map((char, i) => (i == 0 ? char.toUpperCase() : char.toLowerCase()));

  const bgColor =
    type == MedicalRecordRequestStatus[MedicalRecordRequestStatus.pending]
      ? "bg-blue-100"
      : type == MedicalRecordRequestStatus[MedicalRecordRequestStatus.fulfilled]
      ? "bg-teal-100"
      : "";

  const textColor =
    type == MedicalRecordRequestStatus[MedicalRecordRequestStatus.pending]
      ? "text-gray-700"
      : type == MedicalRecordRequestStatus[MedicalRecordRequestStatus.fulfilled]
      ? "text-teal-700"
      : "";

  const dotColor =
    type == MedicalRecordRequestStatus[MedicalRecordRequestStatus.pending]
      ? "bg-blue-500"
      : type == MedicalRecordRequestStatus[MedicalRecordRequestStatus.fulfilled]
      ? "bg-teal-500"
      : "bg-gray-400";

  return (
    <View
      className={`flex-row items-center py-1 px-3 rounded-full ${bgColor}`}
      style={{ gap: 6 }}
    >
      <View className={`w-2 h-2 rounded-full ${dotColor}`} />
      <Text className={`text-sm font-semibold ${textColor}`}>{status}</Text>
    </View>
  );
}

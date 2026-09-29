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

  return (
    <View className={`py-1.5 px-3.5 rounded-md ${bgColor}`}>
      <Text className={`text-base ${textColor}`}>{status}</Text>
    </View>
  );
}

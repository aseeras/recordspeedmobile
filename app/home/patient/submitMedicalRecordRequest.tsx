import MedicalRequestSubmissionForm from "@/components/MedicalRequestSubmissionForm";
import { router } from "expo-router";
import { View, Text } from "react-native";

export default function HomePatientSubmitMedicalRecordRequest() {
  return (
    <>
      <View className="flex items-center mt-4">
        <Text className="text-white font-semibold text-lg">
          Submit your Medical Request
        </Text>
      </View>

      <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
        <MedicalRequestSubmissionForm
          onCancel={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/home");
            }
          }}
        />
      </View>
    </>
  );
}

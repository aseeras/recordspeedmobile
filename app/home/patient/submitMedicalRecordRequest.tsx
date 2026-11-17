import MedicalRequestSubmissionForm from "@/components/MedicalRequestSubmissionForm";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { t } from "@/lib/i18n";

export default function HomePatientSubmitMedicalRecordRequest() {
  return (
    <>
      <View className="flex items-center mt-4">
        <Text className="text-white font-semibold text-lg">{t("Submit your Medical Request")}</Text>
      </View>

      <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
        <MedicalRequestSubmissionForm
          // Always back to the requests list. Going "back" isn't safe here: the menu replaces screens rather than
          // stacking them, so right after signing in the screen underneath is the sign-in screen.
          onCancel={() => router.replace("/home")}
        />
      </View>
    </>
  );
}

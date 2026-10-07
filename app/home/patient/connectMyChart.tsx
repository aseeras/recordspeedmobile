import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { formatISO, subYears } from "date-fns";
import Toast from "react-native-toast-message";
import MedicalInstitutionSearch from "@/components/MedicalInstitutionSearch";
import { useAccountCredentials, useCurrentAccount } from "@/lib/auth/hooks";
import { useConnectMyChart } from "@/lib/ehrConnections/hooks";
import { useMedicalInstitution } from "@/lib/medicalInstitutions/hooks";
import { createMedicalRecordRequest } from "@/lib/medicalRecordRequests/request";
import { Patient } from "@/lib/types";

const YEARS_OF_RECORDS = 10;

// Fills a new request straight from the patient's MyChart account: choose the hospital or clinic, sign in to
// MyChart, and the records are imported into the request.
export default function HomePatientConnectMyChart() {
  const { data: patient } = useCurrentAccount<Patient>();
  const { data: credentials } = useAccountCredentials();
  const { connect, connecting, importing, imported } = useConnectMyChart();
  const [institutionId, setInstitutionId] = useState<number | undefined>(patient?.medicalInstitutionId);
  const [creating, setCreating] = useState(false);
  const busy = creating || connecting || importing;
  const { data: selectedInstitution } = useMedicalInstitution(institutionId);

  useEffect(() => {
    if (imported) router.replace("/home");
  }, [imported]);

  async function start() {
    if (!institutionId) {
      Toast.show({ type: "error", text1: "Choose your hospital or clinic first." });
      return;
    }
    setCreating(true);
    try {
      const created = await createMedicalRecordRequest({
        authToken: credentials?.authToken,
        medicalRecordRequest: {
          from: formatISO(subYears(new Date(), YEARS_OF_RECORDS)),
          to: formatISO(new Date()),
          medicalInstitutionId: institutionId,
          patientId: patient.id,
        },
      });
      const requestId = (created as any)?.data?.attributes?.id;
      if (!requestId) throw new Error((created as any)?.error?.message ?? "The request couldn't be created.");
      connect(requestId);
    } catch (error) {
      Toast.show({ type: "error", text1: "Couldn't start MyChart", text2: `${error.message ?? error}` });
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <View className="flex items-center mt-4">
        <Text className="text-white font-semibold text-lg">Get records from MyChart</Text>
      </View>

      <View className="flex items-center bg-white w-full h-full mt-4 rounded-2xl">
        <ScrollView className="w-full" keyboardShouldPersistTaps="handled">
          <View className="w-full p-6">
            <Text className="text-base text-gray-700 pb-6">
              Sign in to your MyChart account and RecordSpeed brings in your notes, test results, medications,
              allergies and immunizations from the last {YEARS_OF_RECORDS} years. Your MyChart password stays with
              MyChart.
            </Text>

            <MedicalInstitutionSearch
              header={() => (
                <Text className="text-base text-gray-700 pb-2.5 font-medium">
                  Your hospital or clinic <Text className="text-red-500">*</Text>
                </Text>
              )}
              onSelectMedicalInstitution={(institution) => setInstitutionId(institution.id)}
            />
            <Text className="text-sm text-gray-500 pt-2">
              {selectedInstitution ? `Selected: ${selectedInstitution.name}` : "Search for the hospital or clinic you use MyChart with."}
            </Text>

            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={start}
              className={`flex-row items-center justify-center rounded-xl bg-indigo-600 w-full h-12 mt-8 ${busy ? "opacity-60" : ""}`}
            >
              {busy && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />}
              <Text className="text-white text-base font-semibold">
                {importing ? "Importing your records…" : busy ? "Opening MyChart…" : "Continue to MyChart"}
              </Text>
            </Pressable>

            {!busy && (
              <Pressable className="items-center pt-5" onPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))}>
                <Text className="text-indigo-700 text-base">Cancel</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

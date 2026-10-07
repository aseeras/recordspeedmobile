import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import MedicalRequestList from "@/components/MedicalRequestList";
import HomeZeroState from "@/components/HomeZeroState";
import MyChartBanner from "@/components/MyChartBanner";
import Plus from "@/utils/svg/Plus";
import { useOwnedMedicalRecordRequests } from "@/lib/medicalRecordRequests/hooks";

export default function HomePatientIndex() {
  const {
    data: medicalRecordRequests,
    isFetching,
    refetch,
  } = useOwnedMedicalRecordRequests();

  return (
    <>
      <View className="flex items-center mt-4">
        <Text className="text-white font-semibold text-lg">
          My Medical Requests
        </Text>
      </View>
      <View className="relative flex items-center bg-white w-full h-full mt-4 pt-2 rounded-2xl">
        <MyChartBanner />
        <MedicalRequestList
          medicalRecordRequests={medicalRecordRequests}
          isFetching={isFetching}
          refetch={refetch}
          zeroState={() => <HomeZeroState />}
        />

        <Pressable
          className="absolute flex justify-center items-center w-16 h-16 bg-primary-green rounded-full bottom-40 right-8"
          onPress={() => {
            router.push("/home/patient/submitMedicalRecordRequest");
          }}
        >
          <Plus />
        </Pressable>
      </View>
    </>
  );
}

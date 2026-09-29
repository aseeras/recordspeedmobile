import MedicalRequestList from "@/components/MedicalRequestList";
import SharedWithMeZeroState from "@/components/SharedWithMeZeroState";
import { useSharedWithMeMedicalRecordRequests } from "@/lib/medicalRecordRequests/hooks";
import { useCurrentPlan, useRequirePlan } from "@/lib/plans/hooks";
import { Text, View } from "react-native";
import DocumentSecondary from "../../../assets/DocumentSecondary.png";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function HomeAttorneyIndex() {
  const { data: currentPlan } = useCurrentPlan("attorneys");
  const {
    data: medicalRecordRequests,
    isFetching,
    refetch,
  } = useSharedWithMeMedicalRecordRequests();

  if (!currentPlan) {
    return (
      <View className="items-center bg-white h-full w-full ">
        <View className="w-24 h-24 mr-6 mt-52">
          <Image
            style={{
              width: "100%",
              height: "100%",
            }}
            source={DocumentSecondary}
            contentFit="cover"
          />
        </View>
        <Text className="text-gray-700 text-center text-2xl w-80 pt-6 font-semibold leading-9">
          Subscribe!
        </Text>

        <Text className="text-gray-700 text-center text-lg w-72 font-medium">
          <Link href="/home/attorney/plan" className="text-blue">
            Subscribe
          </Link>{" "}
          to access this feature.
        </Text>
      </View>
    );
  }

  return (
    <MedicalRequestList
      medicalRecordRequests={medicalRecordRequests}
      isFetching={isFetching}
      refetch={refetch}
      zeroState={() => <SharedWithMeZeroState />}
    />
  );
}

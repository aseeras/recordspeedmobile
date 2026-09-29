import Avatar from "@/components/Avatar";
import { Image } from "expo-image";
import ProfileProspects from "../../../assets/ProfileProspects.png";
import ChevronDown from "@/utils/svg/ChevronDown";
import { router } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import PatientAssistanceCard from "@/components/PatientAssistanceCard";
import { usePublicPatients } from "@/lib/patient/hooks";
import { useRequirePlan } from "@/lib/plans/hooks";

export default function HomeAttorneyProspects() {
  useRequirePlan("attorneys");
  const { data: publicPatients } = usePublicPatients();
  return (
    <>
      <View className="flex items-center mt-12">
        <Text className="text-white font-semibold text-lg">My Profile</Text>
      </View>
      <View className="relative flex items-center bg-white w-full h-full mt-4 rounded-2xl py-10">
        <View className="flex flex-row justify-between w-full absolute bg-white rounded-t-lg pt-4 pb-2 z-10 px-6">
          <Text className="text-lg text-gray-700 font-bold">
            My Prospects List
          </Text>
          <Pressable
            className="flex flex-row items-center"
            onPress={() => {
              router.canGoBack()
                ? router.back()
                : router.replace("/home/attorney/profile");
            }}
          >
            <View className="mr-2 rotate-90">
              <ChevronDown />
            </View>
            <Text className="text-base text-gray-700 font-semibold">Back</Text>
          </Pressable>
        </View>
        <ScrollView className="w-full px-6">
          <View className="w-full h-full pb-44">
            <View className="w-full flex items-center">
              <View className="w-32 h-[150px] mt-8">
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  source={ProfileProspects}
                  contentFit="cover"
                />
              </View>
            </View>

            <View className="flex">
              {publicPatients &&
                publicPatients.map((patient, key) => (
                  <PatientAssistanceCard key={key} patient={patient} />
                ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

import { useCurrentAccount } from "@/lib/auth/hooks";
import { Patient } from "@/lib/types";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import DocumentSecondary from "../../assets/DocumentSecondary.png";

export default function HomeZeroState() {
  const { data: patient } = useCurrentAccount<Patient>();
  return (
    <>
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
        Welcome, {patient ? patient.fullName : "Patient"}
      </Text>

      <Text className="text-gray-700 text-center text-lg w-72 font-medium">
        You have no Medical Requests yet, click on the{" "}
        <Text className="font-bold">plus</Text> button to start.
      </Text>
    </>
  );
}

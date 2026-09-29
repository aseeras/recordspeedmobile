import { Text, View } from "react-native";
import { Image } from "expo-image";
import RecordSpeedLogo from "../../assets/RecordSpeedLogo.png";

export default function Loader() {
  return (
    <>
      <View className="flex-1 w-full h-full items-center justify-center bg-primary-green pr-6 pb-24">
        <View className="w-44 h-44">
          <Image
            style={{
              width: "100%",
              height: "100%",
            }}
            source={RecordSpeedLogo}
            contentFit="cover"
          />
        </View>
        <Text className="text-white text-center text-2xl font-bold leading-6 -mt-12 ml-6">
          RecordSpeed
        </Text>
      </View>
    </>
  );
}

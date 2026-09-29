import { View, Text } from "react-native";
import { Image } from "expo-image";
import DocumentSecondary from "../../assets/DocumentSecondary.png";

export default function SharedWithMeZeroState() {
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
        Nothing yet!
      </Text>

      <Text className="text-gray-700 text-center text-lg w-72 font-medium">
        Pull down the screen to refresh your shared medical requests.
      </Text>
    </>
  );
}

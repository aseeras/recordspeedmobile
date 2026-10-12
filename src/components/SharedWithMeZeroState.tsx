import { View, Text } from "react-native";
import { Image } from "expo-image";
import DocumentSecondary from "../../assets/DocumentSecondary.png";

// Centered in the space above the Ask button (pb-32 keeps it clear of it).
export default function SharedWithMeZeroState() {
  return (
    <View className="flex-1 w-full items-center justify-center px-10 pb-32">
      <View className="w-24 h-24 rounded-full bg-indigo-50 items-center justify-center">
        <Image
          style={{ width: 52, height: 52, marginRight: 8 }}
          source={DocumentSecondary}
          contentFit="contain"
        />
      </View>
      <Text className="text-gray-900 text-center text-2xl font-bold pt-6">
        Nothing yet!
      </Text>
      <Text className="text-gray-500 text-center text-base leading-6 pt-2">
        Pull down the screen to refresh your shared medical requests.
      </Text>
    </View>
  );
}

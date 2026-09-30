import { Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Menu from "@/utils/svg/Menu";
import RecordSpeedLogo from "../../assets/RecordSpeedLogo.png";

export default function Header({ onPressMenu }: { onPressMenu: () => void }) {
  return (
    <View className="pl-3.5 pr-8">
      <View className="flex flex-row items-center justify-between h-10">
        <View className="flex flex-row items-center">
          <View className="w-12 h-12 mt-3">
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              source={RecordSpeedLogo}
              contentFit="cover"
            />
          </View>
          <Text className="text-white text-2xl font-bold leading-6 pl-1">
            RecordSpeed
          </Text>
        </View>
        <Pressable className="p-2 pr-0" onPress={onPressMenu}>
          <Menu />
        </Pressable>
      </View>
    </View>
  );
}

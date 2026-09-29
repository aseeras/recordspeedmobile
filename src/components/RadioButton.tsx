import { View, Pressable } from "react-native";

export default function RadioButton({
  selected = false,
  onPress = () => {},
}: {
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View className="bg-gray-100 w-6 h-6 rounded-full flex justify-center items-center">
        {selected && <View className="w-3 h-3 bg-primary-green rounded-full" />}
      </View>
    </Pressable>
  );
}

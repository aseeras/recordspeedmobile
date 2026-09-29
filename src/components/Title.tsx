import { Text, TextProps } from "react-native";

export default function Title(props: TextProps) {
  return <Text className="text-3xl font-bold text-gray-700" {...props} />;
}

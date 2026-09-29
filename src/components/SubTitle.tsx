import { Text, TextProps } from "react-native";

export default function SubTitle(props: TextProps) {
  return (
    <Text
      className="text-lg leading-[26px] font-bold text-gray-700"
      {...props}
    />
  );
}

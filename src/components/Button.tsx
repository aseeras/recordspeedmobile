import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";
import cx from "classnames";

export default function Button({
  text = "",
  onPress = () => {},
  buttonStyle = "primary",
  containerStyle = {},
  textStyle = {},
}: {
  text: string;
  secondary?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  buttonStyle?: "primary" | "secondary" | "disabled" | "pro";
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <Pressable
      style={containerStyle}
      disabled={buttonStyle === "disabled"}
      className={cx(
        "flex flex-1 flex-row items-center justify-center rounded-md h-12",
        {
          "bg-gray-300": buttonStyle === "disabled",
          "bg-primary-green": buttonStyle === "primary",
          "bg-white border border-solid border-primary-green":
            buttonStyle === "secondary",
          "bg-brand-blue border border-solid border-brand-blue":
            buttonStyle === "pro",
        }
      )}
      onPress={onPress}
    >
      <Text
        style={textStyle}
        className={`${
          buttonStyle == "disabled"
            ? " text-gray-500"
            : buttonStyle == "secondary"
            ? "text-gray-600"
            : "text-white"
        } text-base font-medium`}
      >
        {text}
      </Text>
    </Pressable>
  );
}

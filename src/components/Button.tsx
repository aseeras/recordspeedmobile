import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import cx from "classnames";

// Firm damping: the press settles smoothly without a visible bounce.
const PRESS_SPRING = { damping: 24, stiffness: 320, mass: 0.6 };

export default function Button({
  text = "",
  onPress = () => {},
  secondary = false,
  buttonStyle: buttonStyleProp = "primary",
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
  // `secondary` is a shorthand some screens use; it was previously ignored.
  const buttonStyle = secondary ? "secondary" : buttonStyleProp;
  const isDisabled = buttonStyle === "disabled";
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    // The wrapper takes over the button's `flex-1` sizing so the press
    // animation can scale it without changing how it lays out.
    <Animated.View style={[{ flex: 1, minHeight: 48 }, animatedStyle]}>
      <Pressable
        style={containerStyle}
        disabled={isDisabled}
        className={cx(
          "flex flex-row items-center justify-center rounded-xl h-12 px-4",
          {
            "bg-gray-200": isDisabled,
            "bg-brand-600": buttonStyle === "primary",
            "bg-white border-2 border-solid border-brand-600":
              buttonStyle === "secondary",
            "bg-brand-blue": buttonStyle === "pro",
          }
        )}
        onPressIn={() => {
          scale.value = withSpring(0.97, PRESS_SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, PRESS_SPRING);
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPress();
        }}
      >
        <Text
          style={textStyle}
          className={`${
            isDisabled
              ? " text-gray-500"
              : buttonStyle == "secondary"
              ? "text-brand-600"
              : "text-white"
          } text-base font-semibold`}
        >
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

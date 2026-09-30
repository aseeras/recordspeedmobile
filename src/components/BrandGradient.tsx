import { LinearGradient } from "expo-linear-gradient";
import { StyleProp, ViewStyle } from "react-native";

// Brand gradient used behind headers, the loader and hero areas.
export const BRAND_GRADIENT = ["#10B981", "#059669", "#047857"] as const;

export default function BrandGradient({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <LinearGradient
      colors={BRAND_GRADIENT}
      // Horizontal so stacked pieces (e.g. a header above a body) line up
      // seamlessly at every x position.
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }, style]}
      pointerEvents="none"
    />
  );
}

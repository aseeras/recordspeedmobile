import { useEffect } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import RecordSpeedLogo from "../../assets/RecordSpeedLogo.png";
import BrandGradient from "./BrandGradient";

export default function Loader() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Gentle "breathing" logo while data loads.
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) })
      ),
      -1
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <>
      <View className="flex-1 w-full h-full items-center justify-center pr-6 pb-24">
        <BrandGradient />
        <Animated.View style={[{ width: 176, height: 176 }, logoStyle]}>
          <Image
            style={{
              width: "100%",
              height: "100%",
            }}
            source={RecordSpeedLogo}
            contentFit="cover"
          />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(150).duration(500)}>
          <Text className="text-white text-center text-2xl font-bold leading-6 -mt-12 ml-6">
            RecordSpeed
          </Text>
        </Animated.View>
      </View>
    </>
  );
}

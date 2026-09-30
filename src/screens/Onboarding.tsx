import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOut,
  FadeInLeft,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import OnboardingStepOneImg from "assets/OnboardingStepOne.png";
import OnboardingStepTwoImg from "assets/OnboardingStepTwo.png";
import OnboardingStepThreeImg from "assets/OnboardingStepThree.png";
import { useNavigationOptions } from "@/lib/navigation/hooks";

const OnboardingStep = ({
  source,
  imageContainerClassName = "",
  titleText = "",
  bodyText = "",
}) => {
  useNavigationOptions({
    options: {
      headerStyle: {
        backgroundColor: "#F3F6FE", // matches the top of the page gradient
      },
    },
  });

  // Slow float so the illustration feels alive.
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, []);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  return (
    <>
      <View className="flex-1 w-full h-full items-center justify-center px-8">
        <View className={imageContainerClassName}>
          {/* White card: the illustrations carry their own light backdrops,
              which blend into white but clash with a tinted shape. */}
          <View
            className="absolute bg-white shadow-lg shadow-brand-900/10"
            style={{ top: -20, left: -20, right: -20, bottom: -20, borderRadius: 36 }}
          />
          <Animated.View
            style={[{ width: "100%", height: "100%" }, floatStyle]}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              source={source}
              contentFit="cover"
            />
          </Animated.View>
        </View>
        <Animated.View entering={FadeInDown.delay(120).duration(450)}>
          <Text className="text-ink text-center text-3xl font-bold leading-9">
            {titleText}
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(220).duration(450)}>
          <Text className="text-ink-muted text-center text-lg leading-7 mt-4">
            {bodyText}
          </Text>
        </Animated.View>
      </View>
    </>
  );
};

function Dot({ active }: { active: boolean }) {
  // The active dot stretches into a pill; the others shrink back.
  const width = useSharedValue(active ? 24 : 10);
  useEffect(() => {
    width.value = withTiming(active ? 24 : 10, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [active]);
  const style = useAnimatedStyle(() => ({ width: width.value }));

  return (
    <Animated.View
      style={[
        {
          height: 10,
          borderRadius: 5,
          backgroundColor: active ? "#4A68DC" : "#C7D2FE", // primary-green / indigo-200
        },
        style,
      ]}
    />
  );
}

const Dots = ({ quantity = 1, activeIndex = 1 }) => {
  return (
    <View className="flex flex-row items-center" style={{ gap: 8 }}>
      {[...Array(quantity)].map((_, index) => (
        <Dot key={index} active={index + 1 == activeIndex} />
      ))}
    </View>
  );
};

export default function Onboarding({ onFinish = () => {} }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const next = ({ onFinalStep = () => {} }) => {
    if (step < 3) {
      setDirection("forward");
      setStep(step + 1);
    } else {
      onFinalStep();
    }
  };
  const previous = () => {
    if (step > 1) {
      setDirection("back");
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Step One
        return (
          <OnboardingStep
            source={OnboardingStepOneImg}
            imageContainerClassName="w-64 h-64 mb-6"
            titleText="Request your medical records"
            bodyText="Pick your hospital or clinic and send a records request in minutes. No phone calls, forms or fax machines."
          />
        );
      case 2: // Step Two
        return (
          <OnboardingStep
            source={OnboardingStepTwoImg}
            imageContainerClassName="w-56 h-56 mb-12"
            titleText="Track every request"
            bodyText="See the status of each request at a glance and get notified as soon as your records are ready."
          />
        );
      case 3: // Step Three
        return (
          <OnboardingStep
            source={OnboardingStepThreeImg}
            imageContainerClassName="w-56 h-56 mb-12"
            titleText="Share them securely"
            bodyText="Send your records to your attorney or anyone you trust, right from the app. You stay in control of who sees them."
          />
        );
    }
  };

  return (
    <View className="flex-1 w-full h-full bg-white">
      <LinearGradient
        colors={["#F3F6FE", "#FFFFFF"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      />
      {/* Let people who already know the app get straight to signing in. */}
      <View className="flex-row justify-end px-6 pt-2">
        <Pressable
          hitSlop={12}
          accessibilityRole="button"
          onPress={() => onFinish()}
          className="px-3 py-1.5 rounded-full bg-white/80"
        >
          <Text className="text-sm font-semibold text-brand-700">Skip</Text>
        </Pressable>
      </View>
      <ScrollView>
        <View className="pt-12 pb-8">
          {/* Re-keying on step replays the slide-in for each page. */}
          <Animated.View
            key={step}
            entering={(direction === "forward" ? FadeInRight : FadeInLeft)
              .duration(360)
              .easing(Easing.out(Easing.cubic))}
            exiting={FadeOut.duration(140)}
          >
            {renderStep()}
          </Animated.View>
        </View>
      </ScrollView>

      <View className="pt-4">
        <View className="flex flex-row justify-center w-full pb-9">
          <Dots quantity={3} activeIndex={step} />
        </View>
        <View className="flex flex-row justify-between w-full px-8 pb-8">
          {step > 1 && (
            <>
              <Button
                buttonStyle="secondary"
                text="Back"
                onPress={() => previous()}
              />
              <View className="w-4" />
            </>
          )}
          <Button
            text={step < 3 ? "Next" : "Get started"}
            onPress={() =>
              next({
                onFinalStep: onFinish,
              })
            }
          />
        </View>
      </View>
    </View>
  );
}

import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
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
        backgroundColor: "#FFFFFF",
      },
    },
  });

  return (
    <>
      <View className="flex-1 w-full h-full items-center justify-center px-8">
        <View className={imageContainerClassName}>
          <Image
            style={{
              width: "100%",
              height: "100%",
            }}
            source={source}
            contentFit="cover"
          />
        </View>
        <Text className="text-gray-700 text-center text-3xl font-bold leading-9">
          {titleText}
        </Text>
        <Text className="text-gray-800 text-center text-lg font-medium leading-6 mt-4">
          {bodyText}
        </Text>
      </View>
    </>
  );
};

const Dots = ({ quantity = 1, activeIndex = 1 }) => {
  return (
    <View className="flex flex-row space-x-8">
      {[...Array(quantity)].map((_, index) => (
        <View
          key={index}
          className={`w-2.5 h-2.5 rounded-full ${
            index + 1 == activeIndex
              ? "bg-primary-green w-3 h-3"
              : "bg-indigo-200"
          }`}
        />
      ))}
    </View>
  );
};

export default function Onboarding({ onFinish = () => {} }) {
  const [step, setStep] = useState(1);

  const next = ({ onFinalStep = () => {} }) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onFinalStep();
    }
  };
  const previous = () => {
    if (step > 1) {
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
            titleText="Lorem ipsum dolor sit amet consectetur."
            bodyText="Lorem ipsum dolor sit amet consectetur. Purus quisque mauris sapien
        amet. Morbi quam donec gravida mi urna enim scelerisque. Nisl sed
        semper tempor feugiat."
          />
        );
      case 2: // Step Two
        return (
          <OnboardingStep
            source={OnboardingStepTwoImg}
            imageContainerClassName="w-56 h-56 mb-12"
            titleText="Lorem ipsum dolor sit amet consectetur."
            bodyText="Lorem ipsum dolor sit amet consectetur. Purus quisque mauris sapien
        amet. Morbi quam donec gravida mi urna enim scelerisque. Nisl sed
        semper tempor feugiat."
          />
        );
      case 3: // Step Three
        return (
          <OnboardingStep
            source={OnboardingStepThreeImg}
            imageContainerClassName="w-56 h-56 mb-12"
            titleText="Lorem ipsum dolor sit amet consectetur."
            bodyText="Lorem ipsum dolor sit amet consectetur. Purus quisque mauris sapien
        amet. Morbi quam donec gravida mi urna enim scelerisque. Nisl sed
        semper tempor feugiat."
          />
        );
    }
  };

  return (
    <View className="flex-1 w-full h-full bg-white">
      <ScrollView>
        <View className="pt-24 pb-8">{renderStep()}</View>
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
                text="Prev"
                onPress={() => previous()}
              />
              <View className="w-4" />
            </>
          )}
          <Button
            text="Next"
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
